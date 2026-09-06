import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync, statSync } from "node:fs";

import bcrypt from "bcryptjs";

// HTTP Basic auth gate for the whole site — the way preprod is kept off the
// public web. It is deliberately **opt-in and manual**: the protection exists
// only while the htpasswd file below holds at least one entry. An absent, empty
// or comment-only file means no auth at all, so production is unaffected unless
// somebody puts credentials there on purpose.
//
// Same mechanism as `server/routes/robots.txt.ts`: the file is read from disk at
// request time (never bundled), and the deployed stack bind-mounts
// `shared/website/.htpasswd` over it. Adding, changing or removing credentials on
// the server therefore takes effect immediately — no rebuild, no restart.
//
// It lives here rather than in the reverse proxy because nginx is configured
// outside this repository; keeping it in the app makes it part of the deploy.
//
// A Nitro plugin on the `request` hook and NOT `server/middleware/`: middleware
// runs after Nitro's public-asset handler, so everything under `.output/public`
// (the whole `/_nuxt/` bundle, anything in `public/`) would still be served
// unauthenticated. This hook runs before any handler.
const HTPASSWD_PATH = process.env.HTPASSWD_PATH || "/app/.htpasswd";
const REALM = process.env.BASIC_AUTH_REALM || "modus";

// The compose healthcheck hits /health without credentials — gating it would
// make every deploy fail on `--wait` as soon as the file is filled in.
const OPEN_PATHS = new Set(["/health"]);

// Verifying a bcrypt hash costs ~100ms on purpose, and one page load fans out
// into dozens of asset requests carrying the same header. Results are memoised
// per (file version, Authorization header) so only the first request of a
// session pays it; failures are cached too, otherwise a password-guessing loop
// would be a free CPU exhaustion vector.
const VERDICT_TTL_MS = 5 * 60 * 1000;
const VERDICT_MAX = 500;
const verdicts = new Map<string, { ok: boolean; expiresAt: number }>();

type Entry = { user: string; hash: string };

let parsed: { version: string; entries: Entry[] } | null = null;
let warnedFor = "";

/**
 * Reads and parses the htpasswd file, re-reading it only when mtime or size
 * changed. Returns an empty list when the file is missing or unreadable, which
 * is what leaves the site open.
 */
function loadEntries(): { version: string; entries: Entry[] } {
    let version: string;

    try {
        const stat = statSync(HTPASSWD_PATH);
        version = `${stat.mtimeMs}:${stat.size}`;
    } catch {
        parsed = null;
        return { version: "none", entries: [] };
    }

    if (parsed?.version === version) return parsed;

    let entries: Entry[] = [];

    try {
        entries = readFileSync(HTPASSWD_PATH, "utf8")
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith("#"))
            .map((line) => {
                const separator = line.indexOf(":");
                if (separator < 1) return null;
                return { user: line.slice(0, separator), hash: line.slice(separator + 1) };
            })
            .filter((entry): entry is Entry => entry !== null && entry.hash.length > 0);
    } catch {
        // unreadable — treated as no credentials, i.e. the site stays open
        entries = [];
    }

    const unsupported = entries.filter((entry) => !isSupported(entry.hash));
    if (unsupported.length > 0 && warnedFor !== version) {
        warnedFor = version;
        console.warn(
            `[basic-auth] ${HTPASSWD_PATH}: unsupported hash format for ${unsupported
                .map((entry) => entry.user)
                .join(", ")}. Use bcrypt ($2y$) or {SHA} — see the README.`,
        );
    }

    parsed = { version, entries };
    return parsed;
}

function isSupported(hash: string): boolean {
    return hash.startsWith("$2") || hash.startsWith("{SHA}");
}

function equals(a: string, b: string): boolean {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
}

/**
 * bcrypt (`htpasswd -B`, PHP `password_hash`) and `{SHA}` (`htpasswd -s`) only.
 * Apache's own default, md5crypt (`$apr1$`), and plaintext entries are rejected —
 * an unsupported line must never read as "no password required".
 */
async function verify(hash: string, password: string): Promise<boolean> {
    if (hash.startsWith("$2")) {
        try {
            return await bcrypt.compare(password, hash);
        } catch {
            return false;
        }
    }

    if (hash.startsWith("{SHA}")) {
        return equals(createHash("sha1").update(password).digest("base64"), hash.slice(5));
    }

    return false;
}

function rememberVerdict(key: string, ok: boolean): boolean {
    if (verdicts.size >= VERDICT_MAX) verdicts.clear();
    verdicts.set(key, { ok, expiresAt: Date.now() + VERDICT_TTL_MS });
    return ok;
}

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("request", async (event) => {
        const { version, entries } = loadEntries();
        if (entries.length === 0) return;

        const path = event.path.split("?")[0] ?? event.path;
        if (OPEN_PATHS.has(path)) return;

        const header = getRequestHeader(event, "authorization") || "";
        const key = `${version}:${createHash("sha256").update(header).digest("base64")}`;
        const cached = verdicts.get(key);

        let ok: boolean;

        if (cached && cached.expiresAt > Date.now()) {
            ok = cached.ok;
        } else {
            const [scheme, encoded = ""] = header.split(" ");
            const credentials = /^basic$/i.test(scheme || "")
                ? Buffer.from(encoded, "base64").toString("utf8")
                : "";
            const separator = credentials.indexOf(":");
            const user = separator < 0 ? "" : credentials.slice(0, separator);
            const password = separator < 0 ? "" : credentials.slice(separator + 1);

            // Every matching entry is checked (a user may legitimately appear
            // twice) and no early exit distinguishes "unknown user" from "wrong
            // password".
            let matched = false;
            for (const entry of entries) {
                if (entry.user !== user) continue;
                if (await verify(entry.hash, password)) matched = true;
            }

            ok = rememberVerdict(key, user.length > 0 && matched);
        }

        if (ok) return;

        setResponseStatus(event, 401);
        setHeader(event, "WWW-Authenticate", `Basic realm="${REALM}", charset="UTF-8"`);
        setHeader(event, "Cache-Control", "no-store");
        setHeader(event, "Content-Type", "text/plain; charset=utf-8");

        // Writing the response here marks the event handled, which is what stops
        // h3 from running any further handler for this request.
        await send(event, "401 Unauthorized");
    });
});

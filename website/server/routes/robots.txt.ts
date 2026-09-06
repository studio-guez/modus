import { existsSync, readFileSync } from "node:fs";

// Served from a runtime file rather than `public/`: Nitro inlines everything
// under `public/` into the server bundle at build time, so a bind mount over
// `.output/public/robots.txt` would be silently ignored (and a public asset
// shadows this route anyway). Reading at request time is what makes
// `shared/website/robots.txt` on the servers editable without a rebuild or a
// restart — e.g. to lock crawlers out of preprod.
//
// In the image the path holds the tracked default (`website/robots.txt`); in the
// deployed stack compose bind-mounts the host's copy over it.
const ROBOTS_PATH = process.env.ROBOTS_TXT_PATH || "/app/robots.txt";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  setHeader(event, "Cache-Control", "no-store");

  try {
    if (existsSync(ROBOTS_PATH)) return readFileSync(ROBOTS_PATH, "utf8");
  } catch {
    // unreadable — fall through to the built-in default
  }

  return "User-agent: *\nAllow: /\n";
});

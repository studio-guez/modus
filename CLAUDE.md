# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a **monorepo** — one git repository, two services:

| Path | Stack | Dev URL |
|---|---|---|
| `cms/` | Kirby 5 CMS, PHP 8.4, Apache | http://cms.localhost |
| `website/` | Nuxt 4, Vue 3, TypeScript, Sass (Node 24, npm) | http://website.localhost |

Routed by Traefik; mail is caught by Mailpit (http://mailpit.localhost).
It replaces the two former repos `studio-guez/modus.backend` (→ `cms/`) and
`studio-guez/modus.webapp` (→ `website/`), imported with `git subtree`. **There are no nested
git repositories any more**: commit from the repo root.

Every original commit is preserved and is an ancestor of `HEAD`, but the imported commits keep
their *sub-repo* paths (`site/…`, `nuxt.config.ts`) — they predate the `cms/` and `website/`
prefixes. So a path-scoped `git log cms/<file>` stops at the import merge, and `--follow` does
not cross it either. Pass both paths and `--full-history`:

```bash
git log --full-history -- cms/site/config/config.php site/config/config.php
git log --full-history -- website/nuxt.config.ts nuxt.config.ts
```

`git blame` on a current file works normally.

`README.md` is the operational reference (dev setup, upgrades, deployment architecture,
required Actions secrets). `deploy.md` / `deploy.old.md` are gitignored private rsync
cheat-sheets holding real server addresses — never quote their contents into tracked files.

## Never run project toolchains on the host

`npm`, `node`, `npx`, `php` and `composer` are **not** meant to be run locally. Everything runs
inside the dev containers defined in `compose.dev.yml`. Always prefix with
`docker compose -f compose.dev.yml exec`, from the repo root. Use `-T` when the command is
non-interactive (always the case for agent runs).

| What you want to run | Command |
| --- | --- |
| npm in `website/` | `docker compose -f compose.dev.yml exec -T website npm <args>` |
| php / composer / Kirby CLI | `docker compose -f compose.dev.yml exec -T --user www-data cms php <args>` |

**Always pass `--user www-data` to `exec ... cms`.** `exec` defaults to root inside the
container, while Apache/PHP runs as `www-data`. Any script that boots Kirby writes to
`site/cache/` (UUID index, `changes/pages.cache`), and a root-owned file there makes the
Panel fail to save with a 500 — `The file "{site}/cache/.../pages.cache" is not writable`.
Repair with `docker compose -f compose.dev.yml exec -T cms chown -R www-data:www-data /var/www/html/site/cache`
(or just restart the service — `cms/entrypoint.sh` chowns the runtime dirs on every start).

Working directories inside the containers: `/app` for the website, `/var/www/html` for the
CMS (so repo path `cms/_utils/Utils.php` is `_utils/Utils.php` there).

If a container is not running, start it (`docker compose -f compose.dev.yml up -d <service>`)
rather than falling back to the host. `git`, `docker`/`docker compose` and plain file
inspection (`ls`, `grep`, `cat`) are the only host-side exceptions.

## Commands

```bash
docker compose -f compose.dev.yml up -d --build           # whole stack
docker compose -f compose.dev.yml exec -T website npm run typecheck   # vue-tsc; build does NOT type-check
docker compose -f compose.dev.yml exec -T website npm run build
docker compose -f compose.dev.yml exec -T --user www-data cms composer install
docker compose -f compose.dev.yml exec -T --user www-data cms composer audit
curl http://cms.localhost/menus.json                      # hit an API endpoint
```

Composer and npm dependencies are installed **inside the images at build time** — there is no
`composer install` step after `up`. `cms/vendor/` and `cms/kirby/` come from the image;
`website/node_modules` lives in the `website_node_modules` named volume, seeded from the image.

`compose.dev.yml` bind-mounts individual paths under `cms/`, not the whole directory. A scratch
script dropped in `cms/` is invisible inside the container — put it in `cms/_utils/`.

There is **no test suite** in this repo. "Verify" always means a real `curl` against the CMS
plus `npm run typecheck` / `npm run build` on the website.

## Architecture

The backend is a **headless Kirby CMS**: editors work in the Kirby panel, and the Nuxt app
consumes JSON over HTTP. The two sides are coupled only through that JSON contract.

### The JSON API

Two mechanisms produce it, both in `cms/site/`:

1. **Content representations** — `site/templates/<template>.json.php` renders any page at
   `<page-uri>.json` (e.g. `/projects.json`, `/bibliotheque/foo.json`). The `.php` sibling
   template is usually empty; the `.json.php` file *is* the API.
2. **Custom routes** in `site/config/config.php` — synthetic endpoints backed by a template but not
   by a content page: `menus.json`, `news.json`, `project-tags.json`, `pages-info.json`,
   `sitemap-data.json`, `GET|POST /contact`, and `rapport/<slug>/pdf` (mPDF via `report.pdf.php`).
   `/` redirects to `/panel`.

CORS is opened globally by the `page.render:before` hook plus an explicit header per route.
The API does **not** send `Content-Type: application/json`, which is why every call in
`website/composable/adminApi/apiFetch.ts` passes `responseType: 'json'` — do not remove it.

**Adding or changing a content field is a four-file change**: blueprint
(`site/blueprints/…`) → JSON template (`site/templates/*.json.php`) → TypeScript interface
(`website/composable/adminApi/apiDefinitions.ts`) → Vue component. `cms/_utils/Utils.php` holds
the shared serialization helpers (image data + `resize` variants, `page://` UUID resolution for
tags and highlights); reuse them rather than hand-rolling image/tag payloads.

### Frontend data flow

- `composable/adminApi/apiFetch.ts` is the single entry point to the backend. `getBaseUrl()` picks
  `apiBaseUrlServer` (`NUXT_API_BASE_URL_SERVER`, container-internal, used during SSR) or
  `public.apiBaseUrl` (`NUXT_PUBLIC_API_BASE_URL`, browser-facing). Both are set per-service in
  `compose.dev.yml` / `compose.prod.yml`; the public one is also baked in at image build time via
  the `NUXT_PUBLIC_API_BASE_URL` Dockerfile ARG, because `nuxt.config.ts` interpolates it into the
  `og:image` / `twitter:image` meta tags.
- Pages under `pages/` fetch with `useAsyncData` keyed by slug and pass the raw `body` array to
  `components/AppPage.vue`, which dispatches each Kirby block to an `App*` component by its
  `content.type`. Adding a new block type means adding a blueprint fieldset *and* a branch there.
- `composable/main.ts` holds all cross-component state as `useState` refs (menus, cookie banner,
  Spotify/YouTube players, actualités, h2 anchor list). `plugins/shared-data.ts` primes the
  actualités during SSR.
- `middleware/redirect-media.global.ts` re-routes `/media/site/*` requests back to the CMS host —
  media files are always served by the backend, never bundled.
- `server/routes/health.ts` returns `ok` without touching the CMS. It exists for the compose
  healthcheck — keep it dependency-free, otherwise a slow API fails the whole deploy.
- `server/routes/sitemap.xml.ts` builds the sitemap from the CMS `sitemap-data.json` endpoint.
- `server/routes/robots.txt.ts` reads `/app/robots.txt` at request time — see the deploy notes
  below for why it is a route and not a `public/` file.

### Editorial permissions

The `contributeur` role is deliberately fenced in, and the rules are enforced in **two places that
must agree**: hooks in `site/config/config.php` (`page.create/update/changeStatus/delete:before`)
and `permissions()` overrides in `site/models/project.php` / `report.php`. A contributeur may only
create, edit, and delete their *own draft* `project`/`report` pages, and may never change status.
Ownership is recorded in a `createdBy` field written by the `page.create:after` hook. Changing the
rules in only one of the two places produces a panel that lies about what it will allow.

Deleting a `tag` page also strips its `page://` UUID from every page referencing it (delete hook).

### Custom Kirby plugins (`cms/site/plugins/`)

- `image-guard` — downsizes oversized images and converts CMYK JPEGs on upload/replace, so Kirby's
  later thumbnail generation cannot exhaust PHP memory. Shared logic in `ImageGuard.php`;
  `fix-large-images.php` applies it retroactively.
- `custom-marks` — adds a `<mark>` highlight to the writer field (and to `Html::$allowedTags`,
  otherwise sanitization strips it).
- `unique-shortcode` — a `text`-derived panel field with a `prefix` prop, for reference codes.

### Contact form hardening

`site/controllers/contact.php` layers, in order: honeypot field (`website`), IP-hashed rate limiting
via the `contact-form` file cache (10 per 15 min), input collection that keeps raw values for
analysis, Kirby validation, then `_utils/SpamGuard.php` heuristic scoring (≥7 silently discarded,
≥3 delivered with a `[À VÉRIFIER]` subject prefix). Every rejection path returns the same fake
success message so bots get no feedback. The matching client is `website/components/AppForm.vue`,
which POSTs to `<apiBaseUrl>/contact`.

## Deploy / CI notes

- `.github/workflows/ci.yml` builds one GHCR image per changed service
  (`ghcr.io/studio-guez/modus/<service>`); push to `preprod` deploys preprod, push to `main` or a
  `v*` tag deploys production. Change detection compares against the last successful run on the
  *same* branch, so a failed run's changes are not lost on the next push.
- `.github/actions/deploy/action.yml` is a composite action running on the self-hosted runner of
  each server. It publishes a release directory, bootstraps `shared/`, backs up content/accounts/
  license, pulls the new images, fixes ownership, flips the `current` symlink, and brings the stack
  up with `--wait`. Services not rebuilt in a run keep their recorded tag from
  `shared/current-tags/<service>.txt`.
- **Permissions are load-bearing.** Everything under `shared/` is chowned to `www-data` and made
  group-writable + setgid by the deploy action (in a throwaway root container, since the runner
  cannot chown www-data files). The deploy user is a member of the `www-data` group, which is what
  makes `cms.env`, `deploy.env`, the tag files and rsynced content editable on the host without
  sudo. `cms/entrypoint.sh` re-applies the same rules on every container start and sets
  `umask 0002` so Kirby's own runtime writes stay group-writable. Don't "simplify" any of this —
  dropping the setgid bit or the umask silently breaks Panel saves after the next rsync.
- `compose.prod.yml` persists only mutable state via bind mounts under `${SHARED_PATH}`. Never
  mount anything on `/var/www/html` or `site/plugins` — a named volume is seeded from the image
  only when empty and would freeze the code at its first-`up` version.
- The website's `robots.txt` is deliberately **not** in `website/public/`: Nitro inlines public
  assets into the server bundle at build time, so a bind mount over `.output/public/robots.txt`
  does nothing (and a public asset shadows a same-named server route). It is served by
  `website/server/routes/robots.txt.ts`, which reads `/app/robots.txt` per request — the image
  ships the tracked `website/robots.txt` there, and prod bind-mounts `shared/website/robots.txt`
  over it. Editing it on the server takes effect immediately.
- `.env*` files are gitignored and seeded from `.example` files on first deploy. Never commit
  secrets, and never print them in terminal output.

## Gotchas

- `cms/content/`, `cms/media/`, `cms/vendor/`, `site/accounts`, `site/sessions`, and
  `site/cache` are gitignored. Content edits made through the panel are **not** version-controlled.
  `cms/kirby/` *is* committed even though composer also installs it.
- Secrets and URLs come from env vars read in `site/config/config.php` (`CMS_URL`, `KIRBY_DEBUG`,
  `KIRBY_CONTENT_SALT`, `KIRBY_COOKIE_KEY`, `SMTP_*`, `EMAIL_FROM_*`). Nothing is committed.
  `CMS_URL` is mandatory on the servers — the deploy action refuses to start the stack without it,
  because SSR fetches the API at `http://cms` and Kirby would otherwise emit unresolvable media URLs.
- `website/docs/` is a committed static export for GitHub Pages and `website/_PreNuxtConfigScripts/`
  is a Bun script that pre-generated route lists — both are build leftovers, not live source.
- Sub-repo README drift: `website/README.md` describes `ssr: false` with prerendering and a
  `build.github.page` script; `nuxt.config.ts` currently sets `ssr: true` and no such npm script
  exists. Both sub-READMEs also still document the old per-repo `docker-compose.yml`, which the
  root `compose.dev.yml` replaced. Trust the root `README.md` and the config files.
- `website/.nvmrc` says v18.18.2 while both Docker images and CI use Node 24; the containers are
  authoritative.
- Content lives in `cms/content/` as flat `.txt` files in numeric-prefixed directories
  (`7_modus`); the prefix sets panel order and the suffix *is* the URL slug — renaming a directory
  changes the public URL and any hardcoded route that points at it.

## Claude-specific instructions

- Use Plan mode before large refactors (multi-file changes, `_utils/Utils.php` extractions,
  anything touching the JSON contract consumed by the website).
- Do not commit or push unless explicitly asked. Never use `--no-verify`.
- zsh gotcha: unmatched globs error out, so quote them (`--include='*.php'`), and prefer
  `&&` over `;` when chaining.

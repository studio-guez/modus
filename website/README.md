# Modus Webapp - Nuxt 4 Application

A modern web application built with Nuxt 4, running on Node.js 24 in a Docker environment.
It is configured as a client-side app (`ssr: false`) that is prerendered to static files.

## Tech stack

| Tool | Version |
| --- | --- |
| Node.js | 24 (LTS) |
| Nuxt | ^4.4.8 |
| Vue | ^3.5.39 |
| Vue Router | ^5.1.0 |
| TypeScript | ^6.0.3 |
| Sass | ^1.101.0 |

> Nuxt DevTools is bundled with Nuxt 4 (enabled via `devtools: { enabled: true }` in `nuxt.config.ts`) — there is **no** standalone `@nuxt/devtools` dependency.

## Clone & Docker instructions

1. `git clone <repository-url>`
1. `cd modus.webapp/`
1. _Verify config, especially port conflicts in_ `docker-compose.yml`

## Local Development (with Docker)

```bash
docker-compose up
```

This will:
- Mount your local files into the container
- Install dependencies automatically
- Start the Nuxt dev server with hot-reload
- The application will be available at http://localhost:3000

## Production Build (with Docker)

```bash
docker-compose --profile production up app
```

This will build and run the production Nitro server (serving the prerendered client-side app) at http://localhost:3001

## Running npm commands in Docker

> **Always run npm inside the Docker container** — do not install or run npm on the host.

To run any npm command inside the running dev container:

```bash
docker-compose exec dev npm run <command>
```

For a one-off command (without a running dev service):

```bash
docker compose run --rm --no-deps dev sh -c "npm <command>"
```

Or open a shell in the container:

```bash
docker-compose exec dev bash
```

## Type checking

```bash
docker-compose exec dev npm run typecheck
```

> `nuxt build` transpiles with esbuild and does **not** type-check. Run `npm run typecheck` (powered by `vue-tsc`) separately to validate types.

## Build for production

1. `npm run build`
1. `npm run preview` to preview the production build locally

## Generate static site

1. `npm run generate`
1. Static files will be output to `.output/public`

## Build for GitHub Pages

1. `npm run build.github.page`
1. This will generate static files in the `docs/` folder

## Default access URLs (with default ports)

- **Application**: http://localhost:3000

## Updating the project

All dependency work **must** be done inside the Docker container (see
["Running npm commands in Docker"](#running-npm-commands-in-docker)). The host is
never used for npm.

### Important: how the dev container handles `node_modules`

The `dev` service mounts the project via `.:/app` and uses an **anonymous volume**
for `/app/node_modules`. That volume is wiped when a `docker compose run --rm`
container exits, so `install` and any command that needs the packages
(`build`, `typecheck`, …) must run in the **same** invocation:

```bash
docker compose run --rm --no-deps dev sh -c "npm ci && npm run build"
```

The lockfile (`package-lock.json`) is written back to the host through the bind
mount, so regenerating it this way is safe.

### Routine dependency updates

1. Check outdated packages:
   ```bash
   docker compose run --rm --no-deps dev sh -c "npm outdated"
   ```
1. Bump versions in `package.json` (or let npm do it), then regenerate the lockfile:
   ```bash
   docker compose run --rm --no-deps dev sh -c "npm install"
   ```
1. Audit and fix vulnerabilities:
   ```bash
   docker compose run --rm --no-deps dev sh -c "npm audit"
   docker compose run --rm --no-deps dev sh -c "npm audit fix"
   ```
1. Validate in a single container run:
   ```bash
   docker compose run --rm --no-deps dev sh -c "npm ci && npm run typecheck && npm run build"
   ```

### Updating Node.js

The Node version is pinned in three places — keep them in sync:

- `Dockerfile` — `FROM node:<version>` (build stage) and `node:<version>-alpine` (production stage)
- `docker-compose.yml` — `image: node:<version>` for the `dev` service

Prefer the current active LTS. After changing it, rebuild and re-validate with the
single-run command above.

### Gotchas for major upgrades (learned during the Nuxt 3 → 4 migration)

- **Nuxt DevTools** is built into Nuxt 4. Do **not** add a standalone
  `@nuxt/devtools` dependency — it causes peer-dependency conflicts. Enable it
  with `devtools: { enabled: true }`.
- **Prerendering**: Nuxt 4 removed `generate.routes`. Use
  `nitro.prerender.routes` in `nuxt.config.ts` instead.
- **Vue Router 5** ships with Nuxt 4; `useRoute()`/`useRouter()` are auto-imported
  as before. Watch for stricter `LocationQuery` value types (`string | null`).
- **Stricter TypeScript** (Nuxt 4 tsconfig + TS 6):
  - `verbatimModuleSyntax` requires type-only imports to use `import type { … }`.
  - `noUncheckedIndexedAccess` makes `arr[i]` `T | undefined` — guard it.
  - Do **not** import `defineProps` (or other `<script setup>` macros) from `vue`;
    they are auto-injected and importing them raises a TS2440 conflict.
- Run `npm run typecheck` after any upgrade — the build alone will not catch these.

### Production / staging orchestration

This repository is deployed via the top-level `../docker-compose.yml`, which builds
the frontend from a **deploy copy** (`modus-deploy/modus.webapp-main`), not directly
from this workspace. When shipping changes, make sure the updated `Dockerfile`,
`package.json`, and `package-lock.json` are propagated to that deploy copy.
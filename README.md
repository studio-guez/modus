# Modus

A two-service platform running Kirby CMS (headless JSON API) and a Nuxt website,
orchestrated with Docker and Traefik.

## Architecture

```
├── cms/             Kirby CMS 5 (PHP 8.4, Apache)
├── website/         Nuxt 4 / Vue 3 frontend (Node 24, npm)
├── compose.dev.yml  Docker Compose for local development
└── compose.prod.yml Docker Compose for the deployed stack (preprod & production)
```

In **development**, services are routed through the **Traefik** reverse proxy.
In **preprod/production**, each container publishes only on a loopback port and
the host-level nginx handles domains and TLS (see [Deployment architecture](#deployment-architecture)).

| Service | Local URL                | Production URL             |
| ------- | ------------------------ | -------------------------- |
| CMS     | http://cms.localhost     | https://cms.modus-ge.ch    |
| Website | http://website.localhost | https://modus-ge.ch        |
| Mailpit | http://mailpit.localhost | — (dev only)               |
| Traefik | http://localhost:8888    | —                          |

This repository is the consolidation of the two former repositories
`studio-guez/modus.backend` (now `cms/`) and `studio-guez/modus.webapp` (now
`website/`), imported with `git subtree` — every original commit is preserved and
is an ancestor of `HEAD`. Both source repositories are now **archived and
read-only** on GitHub: nothing is developed, released or deployed from them any
more, and their issues and pull requests belong here instead.

Those imported commits predate the `cms/` and `website/` prefixes, so they still
carry the sub-repo's own paths. A path-scoped `git log cms/<file>` therefore stops
at the import merge; pass both paths with `--full-history` to see the whole story:

```bash
git log --full-history -- cms/site/config/config.php site/config/config.php
git log --full-history -- website/nuxt.config.ts nuxt.config.ts
```

### Tech stack

| Service   | Tool       | Version  | Pinned in                                                              |
| --------- | ---------- | -------- | ---------------------------------------------------------------------- |
| `cms/`    | PHP        | 8.4      | `cms/Dockerfile.dev`, `cms/Dockerfile.prod`, `cms/composer.json`, `ci.yml` |
| `cms/`    | Kirby      | ^5.0     | `cms/composer.json`                                                     |
| `cms/`    | mPDF       | ^8.2     | `cms/composer.json`                                                     |
| `website/`| Node.js    | 24       | `website/Dockerfile.dev`, `website/Dockerfile.prod`, `ci.yml`           |
| `website/`| Nuxt       | ^4.4.8   | `website/package.json`                                                  |
| `website/`| Vue        | ^3.5.39  | `website/package.json`                                                  |
| `website/`| Vue Router | ^5.1.0   | `website/package.json`                                                  |
| `website/`| TypeScript | ^6.0.3   | `website/package.json`                                                  |
| `website/`| Sass       | ^1.101.0 | `website/package.json`                                                  |

Each version appears in several files that must stay in sync — see
[Upgrading](#upgrading). `website/.nvmrc` still says `v18.18.2` and is stale; the
containers and CI are authoritative.

> Nuxt DevTools is bundled with Nuxt 4 (enabled via `devtools: { enabled: true }`
> in `nuxt.config.ts`) — there is **no** standalone `@nuxt/devtools` dependency,
> and adding one causes peer-dependency conflicts.

### The JSON API

The backend is a **headless Kirby CMS**: editors work in the Kirby panel, and the
Nuxt app consumes JSON over HTTP. Two mechanisms produce it, both in `cms/site/`:

1. **Content representations** — `site/templates/<template>.json.php` renders any
   page at `<page-uri>.json` (e.g. `/projects.json`, `/bibliotheque/foo.json`).
2. **Custom routes** in `site/config/config.php` — synthetic endpoints backed by a
   template but not by a content page: `menus.json`, `news.json`,
   `project-tags.json`, `pages-info.json`, `sitemap-data.json`,
   `GET|POST /contact`, and `rapport/<slug>/pdf` (mPDF). `/` redirects to `/panel`.

CORS is opened globally by the `page.render:before` hook plus an explicit header
per route. The API does **not** send `Content-Type: application/json`, which is why
every call in `website/composable/adminApi/apiFetch.ts` passes
`responseType: 'json'` — do not remove it.

### CMS plugins

| Plugin             | Notes                                                     |
| ------------------ | --------------------------------------------------------- |
| `image-guard`      | Downscales oversized uploads, converts CMYK JPEGs to RGB  |
| `custom-marks`     | Adds `<mark>` highlighting to the writer field            |
| `unique-shortcode` | `text`-derived panel field with a `prefix` prop           |

## Local Development

### Prerequisites

- Docker & Docker Compose
- Git

### 1. Clone the repository

```bash
git clone https://github.com/studio-guez/modus.git
cd modus/
```

### 2. Set up environment variables

```bash
cp cms/.env.example cms/.env
```

Then edit `cms/.env` and set unique random values for `KIRBY_CONTENT_SALT` and
`KIRBY_COOKIE_KEY` (generate with `openssl rand -hex 32`). The `SMTP_*` values in
`compose.dev.yml` already point at the Mailpit container, so outgoing mail is
caught locally instead of being sent (view it at http://mailpit.localhost).

### 3. Build and start all services

```bash
docker compose -f compose.dev.yml up -d --build && docker compose -f compose.dev.yml logs -f cms website
```

Composer and npm dependencies are installed **inside the images at build time** —
there is no `composer install` step after `up`.

### 4. Load the content

`cms/content/` is gitignored, so a fresh clone starts empty. Pull it from a
server (see [Sync content from a server](#sync-content-from-a-server-local)) or
copy it from another checkout.

### Access the services

- **CMS Panel**: http://cms.localhost/panel
- **Website**: http://website.localhost
- **Mailpit** (dev mail catcher): http://mailpit.localhost
- **Traefik Dashboard**: http://localhost:8888

### Development workflow

- **CMS**: `cms/site/` (blueprints, config, controllers, models, plugins,
  templates), `cms/_utils/`, `cms/assets/`, `cms/index.php` and `cms/content/` are
  bind-mounted into the container, so changes are reflected immediately.
  `vendor/` and `kirby/` come from the image.
- **Website**: source files are mounted with hot-reload via the Nuxt dev server.
  `node_modules` lives in a named volume, seeded from the image.

> `compose.dev.yml` bind-mounts individual paths under `cms/`, not the whole
> directory. A scratch script dropped in `cms/` is invisible inside the container —
> put it in `cms/_utils/` (which is `/var/www/html/_utils/` there).

### Makefile shortcuts

A root `Makefile` wraps the commands below (it only ever calls
`docker compose -f compose.dev.yml` — nothing runs on the host). `make` or
`make help` lists every target:

```bash
make setup        # create cms/.env from the example
make up           # start the stack       (make rebuild to rebuild the images)
make logs         # follow cms + website logs
make verify       # typecheck + website build + curl the JSON endpoints
make npm ARGS="install foo"        # any npm command in the website container
make composer ARGS="require foo"   # any composer command in the cms container
make fix-perms    # give site/cache back to www-data after a root-owned write
```

The Makefile is a convenience layer, not a requirement: every target maps to one
of the raw commands documented here.

### Running project toolchains

`npm`, `node`, `php` and `composer` are **not** meant to be run on the host —
everything runs inside the dev containers:

```bash
docker compose -f compose.dev.yml exec -T website npm run typecheck
docker compose -f compose.dev.yml exec -T website npm run build
docker compose -f compose.dev.yml exec -T --user www-data cms composer install
docker compose -f compose.dev.yml exec -T --user www-data cms composer audit
```

**Always pass `--user www-data` to `exec ... cms`.** `exec` defaults to root inside
the container, while Apache/PHP runs as `www-data`. Any script that boots Kirby
writes to `site/cache/`, and a root-owned file there makes the Panel fail to save
with a 500 (`The file "{site}/cache/.../pages.cache" is not writable`). Repair with:

```bash
docker compose -f compose.dev.yml exec -T cms chown -R www-data:www-data /var/www/html/site/cache
```

…or just restart the service — `cms/entrypoint.sh` chowns the runtime directories
on every start.

There is **no test suite** in this repo. "Verify" means a real `curl` against the
CMS plus `npm run typecheck` / `npm run build` on the website:

```bash
curl http://cms.localhost/menus.json
curl http://cms.localhost/news.json
curl http://cms.localhost/projects.json
```

## Maintenance: fix oversized / CMYK images

Oversized originals and CMYK JPEGs (a common export from Illustrator/Photoshop)
can exhaust PHP's memory limit when Kirby/GD generates thumbnails. New uploads are
handled automatically by the `image-guard` plugin
(`cms/site/plugins/image-guard`), which downscales images whose longest edge
exceeds the configured limit and converts CMYK JPEGs to RGB.

For images that are already in `content/`, run the one-off cleanup script inside
the container:

```bash
# List what would change, without writing anything:
docker compose -f compose.dev.yml exec --user www-data cms php site/plugins/image-guard/fix-large-images.php --dry-run

# Actually fix the files in place:
docker compose -f compose.dev.yml exec --user www-data cms php site/plugins/image-guard/fix-large-images.php
```

Afterwards, clear the media cache so Kirby regenerates thumbnails from the fixed
originals:

```bash
docker compose -f compose.dev.yml exec cms sh -c 'rm -rf media/pages media/site'
```

## Sync content from a server (local)

On the servers, all mutable CMS state lives under `$DEPLOY_PATH/shared/cms/`
(see [Layout on each target server](#layout-on-each-target-server)).

```bash
rsync -avz --delete -e "ssh -i ~/.ssh/<key>" <user>@<server>:<deploy_path>/shared/cms/content/ ./cms/content
rsync -avz --delete -e "ssh -i ~/.ssh/<key>" <user>@<server>:<deploy_path>/shared/cms/site/accounts/ ./cms/site/accounts
```

When rsyncing in the **other direction** (local → server), add
`--no-perms --omit-dir-times`: everything under `shared/` is owned by `www-data`
and only a file's owner may change its mode or a directory's mtime, so plain `-a`
exits 23 (`failed to set times on ".../content/."`) even though the data was
transferred. The transferred files end up owned by the SSH user; the next deploy
fixes ownership automatically, or run the chown/chmod command from step 3 of
[First deploy](#first-deploy).

## Upgrading

Follow these steps whenever you bump dependency or Docker base-image versions.
After upgrading, always rebuild the images (`--build`) — a plain `up` keeps
running the old ones.

### Website (Nuxt)

All `npm` commands run inside the running dev container — no local Node
installation is needed.

1. **Node**: bump the `node:<version>-alpine` base image in `Dockerfile.dev` and
   `Dockerfile.prod`, and the `node-version` in `.github/workflows/ci.yml` (keep
   them in sync).
2. **Update dependencies**:

   ```bash
   docker compose -f compose.dev.yml exec website npm outdated
   docker compose -f compose.dev.yml exec website npm install
   ```

   To upgrade beyond the current ranges (e.g. a new Nuxt major), edit the version
   constraints in `package.json` first, then re-run.

3. **Audit for vulnerabilities**:

   ```bash
   docker compose -f compose.dev.yml exec website npm audit
   docker compose -f compose.dev.yml exec website npm audit fix
   ```

4. **Prune stale workarounds**: the `overrides` block in `package.json` is a
   stopgap for upstream problems and npm never reports it as obsolete. Worse, an
   override caps the range for every consumer in the tree, so a forgotten one
   silently blocks future majors. After each upgrade, comment it out, re-run
   `npm install` and `npm audit`, and delete whatever is no longer needed.
5. **Verify** — `nuxt build` transpiles with esbuild and does **not** type-check,
   so both commands matter:

   ```bash
   docker compose -f compose.dev.yml exec website npm run typecheck
   docker compose -f compose.dev.yml exec website npm run build
   ```

6. **Rebuild the container** to bake the updated lockfile into the image:

   ```bash
   docker compose -f compose.dev.yml up -d --build website
   ```

#### Gotchas for major upgrades (learned during the Nuxt 3 → 4 migration)

- **Nuxt DevTools** is built into Nuxt 4. Do **not** add a standalone
  `@nuxt/devtools` dependency — it causes peer-dependency conflicts. Enable it
  with `devtools: { enabled: true }`.
- **Prerendering**: Nuxt 4 removed `generate.routes`. Use
  `nitro.prerender.routes` in `nuxt.config.ts` instead.
- **Vue Router 5** ships with Nuxt 4; `useRoute()` / `useRouter()` are
  auto-imported as before. Watch for stricter `LocationQuery` value types
  (`string | null`).
- **Stricter TypeScript** (Nuxt 4 tsconfig + TS 6):
  - `verbatimModuleSyntax` requires type-only imports to use `import type { … }`.
  - `noUncheckedIndexedAccess` makes `arr[i]` `T | undefined` — guard it.
  - Do **not** import `defineProps` (or other `<script setup>` macros) from
    `vue`; they are auto-injected and importing them raises a TS2440 conflict.
- Run `npm run typecheck` after any upgrade — `nuxt build` transpiles with
  esbuild and will not catch these.

### CMS (Kirby)

All `composer` commands run inside the running dev container — no local
PHP/Composer installation is needed.

1. **PHP / Apache**: bump the `php:<version>-apache` base image in
   `cms/Dockerfile.dev` and `cms/Dockerfile.prod`, align the `php` constraint in
   `cms/composer.json`, and the `php-version` in `.github/workflows/ci.yml`.
2. **Update Kirby & Composer dependencies**:

   ```bash
   docker compose -f compose.dev.yml exec --user www-data cms composer update
   ```

   To upgrade beyond the current constraints (e.g. a new Kirby major), edit
   `cms/composer.json` first, then re-run.

   > The Docker image copies `composer.json` and `composer.lock` and runs
   > `composer install`, so builds are reproducible and pinned to the exact
   > versions in the lock file. Commit `composer.lock` after every update.

3. **Audit for vulnerabilities**:

   ```bash
   docker compose -f compose.dev.yml exec --user www-data cms composer audit
   ```

4. **Verify & rebuild**:

   ```bash
   docker compose -f compose.dev.yml up -d --build cms
   ```

   Then log into the Panel at http://cms.localhost/panel and check the website
   still receives API data.

5. **Production**: merge/push to `preprod` or `main` — CI rebuilds the image and
   deploys it (see [Deployment architecture](#deployment-architecture)).

## Troubleshooting

- **`Class "Kirby" not found`**: the CMS image installs `vendor/` and `kirby/` at
  build time, so this means the image is stale — rebuild it with
  `docker compose -f compose.dev.yml up -d --build cms`.
- **PHP extension errors**: `mbstring`, `gd`, `zip` and `opcache` are compiled
  into both CMS images. If one is missing, the image predates that change —
  rebuild.
- **Permission errors on CMS**: In development, the image maps the `www-data` user
  to your host user via the `UID` / `GID` build args in `compose.dev.yml`
  (defaults: `1000` / `1000`). If your host user has a different UID/GID, adjust
  the args and rebuild with `docker compose -f compose.dev.yml build cms`.
- **Port conflicts**: Ensure ports `80`, `1025`, `3000`, `8025`, `8080`, `8888`
  (dev) or the loopback ports from `deploy.env` (deployed stack, defaults
  `8080`–`8081`) are not in use.
- **Another project's dev stack answering on `cms.localhost`**: Traefik discovers
  every container on the Docker daemon, and sibling projects (e.g. `forpro`) use
  the same router names (`cms`, `website`) and `*.localhost` host rules. If two
  such stacks run at once, Traefik load-balances between them and requests
  alternate between the two projects. Stop the other stack — only one
  `*.localhost` dev stack can run at a time.

## Deployment architecture

This repository is **only** responsible for building and shipping the two
application container images. It is **not** responsible for TLS, virtual-host
routing, or any other reverse-proxy concern — those are handled by the nginx
installed directly on each target server, completely outside this project.

The deployed stack contains exactly two services (see `compose.prod.yml`):

- `cms`     — Kirby CMS (PHP 8.4 / Apache)
- `website` — Nuxt frontend (Node 24, Nitro server)

Each service publishes on `${BIND_ADDRESS}:<port>` (defaults `127.0.0.1` and
`8080`–`8081`, configurable in `$DEPLOY_PATH/shared/deploy.env` or, for the ports,
via the per-environment `*_HTTP_PORT` Actions variables). The reverse proxy must
forward each public domain to the matching address and port:

| Domain                  | Service | Default loopback port |
| ----------------------- | ------- | --------------------- |
| https://cms.modus-ge.ch | cms     | `127.0.0.1:8080`      |
| https://modus-ge.ch     | website | `127.0.0.1:8081`      |

When the reverse proxy runs on **another machine** (e.g. staging behind a shared
proxy), loopback publishing makes the services unreachable. Set `BIND_ADDRESS` in
`$DEPLOY_PATH/shared/deploy.env` to the server's private IP so the proxy can reach
the ports over the private network:

```bash
# $DEPLOY_PATH/shared/deploy.env
BIND_ADDRESS=10.100.0.241
```

Then recreate the stack (`docker compose … up -d`). Never use `0.0.0.0` — these
ports carry plain HTTP and must stay off the public interface.

There is no `composer`, `node` or `npm` on the target servers — only Docker, the
application stack above, and the host-level nginx.

### Server-side rendering talks to the CMS internally

The Nuxt app renders server-side, so its API calls would otherwise hairpin out
through the public domain and back in through nginx. In the deployed stack it uses
`NUXT_API_BASE_URL_SERVER=http://cms` (the compose service name) instead — see
`getBaseUrl()` in `website/composable/adminApi/apiFetch.ts`. Browser-side code
keeps using the public `NUXT_PUBLIC_API_BASE_URL`.

Because Kirby derives absolute URLs from the incoming request, the CMS must pin
its base URL with `CMS_URL` in `cms.env`; without it the API would hand out
`http://cms/media/…` links that no browser can resolve. The deploy action refuses
to start the stack when `CMS_URL` is missing. `NUXT_API_BASE_URL_SERVER` is unset
in development, where the container reaches `cms.localhost` through Traefik on the
Docker host.

The website also exposes a `/health` endpoint that returns `ok` without touching
the CMS. The compose healthcheck targets it, so a temporarily unreachable or slow
CMS no longer marks the frontend unhealthy and fails the whole deploy.

### Two environments

| Branch    | GitHub Environment | Image tags pushed               | Where it deploys     |
| --------- | ------------------ | ------------------------------- | -------------------- |
| `preprod` | `preprod`          | `preprod-sha-<sha7>`, `preprod` | preproduction server |
| `main`    | `production`       | `sha-<sha7>`, `latest`          | production server    |
| tag `v*`  | `production`       | `sha-<sha7>`, `latest`          | production server    |

Each environment uses its own GitHub Environment (`preprod` / `production`) to
store secrets. Production secrets are never visible to the preprod job and vice
versa. The deploy jobs each run on a self-hosted runner registered on the
corresponding server.

`workflow_dispatch` accepts a `target` input (`preprod` or `production`) and a
`services` input (`all` by default, or a comma-separated subset) for one-off
manual deploys:

```bash
# Trigger a manual deploy of everything to preproduction
gh workflow run ci.yml --ref preprod -f target=preprod

# Trigger a manual deploy of everything to production
gh workflow run ci.yml --ref main -f target=production

# Rebuild & redeploy only the cms container on production
gh workflow run ci.yml --ref main -f target=production -f services=cms
```

### Selective builds

On every push, the workflow detects which of the two service directories changed
and only tests, rebuilds and redeploys those containers. Untouched services keep
their currently running image (the deployed tag of each service is recorded in
`shared/current-tags/<service>.txt` on the server, with the previous tag in
`shared/last-tags/<service>.txt` for rollbacks). Changes to the deployment
plumbing itself (`compose.prod.yml`, `deploy.env.example`, the workflow or the
deploy action), tag pushes, and `workflow_dispatch` with `services=all` rebuild
everything.

Because `nuxt.config.ts` interpolates `NUXT_PUBLIC_API_BASE_URL` into the
`og:image` / `twitter:image` meta tags, the website bakes its public API URL at
build time. The value comes from `DEFAULT_API_BASE_URL` at the top of
`.github/workflows/ci.yml` (`https://cms.modus-ge.ch`), so nothing has to be
configured in GitHub for a normal deploy. Either environment can override it with
a repository **variable** (Settings → Secrets and variables → Actions →
Variables): `PRODUCTION_API_BASE_URL` for production, `PREPROD_API_BASE_URL` for
preprod. If the preprod variable is unset, preprod images are built against the
production URL and the run logs a warning.

`robots.txt` is **not** a Nuxt public asset: Nitro inlines everything under
`public/` into the server bundle at build time, so a bind mount over
`.output/public/robots.txt` is silently ignored. It is served by
`website/server/routes/robots.txt.ts`, which reads `/app/robots.txt` at request
time — the image ships the tracked `website/robots.txt` there, and the deployed
stack bind-mounts `shared/website/robots.txt` over it. Edit that file on the
server to lock crawlers out of preprod: no rebuild, and no restart either.

### Password-protecting a site (HTTP Basic auth)

Preproduction is exposed on the public internet exactly like production, so the
website can be put behind an HTTP Basic auth prompt. The gate is
`website/server/plugins/basic-auth.ts` and it is driven by one file,
`$DEPLOY_PATH/shared/website/.htpasswd`:

- **empty file → no auth at all.** The deploy action seeds it empty on both
  environments and never touches it again, so nothing is protected by accident
  and production is unaffected until somebody decides otherwise.
- **one `user:hash` line → the whole site prompts for a password**, immediately.
  Like `robots.txt`, the file is read from disk at request time and bind-mounted
  from `shared/`, so adding, changing or removing credentials takes effect
  without a rebuild and without a restart.
- **`/health` is always exempt.** It is what the container healthcheck polls;
  gating it would make every subsequent deploy fail on `--wait`.

It lives in the Nuxt server rather than in nginx because the reverse-proxy
configuration is managed outside this repository — keeping it here makes it part
of the deploy and identical on both environments. It is a Nitro *plugin* on the
`request` hook and not a `server/middleware/` handler on purpose: middleware runs
after Nitro's public-asset handler, so the whole `/_nuxt/` bundle would still be
downloadable without credentials. It covers the website only; the Kirby panel has
its own login, and the CMS is a separate host.

Supported hash formats:

| Format                        | Generated by                                        |
| ----------------------------- | --------------------------------------------------- |
| bcrypt `$2y$` / `$2a$` / `$2b$` | `htpasswd -B`, PHP `password_hash()` — **use this** |
| `{SHA}`                       | `htpasswd -s` (unsalted SHA-1, legacy)              |

Apache's own *default*, md5crypt (`$apr1$…`, what a bare `htpasswd -c` writes),
and plaintext entries are deliberately **rejected**: an unsupported line logs a
warning on the container and never authenticates, so a mistyped format can never
read as "no password required". Check `docker compose logs website` if a password
you just added is refused.

#### Enabling it

```bash
ssh deploy@<server>
export DEPLOY_PATH=<deploy_path>

# Read the password without leaving it in the shell history, and hash it with the
# cms container's PHP — no apache2-utils needed on the server.
read -rsp 'password: ' PW && echo
docker exec -e PW="$PW" "$(cat "$DEPLOY_PATH/shared/.compose-project")-cms-1" \
  php -r 'echo password_hash(getenv("PW"), PASSWORD_BCRYPT), PHP_EOL;'

# Append one `user:hash` line per account — append, don't overwrite, or you drop
# the accounts already there. Single quotes: the hash contains `$` characters.
echo 'preprod:$2y$12$...' >> "$DEPLOY_PATH/shared/website/.htpasswd"

# Verify (WEBSITE_HTTP_PORT from shared/deploy.env, 8081 by default):
curl -so /dev/null -w '%{http_code}\n' http://127.0.0.1:8081/          # 401
curl -so /dev/null -w '%{http_code}\n' -u preprod:"$PW" http://127.0.0.1:8081/  # 200
curl -so /dev/null -w '%{http_code}\n' http://127.0.0.1:8081/health    # 200, always
unset PW
```

To turn it off again, empty the file — `: > "$DEPLOY_PATH/shared/website/.htpasswd"`
— or comment the lines out with `#`. Deleting the file works too, but recreate it
before the next `docker compose up`: it is a *file* bind mount, so Docker would
otherwise create a directory in its place and the website container would fail to
start.

Basic auth is not a substitute for `robots.txt`, but it does make it moot: a
crawler gets a 401 before it ever sees a page.

### Layout on each target server

```
$DEPLOY_PATH/                            # e.g. /srv/modus (preprod and prod are separate hosts)
├── current -> releases/<ts>-<sha7>      # symlink to active release (compose file + env examples)
├── releases/<ts>-<sha7>/                # compose.prod.yml, deploy.env.example, cms.env.example
└── shared/
    ├── cms.env                          # CMS runtime env (secrets — mode 660 www-data, never in git)
    ├── deploy.env                       # publish address + ports for this server
    ├── cms/
    │   ├── content/                     # pages & uploads (Panel-editable)
    │   ├── media/                       # generated thumbs cache
    │   └── site/
    │       ├── accounts/  sessions/  cache/   # runtime state
    │       └── config/.license                # Kirby license (file bind mount)
    ├── website/robots.txt               # editable on the host (file bind mount)
    ├── website/.htpasswd                # Basic auth for the website — empty = disabled
    ├── current-tags/<service>.txt       # image tag currently running per service
    ├── last-tags/<service>.txt          # previous tag per service, for rollback
    └── backups/cms-*.tgz                # pre-deploy backups of content + accounts + license
```

Everything under `shared/` lives on the **host filesystem**, outside any container
and outside any release directory. Image rebuilds and rollbacks cannot touch it.

### One-time server setup (per environment)

Do this once on **each** target server (preproduction and production are separate
hosts). Replace `/srv/modus` with whatever you set as `DEPLOY_PATH` in that
environment's secrets.

As root on Ubuntu 24.04:

```bash
apt update && apt install -y ca-certificates curl gnupg rsync
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  > /etc/apt/sources.list.d/docker.list
apt update && apt install -y docker-ce docker-ce-cli containerd.io \
                             docker-buildx-plugin docker-compose-plugin

adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
# Membership in www-data lets the deploy user edit/rsync the files under
# shared/ that the cms container chowns to www-data (they stay group-writable):
usermod -aG www-data deploy

sudo -u deploy mkdir -p /srv/modus/{releases,shared}

# Register the GitHub Actions self-hosted runner (repeat for each environment)
# Download the runner package from: Settings → Actions → Runners → New self-hosted runner
# Follow the instructions shown there, then install as a service:
sudo ./svc.sh install deploy   # run as the deploy user
sudo ./svc.sh start
```

The runner must be registered with the labels matching the workflow:

- preprod runner: `self-hosted`, `modus`, `preprod`, `docker`
- production runner: `self-hosted`, `modus`, `production`, `docker`

Configure nginx on the host to proxy each domain to its loopback port (see the
table above), e.g. one `server { listen 443 ssl; … proxy_pass
http://127.0.0.1:8081; }` block per domain. TLS certificates and DNS are managed
there, not in this repo.

### First deploy

Trigger the first deploy with everything built (recommended, since no tags are
recorded on the server yet):

```bash
gh workflow run ci.yml --ref preprod -f target=preprod -f services=all
# or for production:
gh workflow run ci.yml --ref main -f target=production -f services=all
```

The pipeline bootstraps `shared/` (directories, `cms.env` from `cms/.env.example`,
`deploy.env` from `deploy.env.example`, an empty `site/config/.license` file, the
website `robots.txt` and an empty website `.htpasswd`) and starts the stack. The very first run stops with an error
before starting the stack because `cms.env` still holds the example `CMS_URL` — by
then `shared/` is already group-writable, so fill it in and re-run. The CMS won't
be fully operational until you fill in real values and load real content. SSH in
and finish the setup:

```bash
export DEPLOY_PATH=<deploy_path>
ssh deploy@<server>

# 1. Fill in the real CMS environment values.
#    At minimum: CMS_URL, KIRBY_CONTENT_SALT, KIRBY_COOKIE_KEY (openssl rand -hex 32),
#    EMAIL_FROM_* and the SMTP_* credentials.
nano "$DEPLOY_PATH/shared/cms.env"
exit

# 2. Load the real content — run these from the machine holding the content
#    (your local clone or the old prod server), not on the target server:
# --no-perms --omit-dir-times: shared/ is owned by www-data and only the owner
# may set a directory's mtime or mode, so plain -a exits 23 on every directory.
rsync -avz --delete --no-perms --omit-dir-times ./cms/content/ deploy@<server>:$DEPLOY_PATH/shared/cms/content
rsync -avz --delete --no-perms --omit-dir-times ./cms/site/accounts/ deploy@<server>:$DEPLOY_PATH/shared/cms/site/accounts
# Kirby license — copy the existing .license from the old server (or skip and
# register the license from the Panel later; it persists in shared/ either way):
rsync -avz --no-perms ./cms/site/config/.license deploy@<server>:$DEPLOY_PATH/shared/cms/site/config/.license
# Optional: rsync media/ too to avoid the thumbnail-regeneration CPU spike on
# first load — otherwise Kirby rebuilds it on demand:
rsync -avz --delete --no-perms --omit-dir-times ./cms/media/ deploy@<server>:$DEPLOY_PATH/shared/cms/media

# 3. SSH back to the target server, then fix ownership and recreate CMS so
#    cms.env changes are loaded:
ssh deploy@<server>
export DEPLOY_PATH=<deploy_path>
cd "$DEPLOY_PATH/current"
export SHARED_PATH="$DEPLOY_PATH/shared"
# Required: `current` is a symlink, so compose would otherwise name the project
# after the directory ("current") and report `service "cms" is not running`.
export COMPOSE_PROJECT_NAME=$(cat "$SHARED_PATH/.compose-project")
export CMS_IMAGE_TAG=$(cat "$SHARED_PATH/current-tags/cms.txt")
# Verify it is non-empty: compose falls back to `:latest` (the PRODUCTION tag)
# when the variable is unset, which on preprod would pull production code.
test -n "$CMS_IMAGE_TAG" || echo 'CMS_IMAGE_TAG is empty — do not continue'

docker compose --env-file "$SHARED_PATH/deploy.env" -f compose.prod.yml \
  exec --user root cms sh -c 'chown -R www-data:www-data /var/www/html/content /var/www/html/media /var/www/html/site && chmod -R g+w /var/www/html/content /var/www/html/media /var/www/html/site'
docker compose --env-file "$SHARED_PATH/deploy.env" -f compose.prod.yml up -d --force-recreate --no-deps --wait cms
```

Then, **on preproduction only**, close the site to the public — the deploy seeds
`shared/website/.htpasswd` empty, which means no authentication at all, and
enabling it is a deliberate manual step:

```bash
# still on the target server, $DEPLOY_PATH exported
read -rsp 'password: ' PW && echo
docker exec -e PW="$PW" "$(cat "$DEPLOY_PATH/shared/.compose-project")-cms-1" \
  php -r 'echo password_hash(getenv("PW"), PASSWORD_BCRYPT), PHP_EOL;'

# paste the printed hash — single quotes, it contains `$`
echo 'preprod:$2y$12$...' >> "$DEPLOY_PATH/shared/website/.htpasswd"

# takes effect at once, no restart (8081 = WEBSITE_HTTP_PORT from deploy.env)
curl -so /dev/null -w '%{http_code}\n' http://127.0.0.1:8081/          # 401
curl -so /dev/null -w '%{http_code}\n' -u preprod:"$PW" http://127.0.0.1:8081/  # 200
unset PW
```

Leave the file empty on production. Details, supported hash formats and how to
turn it back off: [Password-protecting a site](#password-protecting-a-site-http-basic-auth).

### What happens on `git push`

1. `changes` detects which service directories were touched.
2. `check` runs the production build for each changed service
   (`composer install` for the cms, `npm run typecheck` + `npm run build` for the
   website) — also on pull requests, without deploying.
3. `build` builds each changed service's `Dockerfile.prod` and pushes it to GHCR
   (`ghcr.io/studio-guez/modus/<service>`):
   - `preprod` branch → tags `preprod-sha-<sha7>` and `preprod`
   - `main` branch (or `v*` tag) → tags `sha-<sha7>` and `latest`
4. `deploy-preprod` / `deploy-production` runs on the self-hosted runner of the
   matching server:
   - a new release directory is created and `shared/` is bootstrapped
     (idempotent — every seed step is a no-op when the target exists);
   - CMS content, accounts and the license file are backed up to
     `shared/backups/` (last 14 kept);
   - the new images are pulled; unchanged services keep their recorded tag;
   - ownership of the whole `shared/` tree is fixed (www-data, group-writable —
     the runner may create files as root, this keeps `cms.env`, `deploy.env`, the
     tag files and the backups editable by the deploy user) and the Kirby cache is
     cleared when a new cms image ships — both run as root inside a throwaway
     container;
   - the `current` symlink is flipped and `docker compose up -d --remove-orphans
     --wait` replaces only the containers whose image changed, then blocks until
     every service passes its healthcheck — an unhealthy container fails the
     deploy;
   - old releases (keep 5) and old images (keep the 5 most recent `sha-*` images
     per service for rollback) are pruned.

### Rollback

The previously deployed tag of each service is kept in
`shared/last-tags/<service>.txt`. To roll one service back:

```bash
ssh deploy@<server>
export DEPLOY_PATH=<deploy_path> SHARED_PATH=<deploy_path>/shared
cd "$DEPLOY_PATH/current"
export COMPOSE_PROJECT_NAME=$(cat "$SHARED_PATH/.compose-project")

# e.g. roll back the website
export WEBSITE_IMAGE_TAG=$(cat "$SHARED_PATH/last-tags/website.txt")
docker compose --env-file "$SHARED_PATH/deploy.env" -f compose.prod.yml up -d --no-deps --wait website
echo "$WEBSITE_IMAGE_TAG" > "$SHARED_PATH/current-tags/website.txt"
```

(Or simply re-run the workflow from the last good commit.)

### Manual deploy (when CI/CD is unavailable)

If the runner is offline you can trigger the same sequence manually after the
images have been pushed to GHCR:

```bash
ssh deploy@<server>
export DEPLOY_PATH=<deploy_path> SHARED_PATH=<deploy_path>/shared
cd "$DEPLOY_PATH/current"
export COMPOSE_PROJECT_NAME=$(cat "$SHARED_PATH/.compose-project")

# Pick the tag from the GitHub Actions "build & push" step output.
# Only set the *_IMAGE_TAG vars of the services you want to update.
# An unset one falls back to `:latest` — the PRODUCTION tag — so always set it
# explicitly on preprod.
export CMS_IMAGE_TAG=sha-<sha7>          # or preprod-sha-<sha7> on preprod

# The daemon needs GHCR credentials (PAT with read:packages) to pull:
docker login ghcr.io -u <github-user>
docker compose --env-file "$SHARED_PATH/deploy.env" -f compose.prod.yml pull cms
docker compose --env-file "$SHARED_PATH/deploy.env" -f compose.prod.yml up -d --force-recreate --no-deps --wait cms
echo "$CMS_IMAGE_TAG" > "$SHARED_PATH/current-tags/cms.txt"
```

### Required GitHub Actions secrets & variables

Secrets are scoped to **GitHub Environments** so that the preproduction deploy job
cannot read production secrets and vice versa. Configure each environment under
**Settings → Environments → `preprod`** and **Settings → Environments →
`production`** with the same key names but the environment-appropriate values:

| Secret                 | Scope                 | Purpose                                                              |
| ---------------------- | --------------------- | -------------------------------------------------------------------- |
| `DEPLOY_PATH`          | per environment       | e.g. `/srv/modus`                                                    |
| `GHCR_PULL_TOKEN`      | per environment       | PAT with `read:packages`, used by the runner to pull from GHCR       |
| `GHCR_PULL_USER`       | per environment (opt) | GHCR username for the pull token (defaults to actor)                 |
| `COMPOSE_PROJECT_NAME` | per environment (opt) | Docker Compose project name (defaults to `modus-preprod` / `modus`)  |

| Variable                  | Scope                 | Purpose                                                       |
| ------------------------- | --------------------- | ------------------------------------------------------------- |
| `PRODUCTION_API_BASE_URL` | repository (optional) | Public CMS URL baked into production website builds           |
| `PREPROD_API_BASE_URL`    | repository (optional) | Public CMS URL baked into preprod website builds              |
| `CMS_HTTP_PORT`           | per environment (opt) | Loopback port for `cms`, overrides `shared/deploy.env`        |
| `WEBSITE_HTTP_PORT`       | per environment (opt) | Loopback port for `website`, overrides `shared/deploy.env`    |

Neither `*_API_BASE_URL` variable has to exist: the workflow falls back to
`DEFAULT_API_BASE_URL` (`https://cms.modus-ge.ch`) for production and to the
production URL for preprod. Set one only to point an environment somewhere else —
a preprod build that inherits the production URL warns in the run log.

The `*_HTTP_PORT` variables are what you set when preproduction and production
share a host: the defaults (`8080`–`8081`) would otherwise collide and the second
stack fails to start with `port is already allocated`. The deploy action writes
them back into `$DEPLOY_PATH/shared/deploy.env`, so manual `docker compose
--env-file` commands keep using the same ports.

All CMS secrets (`KIRBY_CONTENT_SALT`, `KIRBY_COOKIE_KEY`, SMTP credentials, etc.)
live in `$DEPLOY_PATH/shared/cms.env` on each target server — **never** in
workflow files or git. Use different salts/keys per environment.

### Seeding shared files

The deploy action bootstraps the shared directory automatically on every deploy.
Each step is a no-op when the target already exists:

| Target on host                         | Source                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `$SHARED_PATH/cms.env`                 | `cms/.env.example` — edit with real values, recreate `cms` with its recorded tag                                                   |
| `$SHARED_PATH/deploy.env`              | `deploy.env.example` — set `BIND_ADDRESS` if the reverse proxy is on another host, edit the ports if the defaults collide          |
| `$SHARED_PATH/cms/…` state directories | created empty                                                                                                                     |
| `$SHARED_PATH/cms/site/config/.license`| empty file (register from the Panel or rsync the real one)                                                                         |
| `$SHARED_PATH/website/robots.txt`      | `website/robots.txt` — edit on the server to lock crawlers out of preprod (takes effect immediately, no restart)                   |
| `$SHARED_PATH/website/.htpasswd`       | empty file — **auth stays off until you add a line by hand**, see [Password-protecting a site](#password-protecting-a-site-http-basic-auth) |

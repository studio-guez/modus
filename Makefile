# Modus — development helpers.
#
# Thin wrappers around `docker compose -f compose.dev.yml`. Everything runs
# inside the dev containers: npm, node, php and composer are never run on the
# host. See README.md for the full story.
#
# Run `make` or `make help` for the list of targets.

COMPOSE      := docker compose -f compose.dev.yml
# `exec ... cms` defaults to root inside the container while Apache/PHP runs as
# www-data; a root-owned file in site/cache/ makes Panel saves fail with a 500.
EXEC_CMS     := $(COMPOSE) exec -T --user www-data cms
EXEC_WEBSITE := $(COMPOSE) exec -T website

# Extra arguments for the passthrough targets, e.g. `make npm ARGS="install foo"`.
ARGS ?=

CMS_URL     := http://cms.localhost
WEBSITE_URL := http://website.localhost

.DEFAULT_GOAL := help

##@ Help

.PHONY: help
help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} \
		/^##@ / {printf "\n\033[1m%s\033[0m\n", substr($$0, 5); next} \
		/^[a-zA-Z0-9_-]+:.*?## / {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo

##@ Stack

.PHONY: setup
setup: ## Create cms/.env from the example (first run)
	@test -f cms/.env \
		&& echo "cms/.env already exists — leaving it alone." \
		|| { cp cms/.env.example cms/.env; \
		     echo "Created cms/.env — set KIRBY_CONTENT_SALT and KIRBY_COOKIE_KEY (openssl rand -hex 32)."; }

.PHONY: up
up: ## Start the whole stack in the background
	$(COMPOSE) up -d

.PHONY: rebuild
rebuild: ## Rebuild the images and start the stack
	$(COMPOSE) up -d --build

.PHONY: down
down: ## Stop the stack (volumes are kept)
	$(COMPOSE) down

.PHONY: restart
restart: ## Restart every service
	$(COMPOSE) restart

.PHONY: ps
ps: ## Show service status
	$(COMPOSE) ps

.PHONY: logs
logs: ## Follow the cms and website logs
	$(COMPOSE) logs -f cms website

.PHONY: logs-cms
logs-cms: ## Follow the cms logs
	$(COMPOSE) logs -f cms

.PHONY: logs-website
logs-website: ## Follow the website logs
	$(COMPOSE) logs -f website

.PHONY: urls
urls: ## Print the local URLs
	@echo "CMS panel : $(CMS_URL)/panel"
	@echo "Website   : $(WEBSITE_URL)"
	@echo "Mailpit   : http://mailpit.localhost"
	@echo "Traefik   : http://localhost:8888"

##@ Shells & toolchains

.PHONY: sh-cms
sh-cms: ## Interactive shell in the cms container (www-data)
	$(COMPOSE) exec --user www-data cms bash

.PHONY: sh-website
sh-website: ## Interactive shell in the website container
	$(COMPOSE) exec website sh

.PHONY: npm
npm: ## Run npm in the website container: make npm ARGS="install foo"
	$(EXEC_WEBSITE) npm $(ARGS)

.PHONY: composer
composer: ## Run composer in the cms container: make composer ARGS="require foo"
	$(EXEC_CMS) composer $(ARGS)

.PHONY: php
php: ## Run php in the cms container: make php ARGS="-v"
	$(EXEC_CMS) php $(ARGS)

##@ Verify (there is no test suite)

.PHONY: typecheck
typecheck: ## vue-tsc on the website (nuxt build does NOT type-check)
	$(EXEC_WEBSITE) npm run typecheck

.PHONY: build
build: ## Production build of the website inside the container
	$(EXEC_WEBSITE) npm run build

.PHONY: verify
verify: typecheck build api ## typecheck + build + hit the API endpoints

.PHONY: api
api: ## curl the main JSON endpoints and report the HTTP status
	@for path in menus.json news.json projects.json project-tags.json pages-info.json sitemap-data.json; do \
		printf '%-22s %s\n' "$$path" "$$(curl -s -o /dev/null -w '%{http_code}' $(CMS_URL)/$$path)"; \
	done

.PHONY: audit
audit: ## Vulnerability audit for both services
	-$(EXEC_WEBSITE) npm audit
	-$(EXEC_CMS) composer audit

.PHONY: outdated
outdated: ## List outdated dependencies for both services
	-$(EXEC_WEBSITE) npm outdated
	-$(EXEC_CMS) composer outdated

##@ Maintenance

.PHONY: fix-perms
fix-perms: ## Give site/cache back to www-data (fixes Panel 500 on save)
	$(COMPOSE) exec -T cms chown -R www-data:www-data /var/www/html/site/cache

.PHONY: clear-media
clear-media: ## Drop the generated thumbnails (Kirby regenerates them)
	$(COMPOSE) exec -T cms sh -c 'rm -rf media/pages media/site'

.PHONY: fix-images-dry
fix-images-dry: ## List oversized / CMYK images in content/ without writing
	$(EXEC_CMS) php site/plugins/image-guard/fix-large-images.php --dry-run

.PHONY: fix-images
fix-images: ## Downscale oversized images and convert CMYK JPEGs in place
	$(EXEC_CMS) php site/plugins/image-guard/fix-large-images.php

.PHONY: clean
clean: ## Stop the stack and delete its volumes (node_modules, cache, sessions)
	$(COMPOSE) down -v

SHELL := /bin/bash
DC      := docker compose
DC_PROD := docker compose -f docker-compose.prod.yml
APP     := $(DC) exec app
GREEN   := \033[0;32m
BLUE    := \033[0;34m
YELLOW  := \033[1;33m
RED     := \033[0;31m
NC      := \033[0m

.PHONY: help up up-prod down install migrate seed fresh deploy deploy-rebuild \
        deploy-first send db thinker shell lint build

# ─────────────────────────────────────────
# Ajuda
# ─────────────────────────────────────────
help:
	@echo ""
	@echo "$(BLUE)╔══════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║     Trocando Figurinas — Comandos    ║$(NC)"
	@echo "$(BLUE)╚══════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "  $(GREEN)make up$(NC)             Sobe containers de desenvolvimento"
	@echo "  $(GREEN)make up-prod$(NC)        Sobe containers de produção"
	@echo "  $(GREEN)make down$(NC)           Derruba containers"
	@echo "  $(GREEN)make install$(NC)        Configura projeto do zero"
	@echo "  $(GREEN)make migrate$(NC)        Executa migrações"
	@echo "  $(GREEN)make seed$(NC)           Executa seeders"
	@echo "  $(GREEN)make fresh$(NC)          Drop + migrate + seed"
	@echo "  $(GREEN)make send$(NC)           Commita e envia código"
	@echo "  $(GREEN)make deploy$(NC)         Deploy em produção"
	@echo "  $(GREEN)make deploy-rebuild$(NC) Deploy com rebuild de imagens"
	@echo "  $(GREEN)make deploy-first$(NC)   Primeira implantação em servidor"
	@echo "  $(GREEN)make db$(NC)             Abre shell MySQL"
	@echo "  $(GREEN)make thinker$(NC)        Abre Laravel Tinker"
	@echo "  $(GREEN)make shell$(NC)          Abre shell do container app"
	@echo "  $(GREEN)make lint$(NC)           Executa verificação de código"
	@echo "  $(GREEN)make build$(NC)          Build do frontend"
	@echo ""

# ─────────────────────────────────────────
# Desenvolvimento
# ─────────────────────────────────────────
up:
	@echo "$(GREEN)▶ Subindo containers de desenvolvimento...$(NC)"
	$(DC) down --remove-orphans
	$(DC) up -d
	@echo "$(GREEN)✓ Containers no ar. Frontend: http://localhost:5173 | API: http://localhost:80$(NC)"

up-prod:
	@echo "$(GREEN)▶ Subindo containers de produção...$(NC)"
	$(DC_PROD) up -d
	@echo "$(GREEN)✓ Produção no ar.$(NC)"

down:
	@echo "$(YELLOW)▶ Derrubando containers...$(NC)"
	$(DC) down --remove-orphans
	@echo "$(GREEN)✓ Containers parados.$(NC)"

# ─────────────────────────────────────────
# Instalação
# ─────────────────────────────────────────
install:
	@echo "$(BLUE)══════════════════════════════════════$(NC)"
	@echo "$(BLUE)  Instalando Trocando Figurinas       $(NC)"
	@echo "$(BLUE)══════════════════════════════════════$(NC)"
	@# Backend .env
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "$(GREEN)✓ backend/.env criado$(NC)"; \
	else \
		echo "$(YELLOW)⚠ backend/.env já existe, mantendo...$(NC)"; \
	fi
	@# Subir containers
	$(DC) up -d --build
	@echo "$(GREEN)✓ Containers iniciados$(NC)"
	@# Aguardar MySQL
	@echo "$(YELLOW)▶ Aguardando MySQL...$(NC)"
	@until $(DC) exec mysql mysqladmin ping -h localhost -u root -p$${DB_PASSWORD:-secret} --silent 2>/dev/null; do sleep 2; done
	@# Dependências PHP
	@echo "$(YELLOW)▶ Instalando dependências PHP...$(NC)"
	$(APP) composer install
	@# Gerar chave
	$(APP) php artisan key:generate
	@# Dependências NPM
	@echo "$(YELLOW)▶ Instalando dependências NPM...$(NC)"
	npm install
	@# Migrações e seeders
	$(MAKE) fresh
	@echo ""
	@echo "$(GREEN)╔══════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║  Instalação concluída com sucesso!   ║$(NC)"
	@echo "$(GREEN)╚══════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "  Frontend:  $(BLUE)http://localhost:5173$(NC)"
	@echo "  API:       $(BLUE)http://localhost:80$(NC)"
	@echo "  Admin:     $(BLUE)admin@admin.com / 123456$(NC)"
	@echo ""

# ─────────────────────────────────────────
# Banco de Dados
# ─────────────────────────────────────────
migrate:
	@echo "$(YELLOW)▶ Executando migrações...$(NC)"
	$(APP) php artisan migrate --force
	@echo "$(GREEN)✓ Migrações concluídas$(NC)"

seed:
	@echo "$(YELLOW)▶ Executando seeders...$(NC)"
	$(APP) php artisan db:seed --force
	@echo "$(GREEN)✓ Seeders concluídos$(NC)"

fresh:
	@echo "$(RED)▶ Resetando banco de dados...$(NC)"
	$(APP) php artisan migrate:fresh --seed --force
	@echo "$(GREEN)✓ Banco resetado e populado$(NC)"

db:
	@echo "$(BLUE)▶ Abrindo MySQL...$(NC)"
	$(DC) exec mysql mysql -u$${DB_USERNAME:-trocandor} -p$${DB_PASSWORD:-secret} $${DB_DATABASE:-trocandor}

thinker:
	@echo "$(BLUE)▶ Abrindo Tinker...$(NC)"
	$(APP) php artisan tinker

shell:
	@echo "$(BLUE)▶ Abrindo shell do container...$(NC)"
	$(APP) bash

# ─────────────────────────────────────────
# Frontend
# ─────────────────────────────────────────
lint:
	@echo "$(YELLOW)▶ Verificando código...$(NC)"
	npx tsc --noEmit
	npx eslint . --ext .ts,.tsx --max-warnings 0
	@echo "$(GREEN)✓ Código verificado$(NC)"

build:
	@echo "$(YELLOW)▶ Gerando build de produção...$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build gerado em dist/$(NC)"

# ─────────────────────────────────────────
# Git — make send
# ─────────────────────────────────────────
send:
	@echo "$(BLUE)══════════════════════════════════════$(NC)"
	@echo "$(BLUE)  Enviando código para o repositório  $(NC)"
	@echo "$(BLUE)══════════════════════════════════════$(NC)"
	@# Lint antes de commitar
	@$(MAKE) lint || (echo "$(RED)✗ Lint falhou. Corrija os erros antes de enviar.$(NC)" && exit 1)
	@# Verificar se há alterações
	@if [ -z "$$(git status --porcelain)" ]; then \
		echo "$(YELLOW)⚠ Nenhuma alteração para commitar.$(NC)"; \
		exit 0; \
	fi
	@# Mostrar status
	@git status --short
	@echo ""
	@# Pedir mensagem de commit
	@read -p "$(GREEN)Mensagem do commit: $(NC)" MSG; \
	if [ -z "$$MSG" ]; then \
		echo "$(RED)✗ Mensagem de commit não pode ser vazia.$(NC)"; \
		exit 1; \
	fi; \
	BRANCH="auto/$$(date +%Y%m%d-%H%M%S)"; \
	git checkout -b $$BRANCH; \
	git add -A; \
	git commit -m "$$MSG"; \
	git push origin $$BRANCH; \
	git checkout main; \
	git merge $$BRANCH --no-edit; \
	git push origin main; \
	git branch -d $$BRANCH; \
	git push origin --delete $$BRANCH 2>/dev/null || true; \
	echo "$(GREEN)✓ Código enviado com sucesso!$(NC)"

# ─────────────────────────────────────────
# Deploy
# ─────────────────────────────────────────
deploy: _deploy-pull _deploy-full

deploy-rebuild: _deploy-pull
	@echo "$(YELLOW)▶ Rebuild das imagens...$(NC)"
	$(DC_PROD) build
	$(DC_PROD) up -d app
	@$(MAKE) _deploy-full

deploy-first:
	@echo "$(BLUE)▶ Primeira implantação...$(NC)"
	@cp docker/nginx/initial.conf docker/nginx/active.conf
	$(DC_PROD) build
	$(APP) php artisan key:generate --force
	@$(MAKE) _deploy-full
	$(APP) php artisan config:cache

_deploy-pull:
	@echo "$(YELLOW)▶ Atualizando código...$(NC)"
	git stash
	git pull origin main
	@echo "$(GREEN)✓ Código atualizado$(NC)"

_deploy-full:
	@START=$$(date +%s); \
	echo "$(BLUE)══════════════════════════════════════$(NC)"; \
	echo "$(BLUE)  Deploy — $(shell date '+%d/%m/%Y %H:%M:%S')        $(NC)"; \
	echo "$(BLUE)══════════════════════════════════════$(NC)"; \
	\
	echo "$(YELLOW)[1/6] Preparando ambiente...$(NC)"; \
	$(APP) chmod -R 775 /var/www/storage /var/www/bootstrap/cache; \
	$(APP) chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache; \
	rm -f backend/public/hot; \
	[ -f docker/nginx/active.conf ] || cp docker/nginx/production.conf docker/nginx/active.conf; \
	\
	echo "$(YELLOW)[2/6] Instalando dependências PHP...$(NC)"; \
	$(APP) composer install --no-dev --optimize-autoloader --no-interaction; \
	\
	echo "$(YELLOW)[3/6] Gerando build do frontend...$(NC)"; \
	docker compose -f docker-compose.prod.yml --profile build run --rm node sh -c "npm install && npm run build" || \
		(echo "$(RED)✗ Build do frontend falhou. Deploy abortado.$(NC)" && exit 1); \
	\
	echo "$(YELLOW)[4/6] Ativando manutenção...$(NC)"; \
	DOWN_START=$$(date +%s); \
	$(APP) php artisan down --secret="deploy-$(shell date +%s)" --retry=10; \
	\
	echo "$(YELLOW)[5/6] Migrações e caches...$(NC)"; \
	$(APP) php artisan migrate --force; \
	$(APP) php artisan config:cache; \
	$(APP) php artisan route:cache; \
	$(APP) php artisan view:clear; \
	$(APP) php artisan view:cache; \
	$(APP) php artisan storage:link 2>/dev/null || true; \
	$(DC_PROD) up -d redis nginx; \
	$(DC_PROD) up -d --force-recreate app scheduler queue; \
	$(APP) chmod -R 775 /var/www/storage; \
	$(DC_PROD) exec nginx nginx -s reload; \
	\
	echo "$(YELLOW)[6/6] Finalizando deploy...$(NC)"; \
	$(APP) php artisan up; \
	DOWN_END=$$(date +%s); \
	END=$$(date +%s); \
	DOWNTIME=$$((DOWN_END - DOWN_START)); \
	TOTAL=$$((END - START)); \
	git_hash=$$(git rev-parse --short HEAD); \
	git_date=$$(git log -1 --format="%ci"); \
	echo "{\"hash\":\"$$git_hash\",\"date\":\"$$git_date\"}" > backend/public/version.json; \
	echo "$(GREEN)══════════════════════════════════════$(NC)"; \
	echo "$(GREEN)  Deploy concluído!$(NC)"; \
	echo "$(GREEN)  Tempo total:   $${TOTAL}s$(NC)"; \
	echo "$(GREEN)  Downtime:      $${DOWNTIME}s$(NC)"; \
	echo "$(GREEN)  Versão:        $$git_hash$(NC)"; \
	echo "$(GREEN)══════════════════════════════════════$(NC)"

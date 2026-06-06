---
name: run-trocandor-figurinas
description: Build, run, and drive Trocando Figurinas. Use when asked to start the app, take a screenshot, run the frontend, run the backend, test a flow, interact with the running app, or verify a feature.
---

App React 19 + Laravel 11 servido via Docker. O agente dirige o frontend com o driver Playwright em `.claude/skills/run-trocandor-figurinas/driver.mjs`; a API é verificada com `curl`.

Todos os caminhos abaixo são relativos à raiz do projeto (`trocandor de figurinhas/`).

---

## Pré-requisitos

Node.js 20+ (disponível como `node`). Docker Desktop rodando. Sem dependências extras de sistema — o Playwright baixa o seu próprio Chromium.

Instale o Playwright uma vez (fica em `/tmp/pw`; não entra no repo):

```bash
npm install --prefix /tmp/pw playwright
cd /tmp/pw && npx playwright install chromium
```

---

## Setup (primeira vez)

```bash
# 1. Sobe containers Docker (app, nginx, mysql, redis)
make up

# 2. Instala dependências PHP dentro do container
docker compose exec app composer config --no-plugins policy.advisories.block false
docker compose exec app composer install --no-interaction

# 3. Gera chave e corrige permissões
docker compose exec app php artisan key:generate
docker compose exec app chmod -R 775 /var/www/storage /var/www/bootstrap/cache
docker compose exec app chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# 4. Migrations + seed (3 usuários de teste + 20 figurinhas + 6 anúncios)
docker compose exec app php artisan migrate:fresh --seed --force

# 5. Instala dependências NPM e sobe o Vite
npm install
npm run dev -- --host 0.0.0.0 &
timeout 15 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done'
```

Usuários de teste (senha `123456` para todos):

| Perfil | E-mail |
|---|---|
| Admin | admin@admin.com |
| Comprador | comprador@teste.com |
| Vendedor | vendedor@teste.com |

---

## Run (caminho do agente)

### Smoke — verifica todas as telas principais

```bash
cd "trocandor de figurinhas"
node .claude/skills/run-trocandor-figurinas/driver.mjs smoke
```

Saída esperada:

```
📸 screenshot → /tmp/shots/01-landing.png
✓ landing page carregada
📸 screenshot → /tmp/shots/02-login.png
✓ tela de login carregada
✓ login como admin (admin@admin.com)
📸 screenshot → /tmp/shots/03-painel-admin.png
✓ painel admin carregado
✓ login como comprador (comprador@teste.com)
📸 screenshot → /tmp/shots/04-dashboard-comprador.png
✓ dashboard comprador carregado
✓ login como vendedor (vendedor@teste.com)
📸 screenshot → /tmp/shots/05-dashboard-vendedor.png
✓ dashboard vendedor carregado
📸 screenshot → /tmp/shots/06-cadastro.png
✓ tela de cadastro carregada
✓ nenhum erro de console
✅ smoke completo — screenshots em /tmp/shots/
```

Screenshots ficam em `/tmp/shots/`.

### Screenshot avulso

```bash
node .claude/skills/run-trocandor-figurinas/driver.mjs screenshot /login login-page
# → /tmp/shots/login-page.png
```

### Verificar API com curl

```bash
# Login
curl -s -X POST http://localhost:80/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@admin.com","senha":"123456"}' | python3 -m json.tool

# Listar anúncios (requer token do login acima)
TOKEN="<token-do-login>"
curl -s http://localhost:80/api/anuncios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | python3 -m json.tool
```

---

## Run (caminho humano)

```bash
make up        # sobe Docker
npm run dev    # Vite em http://localhost:5173 — Ctrl-C para parar
```

---

## Testes

```bash
npx tsc --noEmit    # type-check TypeScript (deve passar sem erros)
npm run build       # build de produção (deve passar sem erros)
```

---

## Gotchas

- **`import { chromium } from 'playwright'` falha no Node 24** — o módulo do Playwright é CommonJS. Use `import pkg from '...'; const { chromium } = pkg` como no driver.

- **`EnsureFrontendRequestsAreStateful` causa CSRF mismatch** — esse middleware é para auth via cookie, não Bearer token. Não deve estar na stack da API. Em `bootstrap/app.php`, o bloco `$middleware->api(prepend: [...])` não existe neste projeto.

- **`composer install` bloqueia por security advisories** — o Composer 2.8+ bloqueia versões com advisories por padrão. Contornar com: `docker compose exec app composer config policy.advisories.block false` antes de instalar.

- **`make install` trava no loop de espera do MySQL** — o wait original usava `php artisan db:show` antes do `vendor/` existir. A versão corrigida usa `mysqladmin ping` diretamente. Sempre use `make install` com o Makefile atual.

- **Vite proxy `/api` → porta 80** — configurado em `vite.config.ts`. Em produção o Nginx serve tudo na 80; em dev o Vite redireciona as chamadas `/api` para o container `trocandor_nginx`.

---

## Troubleshooting

- **`EADDRINUSE :5173`**: Vite já está rodando. `pkill -f 'vite'` antes de reiniciar.
- **`Connection refused` na API**: containers parados. `docker compose ps` e `make up`.
- **`Unauthenticated` em rotas protegidas**: token expirado ou ausente. Refaça o login e use o novo token.
- **Container `trocandor_app` não sobe**: `docker compose logs app` — provavelmente permissão em `storage/`. `docker compose exec app chmod -R 775 /var/www/storage`.

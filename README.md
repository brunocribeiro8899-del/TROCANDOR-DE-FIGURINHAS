# Trocando Figurinas

Plataforma de compra, venda e troca de figurinhas da Copa do Mundo 2026.

## Stack

- **Backend:** Laravel 11 + PHP 8.4 + MySQL 8 + Laravel Sanctum
- **Frontend:** React 19 + TypeScript 5 + Vite + Tailwind CSS
- **Infra:** Docker + Nginx + Redis

## Início Rápido

```bash
# 1. Clone e acesse o projeto
cd "trocandor de figurinhas"

# 2. Instale e configure tudo
make install

# 3. Acesse
# Frontend:  http://localhost:5173
# API:       http://localhost:80/api
```

## Usuários de Teste

| Perfil        | E-mail                  | Senha  |
|---------------|-------------------------|--------|
| Administrador | admin@admin.com         | 123456 |
| Comprador     | comprador@teste.com     | 123456 |
| Vendedor      | vendedor@teste.com      | 123456 |

## Comandos

```bash
make up          # Sobe containers
make down        # Derruba containers
make fresh       # Reset banco (migrate + seed)
make send        # Commit e push (pede mensagem + roda lint)
make deploy      # Deploy em produção
make shell       # Shell do container
make thinker     # Laravel Tinker
make db          # MySQL shell
```

## Estrutura

```
/
├── backend/     # Laravel 11
├── pages/       # React pages
├── components/  # Componentes React
├── services/    # Chamadas à API
├── hooks/       # Custom hooks
├── utils/       # Utilitários
├── types/       # Tipos TypeScript
└── docker/      # Configs Docker
```

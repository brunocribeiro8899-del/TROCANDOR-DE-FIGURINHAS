# CLAUDE.md — Trocando Figurinas

## ⚠️ Regra Fundamental

**NUNCA realize commits automáticos.** Toda operação de commit deve ser feita exclusivamente via `make send`, após confirmação explícita do desenvolvedor.

---

## Idioma

Todo código, comentários, mensagens de commit, nomes de variáveis significativas e documentação devem ser escritos em **português brasileiro com acentuação correta**.

Exemplos corretos: `anúncio`, `usuário`, `configuração`, `negociação`.
Exemplos incorretos: `anuncio`, `usuario`, `configuracao`, `negociacao`.

---

## Stack Tecnológica

### Backend
- **Laravel 11** com PHP 8.4+
- **MySQL 8**
- **Laravel Sanctum** para autenticação via token
- Arquitetura **MVC com Services**
- **REST JSON API**

### Frontend
- **React 19** com **TypeScript 5+**
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **React Router** para navegação

### Infraestrutura
- **Docker + Docker Compose**
- **Nginx** como reverse proxy
- **Redis** para cache, sessões e filas

---

## Estrutura de Pastas

```
/
├── backend/              # Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
├── pages/                # Páginas React
├── components/           # Componentes reutilizáveis
├── services/             # Chamadas à API
├── hooks/                # Custom hooks
├── utils/                # Utilitários
├── types/                # Tipos TypeScript
├── docker/               # Configs Docker
├── CLAUDE.md
├── README.md
├── Makefile
├── docker-compose.yml
└── package.json
```

---

## Comandos Make

| Comando | Descrição |
|---|---|
| `make up` | Sobe containers de desenvolvimento |
| `make up-prod` | Sobe containers de produção |
| `make down` | Derruba containers |
| `make install` | Configura projeto do zero |
| `make migrate` | Executa migrações |
| `make seed` | Executa seeders |
| `make fresh` | Drop + migrate + seed |
| `make deploy` | Deploy em produção |
| `make send` | Commita e envia código (pergunta a mensagem) |
| `make db` | Abre shell do MySQL |
| `make thinker` | Abre Tinker do Laravel |
| `make shell` | Abre shell do container app |

---

## Convenções de Código

### React / TypeScript
- **Somente componentes funcionais** com hooks
- Props tipadas com **interfaces** (não `type`)
- **Sem chamadas fetch diretas** em componentes — usar services em `/services`
- Nomes de componentes em **PascalCase**
- Nomes de hooks começam com `use`

### Laravel
- Controllers retornam **JSON consistente** via API Resources
- Validação em **FormRequests**
- Lógica de negócio em **Services** — controllers apenas orquestram
- Nunca colocar lógica pesada em controllers

---

## Padrões de Banco de Dados

Toda tabela deve conter:
```php
$table->id();
$table->timestamps();
$table->softDeletes();
```

Relacionamentos:
```php
$table->foreignId('user_id')->constrained()->onDelete('cascade');
```

Seeders sempre usam `updateOrCreate()`. Usuário admin padrão: `admin@admin.com / 123456`.

---

## Padrões de UI

### Identidade Visual
- Cores principais: **verde (#16a34a)**, **azul (#2563eb)**, **branco**
- Estilo moderno, limpo e responsivo

### Modais
- Fechar ao clicar **fora** do modal
- Fechar ao pressionar **ESC**
- Animação suave de entrada/saída

### Toasts / Notificações
- Sucesso: verde
- Erro: vermelho
- Aviso: amarelo
- Info: azul
- Duração padrão: 4 segundos

### Tratamento de Erros
- **Nunca exibir "Error 500"** ou mensagens técnicas ao usuário
- Sempre exibir mensagem clara e amigável em português
- Erros de validação: exibir campo a campo
- Erros de rede: "Não foi possível conectar ao servidor. Tente novamente."

---

## Padrão de Resposta da API

### Sucesso
```json
{
  "data": { ... },
  "message": "Operação realizada com sucesso."
}
```

### Erro
```json
{
  "message": "Descrição amigável do erro.",
  "errors": { "campo": ["mensagem"] }
}
```

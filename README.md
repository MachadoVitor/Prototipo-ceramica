# Clay+

**Assistente de cerâmica para hobbyistas** — PWA mobile-first, offline-first.

Clay+ resolve o problema de ceramistas que controlam estoque, receitas e produção em cadernos e planilhas. O app é extremamente simples, pensado para pessoas com pouca familiaridade tecnológica.

---

## Funcionalidades

### Implementadas (MVP)

- **Controle de Estoque** — Cadastro de materiais (argila, esmaltes, tintas) com nome, quantidade e unidade (kg, g, ml, L, unidade). Alertas de estoque baixo com threshold configurável.
- **Receitas de Peças** — Criação de "receitas" (ex: Vaso Pequeno) com dificuldade, anotações e lista de materiais necessários por unidade produzida.
- **Produção Inteligente** — Ao produzir, o sistema deduz automaticamente os materiais do estoque. Previne produção se o estoque for insuficiente e informa quantas unidades podem ser feitas.
- **Conversão de Unidades** — O sistema converte automaticamente entre unidades compatíveis (kg ↔ g, L ↔ ml). Uma receita pode pedir 200g mesmo que o estoque esteja cadastrado em kg.
- **Autenticação Local** — Cadastro com nome, e-mail (confirmação dupla), senha (hash SHA-256). Login biométrico (Face ID / impressão digital) via WebAuthn.
- **Planos Free/Premium** — Free: até 4 materiais e 10 receitas. Premium: ilimitado (R$9,90/mês — pagamento não implementado).
- **Mapa de Lojas** — Google Maps embutido com busca por lojas de cerâmica próximas + links de lojas online.
- **Perfil** — Foto de perfil, estatísticas de produção, toggle de biometria, seleção de plano.
- **PWA Instalável** — Funciona como app nativo no celular. Service worker com cache offline para o app shell.

### Princípios de UX

- Botões grandes, texto claro, ícones intuitivos
- Máximo 3 toques para qualquer ação
- Alto contraste, fonte legível (Nunito)
- "Se uma pessoa de 70 anos não conseguir usar, está errado"

---

## Tech Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | React 19 + Vite 8 |
| Estado | Zustand |
| Estilo | Tailwind CSS 4 |
| Dados | IndexedDB (via `idb`) |
| Auth | localStorage + SubtleCrypto (SHA-256) |
| Biometria | WebAuthn API |
| Ícones | Lucide React |
| PWA | Service Worker manual + Web Manifest |

**Sem backend** — tudo roda localmente no dispositivo do usuário.

---

## Estrutura do Projeto

```
src/
├── lib/
│   ├── auth.js          # Validação, hash, registro, login, biometria (WebAuthn)
│   ├── db.js            # Camada de dados IndexedDB (materials, recipes, logs)
│   └── units.js         # Conversão de unidades (kg↔g, L↔ml)
├── stores/
│   ├── useAuthStore.js  # Estado de autenticação (Zustand + localStorage)
│   └── useStore.js      # Estado do app: materiais, receitas, produção
├── components/
│   ├── BottomNav.jsx    # Navegação inferior com 5 abas
│   ├── Modal.jsx        # Modal bottom-sheet reutilizável
│   ├── PageHeader.jsx   # Cabeçalho de página
│   └── EmptyState.jsx   # Estado vazio com CTA
├── pages/
│   ├── Landing.jsx      # Tela inicial (criar conta / login)
│   ├── Signup.jsx       # Cadastro com validações
│   ├── Login.jsx        # Login com senha
│   ├── VerifyCode.jsx   # Verificação de código de 6 dígitos
│   ├── PlanSelect.jsx   # Seleção de plano Free/Premium
│   ├── Dashboard.jsx    # Tela principal com resumo
│   ├── Materials.jsx    # CRUD de materiais
│   ├── Recipes.jsx      # CRUD de receitas
│   ├── Produce.jsx      # Produção com dedução de estoque
│   ├── Profile.jsx      # Perfil do usuário
│   └── MapStores.jsx    # Mapa de lojas + lojas online
├── App.jsx              # Roteamento e fluxo de autenticação
├── main.jsx             # Entry point + registro do Service Worker
└── index.css            # Estilos globais + tema Tailwind
public/
├── manifest.json        # Web App Manifest (PWA)
├── sw.js                # Service Worker
├── favicon.svg          # Ícone do app
└── claypot.avif         # Imagem da logo
```

---

## Como rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## Dados locais

Todos os dados ficam no dispositivo do usuário:

| Storage | Chave | Conteúdo |
|---------|-------|----------|
| IndexedDB | `clayplus` | Materiais, receitas, logs de produção |
| localStorage | `clayplus-auth` | Sessão ativa (nome, email, plano) |
| localStorage | `clayplus-users` | Registry de usuários cadastrados (com hash de senha) |
| localStorage | `clayplus-last-email` | Último e-mail logado (para biometria) |

---

## Monetização (planejada)

| Plano | Preço | Limites |
|-------|-------|---------|
| Gratuito | R$0 | 4 materiais, 10 receitas |
| Premium mensal | R$9,90/mês | Ilimitado |
| Premium anual | R$89,90/ano | Ilimitado (25% desconto) |

Pagamento ainda não implementado — apenas seleção de plano na UI.

---

## Documentação

- [Arquitetura](docs/ARQUITETURA.md) — Visão geral da arquitetura, fluxos de autenticação e produção
- [TODO](TODO.md) — Lista de tarefas e próximos passos

---

## Licença

Projeto privado — MasterTimm.

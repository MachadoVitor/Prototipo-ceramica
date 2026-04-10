# Arquitetura — Clay+

## Visão Geral

Clay+ é uma PWA mobile-only, offline-first, sem backend. Todos os dados ficam no dispositivo do usuário via IndexedDB e localStorage.

```
┌─────────────────────────────────────────┐
│              Usuário (Mobile)           │
├─────────────────────────────────────────┤
│  React App (Vite + Tailwind)            │
│  ├── Pages (UI)                         │
│  ├── Components (reutilizáveis)         │
│  ├── Stores (Zustand)                   │
│  │   ├── useAuthStore (sessão/login)    │
│  │   └── useStore (materiais/receitas)  │
│  └── Lib (lógica de negócio)            │
│      ├── auth.js (validação/hash/bio)   │
│      ├── db.js (IndexedDB)              │
│      └── units.js (conversão kg↔g)      │
├─────────────────────────────────────────┤
│  Persistência                           │
│  ├── IndexedDB → materials, recipes,    │
│  │                productionLogs        │
│  └── localStorage → auth, users,        │
│                     last-email           │
├─────────────────────────────────────────┤
│  Service Worker (sw.js)                 │
│  └── Cache do app shell para offline    │
└─────────────────────────────────────────┘
```

---

## Fluxo de Autenticação

```
App monta
  │
  ├─ Tem sessão ativa? (localStorage clayplus-auth)
  │   ├─ SIM → App principal (Dashboard)
  │   └─ NÃO → AuthFlow
  │
  AuthFlow monta
  │
  ├─ Tem último e-mail logado? (clayplus-last-email)
  │   ├─ SIM + biometria ativa → Tenta autenticação biométrica
  │   │   ├─ Sucesso → Seta sessão → App principal
  │   │   └─ Falha → Landing
  │   └─ NÃO → Landing
  │
  Landing
  ├─ "Criar conta" → Signup → VerifyCode → PlanSelect → [BiometricSetup] → App
  └─ "Já possuo conta" → Login → [BiometricSetup] → App
```

---

## Fluxo de Produção

```
Usuário seleciona receita
  │
  ├─ getMaxProduction(recipeId)
  │   └─ Para cada material da receita:
  │       ├─ Busca material no estoque
  │       ├─ Converte unidade da receita → unidade do estoque
  │       │   (ex: 200g da receita → 0.2kg do estoque)
  │       └─ Calcula: estoque ÷ necessário = máximo possível
  │
  ├─ Mostra materiais necessários vs disponíveis
  ├─ Seletor de quantidade (1 até máximo)
  │
  └─ "Produzir"
      ├─ Valida estoque suficiente (com conversão)
      ├─ Deduz materiais do estoque
      ├─ Salva log de produção (IndexedDB)
      └─ Mostra confirmação
```

---

## Conversão de Unidades

```
Grupos compatíveis:
  peso:   kg ↔ g    (1 kg = 1000 g)
  volume: L  ↔ ml   (1 L  = 1000 ml)
  avulso: unidade   (sem conversão)

Exemplo:
  Estoque: Argila X → 2 kg
  Receita: Vaso Pequeno precisa de 500 g de Argila X
  
  Conversão: 500g ÷ 1000 = 0.5 kg
  Produção máxima: 2 kg ÷ 0.5 kg = 4 unidades
  
  Ao produzir 1: 2 kg - 0.5 kg = 1.5 kg restante
```

---

## Segurança (MVP)

| Item | Implementação | Limitação |
|------|--------------|-----------|
| Senha | SHA-256 hash via SubtleCrypto | Hash no localStorage (sem salt) |
| Biometria | WebAuthn (Face ID / digital) | Requer HTTPS em produção |
| Sessão | localStorage flag | Sem expiração, sem token |
| Dados | IndexedDB local | Acessível via DevTools |

Para produção, todas essas limitações são resolvidas com um backend real (Supabase/Firebase).

---

## Limites de Plano

| Recurso | Free | Premium |
|---------|------|---------|
| Materiais | 4 | Ilimitado |
| Receitas | 10 | Ilimitado |
| Produção | Ilimitada | Ilimitada |
| Backup | Não | Futuro |
| Sync | Não | Futuro |

A verificação é feita no frontend (Materials.jsx e Recipes.jsx) antes de permitir adicionar novos itens.

# Clay+ — Lista de Tarefas

## Legenda
- [ ] A fazer
- [x] Concluído

---

## Fase 1 — MVP (Concluída)

- [x] Estrutura do projeto (React + Vite + Tailwind)
- [x] PWA: manifest.json, service worker, ícone
- [x] Landing page com logo e botões de criar conta / login
- [x] Cadastro com validação (nome sem números, e-mail confirmado 2x, senha)
- [x] Verificação de e-mail com código de 6 dígitos (console)
- [x] Seleção de plano Free / Premium
- [x] Login com validação contra registry local
- [x] Login biométrico (Face ID / impressão digital) via WebAuthn
- [x] Dashboard com resumo, alertas, ações rápidas, atividade recente
- [x] CRUD de materiais com validação
- [x] Alertas de estoque baixo com threshold configurável
- [x] CRUD de receitas com dificuldade e materiais
- [x] Produção com dedução automática de estoque
- [x] Conversão de unidades (kg↔g, L↔ml) em produção e alertas
- [x] Perfil com foto, estatísticas, toggle biometria, logout
- [x] Mapa de lojas (Google Maps embutido) + lojas online
- [x] Navegação inferior com 5 abas (Início centralizado)
- [x] Limites Free/Premium (4 materiais, 10 receitas)
- [x] UI mobile-first, tons terrosos, fonte Nunito, alto contraste

---

## Fase 2 — Consolidação (Prioridade Alta)

- [ ] **Envio real de e-mail de verificação** — Integrar serviço de e-mail (Resend, SendGrid, ou Supabase Auth) para enviar o código de 6 dígitos de verdade
- [ ] **Backend mínimo** — Supabase ou Firebase para autenticação, storage de dados e sync entre dispositivos
- [ ] **Pagamento do Premium** — Integrar Stripe ou MercadoPago para cobrança de R$9,90/mês e R$89,90/ano
- [ ] **Chave do Google Maps em variável de ambiente** — Remover API key hardcoded do código e usar `.env`
- [ ] **Sync de dados na nuvem** — Sincronizar materiais, receitas e logs entre dispositivos via backend
- [ ] **Recuperação de senha** — Fluxo de "Esqueci minha senha" com envio de e-mail

---

## Fase 3 — Melhorias de UX (Prioridade Média)

- [ ] **Export/Import de dados** — Botão para exportar backup JSON e importar em outro dispositivo (funciona sem backend)
- [ ] **Histórico de produção completo** — Página dedicada com lista de todas as produções, filtros por data e receita
- [ ] **Busca e filtro** — Campo de busca nas listas de materiais e receitas
- [ ] **Error boundaries** — Tratamento de erros React para evitar crash total do app
- [ ] **Notificações push** — Alertar estoque baixo mesmo com o app fechado
- [ ] **Limitar tamanho da foto de perfil** — Redimensionar/comprimir antes de salvar em base64
- [ ] **Feedback tátil** — Vibração ao produzir ou salvar (API Vibration)
- [ ] **Onboarding** — Tutorial de primeiro uso com 3-4 telas explicativas
- [ ] **Skeleton loading** — Placeholders visuais enquanto carrega dados

---

## Fase 4 — Funcionalidades Extras (Prioridade Baixa)

- [ ] **Videoaulas** — Seção com vídeos tutoriais de cerâmica (requer internet)
- [ ] **Glossário de cerâmica** — Lista de termos e técnicas com explicações simples
- [ ] **Custo por peça** — Adicionar preço por material e calcular custo total de produção
- [ ] **Fotos nas receitas** — Permitir anexar foto da peça finalizada à receita
- [ ] **Compartilhar receita** — Enviar receita para outro usuário via link ou QR code
- [ ] **Tema escuro** — Opção de tema escuro nas configurações
- [ ] **Multi-idioma** — Suporte a inglês e espanhol
- [ ] **Relatórios** — Gráficos simples de consumo de materiais e produção por período
- [ ] **Categorias de materiais** — Agrupar materiais por tipo (argilas, esmaltes, tintas, etc.)
- [ ] **Fornecedores favoritos** — Salvar lojas favoritas no mapa

---

## Débitos Técnicos

- [ ] Deletar `useProfileStore.js` — arquivo morto, não usado (já removido)
- [ ] Mover API key do Google Maps para `.env`
- [ ] Adicionar tratamento de quota excedida no localStorage
- [ ] Adicionar testes unitários (Vitest) para `lib/auth.js`, `lib/units.js`, `lib/db.js`
- [ ] Adicionar testes de integração para fluxo de produção
- [ ] CI/CD — GitHub Actions para build + lint + testes
- [ ] Adicionar ESLint + Prettier para padronização de código

---

## Notas

- **Verificação de e-mail**: No MVP, o código aparece no console do navegador (F12). Em produção, precisa de backend.
- **Pagamento**: A seleção de plano é apenas visual. Não há cobrança real.
- **Dados locais**: Todos os dados estão no dispositivo. Se o usuário limpar dados do navegador ou trocar de celular, perde tudo. Backend resolve isso.
- **Biometria**: Funciona via WebAuthn. Requer HTTPS em produção (localhost funciona em dev).

# Podcast Política & Negócios - TODO

## Backend & Banco de Dados
- [x] Criar schema de episódios no Drizzle (título, descrição, videoUrl, publishedAt)
- [x] Criar schema de adminCredentials (username, passwordHash)
- [x] Implementar query helpers no server/db.ts para episódios (CRUD)
- [x] Implementar verifyAdminCredentials e initializeDefaultAdmin
- [x] Criar procedimentos tRPC: episodes.list, episodes.create, episodes.update, episodes.delete
- [x] Criar procedimentos tRPC: admin.login, admin.logout, admin.checkAuth
- [x] Rodar pnpm db:push para aplicar migrations

## Frontend - Estilo Global
- [x] Configurar index.css com paleta azul (#0d47a1) e dourado (#d4af37)
- [x] Adicionar fontes Playfair Display e Inter via Google Fonts
- [x] Configurar variáveis CSS para tema claro

## Frontend - Páginas Públicas
- [x] Desenvolver página Home (hero, features, episódios recentes, CTA WhatsApp, footer)
- [x] Desenvolver página Episódios (lista completa com player embed YouTube/Spotify)
- [x] Desenvolver página Sobre (missão, apresentador)
- [x] Implementar navbar responsiva com menu mobile

## Frontend - Área Admin
- [x] Criar contexto AdminAuthContext para gerenciar estado de autenticação
- [x] Desenvolver página AdminLogin com formulário usuário/senha
- [x] Desenvolver AdminDashboard com formulário de criação de episódios
- [x] Implementar edição e exclusão de episódios no dashboard
- [x] Proteger rota /admin/dashboard com verificação de autenticação

## Configuração & Rotas
- [x] Atualizar App.tsx com todas as rotas
- [x] Registrar rotas: /, /episodes, /about, /admin, /admin/dashboard

## Testes
- [x] Escrever testes vitest para admin.login, admin.logout, admin.checkAuth
- [x] Escrever testes para episodes.create e episodes.list

## Entrega
- [x] Criar checkpoint final
- [x] Validar todas as funcionalidades


## Redesign Tecnológico
- [x] Atualizar paleta de cores para tema escuro/tech (cinzas escuros, azuis neon, acentos modernos)
- [x] Trocar fontes para algo mais tech (ex: Sora, Outfit, ou manter Inter mas com pesos diferentes)
- [x] Remover brancos excessivos - usar tons de cinza escuro (#0f1419, #1a1f2e, #2d3748)
- [x] Redesenhar Home com hero mais tech, gradientes modernos
- [x] Atualizar componentes com visual mais sofisticado (cards, botões, inputs)
- [x] Redesenhar navbar com visual tech-forward
- [x] Atualizar footer com design moderno
- [x] Revisar todas as páginas (Episódios, Sobre, Admin) com novo design
- [x] Testar responsividade em mobile com novo design
- [ ] Criar checkpoint final com design tecnológico

## Atualização de Credenciais
- [x] Atualizar credenciais de admin para usuário "pulse" e senha "futuro"


## Bug Fix - Autenticação Admin
- [x] Corrigir erro de validação de credenciais (pulse/futuro não funciona)


## Módulo de Patrocinadores
- [x] Criar tabelas no banco: sponsors (nome, logo, url) e adminProfile (name, logo)
- [x] Criar helpers de banco de dados para CRUD de patrocinadores e admin profile
- [x] Criar procedimentos tRPC para sponsors (list, create, delete) e adminProfile (get, update)
- [x] Desenvolver componente de gerenciamento de patrocinadores no AdminDashboard
- [x] Desenvolver componente de gerenciamento de perfil do admin no AdminDashboard
- [x] Exibir patrocinadores na página Home com nome e logo
- [x] Exibir nome e logo do admin na página Home
- [x] Testar funcionalidades de adicionar/remover patrocinadores
- [x] Criar checkpoint final com módulo de patrocinadores


## Atualização da Navbar
- [x] Remover botão "Adicionar" da navbar quando admin está logado
- [x] Adicionar link "Portal Do Adm" na navbar que leva para /admin/dashboard

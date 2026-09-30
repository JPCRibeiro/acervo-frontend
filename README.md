<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/assets/logo-white.png">
    <img src="src/assets/logo-black.png" alt="Acervo" width="180">
  </picture>
</p>

<p align="center">
  Interface web do Acervo: uma SPA para conversar com seus documentos. O usuário envia arquivos, acompanha a indexação e faz perguntas em um chat que responde em tempo real e mostra de quais documentos veio cada resposta.
</p>

<br />

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-deploy-000000?logo=vercel&logoColor=white">
</p>

## O que faz

- Autenticação: cadastro (cria organização), login e entrada por convite. O access token fica em memória e o refresh token em cookie HttpOnly.
- Chat com RAG e streaming: a resposta aparece token a token (SSE) e traz as fontes citadas, com link para abrir o documento original.
- Conversas: histórico na sidebar, cada uma com sua URL (`/c/:id`).
- Documentos: upload, acompanhamento do status de indexação e listagem.
- Workspace: troca entre organizações, convites e gestão de membros (OWNER/MEMBER).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 e shadcn/ui (Radix)
- TanStack Query (estado do servidor) e Zustand (estado de auth)
- React Router v8
- axios e `@microsoft/fetch-event-source` (streaming SSE)
- react-hook-form + Zod (formulários e validação)
- react-markdown para renderizar as respostas

## Rodando localmente

Pré-requisitos: Node 20+, pnpm e o backend rodando (veja o repo `acervo-backend`).

1. Instale as dependências:
   ```bash
   pnpm install
   ```

2. Crie um `.env` apontando para a API:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

3. Rode:
   ```bash
   pnpm dev
   ```

A aplicação sobe em `http://localhost:5173`. Para gerar o build de produção, use `pnpm build`.

## Rotas

Públicas:

- `/entrar`, `/cadastro`, `/juntar`

Protegidas (exigem login):

- `/` — chat
- `/c/:id` — uma conversa específica
- `/documentos` — upload e status dos documentos
- `/workspace` — organizações, convites e membros

## Arquitetura

Organização por domínio: cada funcionalidade fica em `features/`, com sua própria camada de acesso à API e componentes. As páginas em `app/` montam essas features.

```
src/
├── app/          # páginas (chat, documentos, workspace) e telas de auth
├── features/     # módulos por domínio: auth, chat, documents, organization, user, workspace
├── components/   # compartilhados: sidebar, header e ui/ (shadcn)
├── layouts/      # AuthLayout, ProtectedLayout e AppShell
├── store/        # estado global de auth (Zustand)
├── lib/          # cliente axios, interceptors, React Query, JWT e utils
└── types/        # tipos TypeScript compartilhados
```

O fluxo de auth combina três peças: o access token em memória (Zustand), o refresh token no cookie HttpOnly e os interceptors do axios, que renovam o token automaticamente quando ele expira. O `ProtectedLayout` bloqueia as rotas privadas para quem não está logado.

## Deploy

Hospedado na Vercel, com deploy automático a cada push na `master`.

- Framework preset: Vite (build `pnpm build`, saída em `dist/`).
- Variável de ambiente: `VITE_API_URL` apontando para a API em produção.
- O `vercel.json` reescreve todas as rotas para o `index.html`, para que um F5 em `/documentos` ou `/c/:id` não caia em 404 (comportamento de SPA):
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

O front e a API ficam em subdomínios do mesmo domínio (`acervo.jpcribeiro.dev.br` e `api.acervo.jpcribeiro.dev.br`), o que permite o cookie de refresh funcionar com `SameSite=Lax`.

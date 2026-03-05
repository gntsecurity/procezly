# Procezly

Multi-tenant Automotive QMS + Kamishibai (Layered Process Audits)

## Domains

- procezly.io: marketing + entry
- *.procezly.io: tenant app

## Local development

1. Copy env files:
- apps/api/.dev.vars.example -> apps/api/.dev.vars
- apps/web/.env.local.example -> apps/web/.env.local

2. Install and run:
- npm install
- npm run dev:web
- npm run dev:api

## Deploy

- apps/web: Cloudflare Pages
- apps/api: Cloudflare Workers

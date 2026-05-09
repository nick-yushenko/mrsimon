# AGENTS.md

## Project context

This is a monorepo project with:

- `client/` — Next.js + React + TypeScript frontend
- `server/` — .NET API backend
- PostgreSQL database via Docker Compose

## General rules

- Keep changes minimal and focused on the requested task.
- Do not rewrite unrelated code.
- Follow the existing project structure and naming conventions.
- Prefer simple, readable solutions over over-engineering.
- Before adding a new dependency, explain why it is needed.

## Response style

- Answer in Russian.
- Be brief and task-focused.
- Do not add explanations unless asked.
- Stay within the current project architecture.
- Give concrete changes, not general theory.

## Project-specific answers

- For architecture and file placement questions, answer specifically for this repository.
- Before answering where to put a file, inspect the existing project structure.
- Do not give generic option lists like "Option 1 / Option 2" unless explicitly asked.
- Prefer one recommended solution with a concrete path.
- If there are alternatives, mention them briefly only after the main recommendation.
- Use existing conventions from this project as the source of truth.
- If the project structure is unclear, inspect files first instead of guessing.

## Forbidden actions

- Do not start the project or long-running dev servers.
- Do not run `pnpm dev`, `pnpm start`, `npm run dev`, `npm start`.
- Do not run `dotnet run`, `dotnet watch`.
- Do not run `docker compose up` or `docker compose up --build`.
- Do not run database migrations unless explicitly asked.

## Allowed checks

Run only targeted verification commands when relevant:

```bash
cd client && pnpm lint
cd client && pnpm lint:fix
```

## Frontend rules

- Use TypeScript.
- Follow the existing Next.js App Router structure.
- Use existing shared UI/components when possible.
- Keep feature code close to the relevant feature/module.
- Do not introduce global state unless it is actually needed.

## Backend rules

- Follow the existing .NET project structure.
- Keep controllers thin.
- Put business logic outside controllers when it grows.
- Use async APIs for database operations.
- Do not change existing migrations unless explicitly asked.

## Commands

Frontend:

```bash
cd client
pnpm lint
pnpm build
```

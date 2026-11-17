# Fitplace

A React and Next.js application for discovering interesting places for physical
activities. The current prototype contains a rating component and a list of
published places backed by a local mock API. Map discovery is the next feature.

## Requirements

- Node.js 22.12 or newer; use an LTS release.
- pnpm 9.15.3, matching `frontend/package.json`.
- Git, required for installing local commit hooks.

The repository currently contains one standalone application in `frontend/`.
There is no pnpm workspace or root `package.json` yet. All commands below run
from the repository root and use `-C frontend` to select the application.

The root `.nvmrc` is currently empty. It does not select a Node.js version until
a version is added. This environment setup does not change that file.

## Installation

```bash
pnpm -C frontend install --frozen-lockfile
cp -n frontend/.env.example frontend/.env.local
```

Installation runs `prepare` and configures Husky for this repository. To install
the hooks again without reinstalling dependencies:

```bash
pnpm -C frontend prepare
```

## Development

Start the mock API in one terminal:

```bash
pnpm -C frontend start:mock-server
```

The API listens on `http://localhost:8000`. Its data is stored in
`frontend/json-server/db.json`; requests have an artificial 800 ms delay.

Start Next.js in another terminal:

```bash
pnpm -C frontend dev
```

Open `http://localhost:3000` for the rating demo or
`http://localhost:3000/places` for the published places list. Next.js may select
another port if port 3000 is occupied; use the URL printed in the terminal.

## Environment Variables

Next.js reads local variables from `frontend/.env.local`.

| Variable                   | Required | Default in the example  | Purpose                                    |
| -------------------------- | -------- | ----------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_MOCK_API_URL` | Yes      | `http://localhost:8000` | Mock API base URL used by the places list. |

`NEXT_PUBLIC_*` values are exposed to the browser. Never store secrets in them.
The localhost API address is for local development; on another device it points
to that device. Restart the dev server after changing environment variables.

Files matching `.env*` are ignored by Git, except `.env.example`. Keep only
non-secret examples and placeholders in committed templates.

## Checks

```bash
pnpm -C frontend check:all
```

| Command            | Purpose                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| `check:format`     | Check formatting across the repository.                                      |
| `check:format:fix` | Apply Prettier formatting across the repository.                             |
| `check:lint`       | Run ESLint; warnings also cause failure.                                     |
| `check:lint:fix`   | Apply available ESLint fixes, then report remaining issues.                  |
| `check:fsd`        | Check FSD import boundaries and public APIs.                                 |
| `check:ts`         | Generate Next.js route types and run TypeScript without emitting JavaScript. |
| `check:all`        | Run formatting, ESLint, FSD and TypeScript checks in order.                  |

Run any listed command as `pnpm -C frontend <command>`. Fix commands modify
files, so review their diff before staging. The aggregate check never runs a
production build and stops at the first failing check.

Steiger currently reports two advisory warnings about slices with one consumer.
They do not fail `check:fsd`; import and public API violations do fail it.

Prettier and EditorConfig are configured at the repository root. Generated
files, dependencies, build output, lock files and local environment files are
excluded from formatting. Enable the project's Prettier integration in your
editor to use the same formatting on save.

## Git Hooks and Commit Messages

- `pre-commit` runs the complete `check:all`, not just checks on staged files.
- `commit-msg` validates the message with commitlint and Conventional Commits.
- Neither hook automatically fixes or stages files.

Commit message format:

```text
type(optional-scope): description
```

Examples:

```text
feat(place): add map markers
fix(place): preserve coordinates after validation
chore(frontend): configure development checks
```

There is no mandatory ticket ID or restricted project-specific scope. Both
hooks are local feedback tools, not a replacement for required CI checks on
protected branches. A GitHub Actions workflow is not configured yet.

## Structure

```text
frontend/
  src/
    app/                  Next.js routes, layouts and special files
    _pages/               Screen composition
    widgets/              Composed interface sections
    entities/             Domain types, schemas and entity UI
    shared/               Reusable UI, types and utilities
  json-server/            Local mock API and demonstration data
  .husky/                 Commit checks
```

Imports from another slice go through its public `index.ts`. Existing aliases
use `@/src/...`; changing the alias is not part of this setup.

## Production Commands

Run these explicitly when needed; they are not part of `check:all`:

```bash
pnpm -C frontend build
pnpm -C frontend start
```

The mock API is a separate development process and is not started by Next.js.

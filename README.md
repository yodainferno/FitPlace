# Fitplace

A React and Next.js application for discovering interesting places for physical
activities. The current prototype contains a rating component and a list of
published places backed by a local mock API. Map discovery is the next feature.

## Requirements

- Node.js 22.22.2, matching `.nvmrc`.
- pnpm 9.15.3, matching the root `package.json`.
- Git, required for installing local commit hooks.

The repository is a pnpm workspace with one application in `frontend/`.
`pnpm-workspace.yaml` lists its packages, and the root `pnpm-lock.yaml` records
their exact dependency versions. Install dependencies from the repository root.
The root package is named `fitplace-workspace`; the frontend package is named
`fitplace`, so `--filter fitplace` selects the frontend.

## Installation

```bash
nvm use
pnpm install --frozen-lockfile
cp -n frontend/.env.example frontend/.env.local
```

Installation runs `prepare` and configures Husky for this repository. To install
the hooks again without reinstalling dependencies:

```bash
pnpm prepare
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
pnpm dev
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
pnpm check:all
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

The root `dev` and `check:all` scripts forward to the frontend package. Run any
individual check as `pnpm -C frontend <command>`. Fix commands modify
files, so review their diff before staging. The aggregate check never runs a
production build and stops at the first failing check.

Steiger currently reports two advisory warnings about slices with one consumer.
They do not fail `check:fsd`; import and public API violations do fail it.

Prettier and EditorConfig are configured at the repository root. Generated
files, dependencies, build output, lock files and local environment files are
excluded from formatting. Enable the project's Prettier integration in your
editor to use the same formatting on save.

## Styling

Tailwind CSS 4 uses a CSS-first configuration in
`frontend/src/app/globals.css`. The `@theme static` block defines the design
tokens; a separate `tailwind.config.js` is not needed. Colors follow
[`frontend/BRANDBOOK.md`](frontend/BRANDBOOK.md).

| Token              | Color     | Usage                                                |
| ------------------ | --------- | ---------------------------------------------------- |
| `primary`          | `#237D83` | Main actions, navigation and unselected map markers. |
| `secondary`        | `#BB405C` | Selected places and small brand accents.             |
| `foreground`       | `#24282B` | Main text.                                           |
| `background`       | `#FFFFFF` | Main background.                                     |
| `surface`          | `#F6F8F8` | Secondary surfaces.                                  |
| `muted-foreground` | `#58666B` | Supporting text.                                     |
| `border`           | `#DCE5E6` | Borders and separators.                              |

Use semantic utilities such as `bg-primary`, `text-secondary`, `border-border`
and `hover:bg-primary/10`, rather than repeating hex values in components.
`primary-hover` and `secondary-hover` darken the corresponding accents;
`primary-foreground` and `secondary-foreground` are white text for solid accent
backgrounds. Gold `rating` and red `destructive` have separate semantic roles.

The theme also contains panel, popup and dialog shadows and a `map:` breakpoint
starting at 721 px. Below it, the places list becomes a bottom sheet. The
existing Arial/Helvetica fallback is retained; no web font is loaded.

Use `cn` from `@/src/shared/lib` for conditional classes and utility overrides:

```tsx
className={cn('p-2 text-primary', selected && 'text-secondary', className)}
```

`cn` combines `clsx` with `tailwind-merge`: falsy conditions are ignored and later
conflicting utilities win. Shared `IconButton` accepts `className` overrides
through the same helper.

Keep ordinary layout and states in Tailwind. `PlacesMap.module.css` is the only
CSS Module: it targets nested DOM owned by MapLibre, including popup content
and the mobile attribution position. MapLibre's own stylesheet is still
required. The map's inline width and height are part of the map API integration.

## Git Hooks and Commit Messages

- Hooks live in the root `.husky/`; the root package owns Husky and commitlint.
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
.husky/                   Repository-wide commit checks
commitlint.config.mjs     Conventional Commits configuration
pnpm-workspace.yaml       Workspace package list
pnpm-lock.yaml            Shared dependency lockfile
frontend/
  src/
    app/                  Next.js routes, layouts and special files
    _pages/               Screen composition
    widgets/              Composed interface sections
    entities/             Domain types, schemas and entity UI
    shared/               Reusable UI, types and utilities
  json-server/            Local mock API and demonstration data
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

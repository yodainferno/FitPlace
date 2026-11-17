# Fitplace Frontend

See the [repository README](../README.md) for installation, environment variables,
mock API, Git hooks and architecture.

Commands from this directory:

```bash
pnpm dev
pnpm start:mock-server
pnpm check:all
```

Start the application and mock API in separate terminals. To apply formatting
or available lint fixes:

```bash
pnpm check:format:fix
pnpm check:lint:fix
```

Formatting commands intentionally cover the repository root as well as the
frontend. They use the root Prettier configuration and ignore file.

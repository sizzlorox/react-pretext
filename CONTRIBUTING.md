# Contributing

Contributions are welcome — bug fixes, new features, documentation improvements, and tests.

## Development setup

```sh
git clone https://github.com/sizzlorox/react-pretext.git
cd react-pretext
npm install
```

| Command | Description |
|---------|-------------|
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Type-check without emitting |
| `npm run build` | Build the distributable |
| `npm run dev` | Build in watch mode |

## Workflow

1. Fork the repo and create a branch from `main`.
2. Make your changes and add tests where appropriate.
3. Ensure `npm run typecheck`, `npm test`, and `npm run build` all pass.
4. Open a pull request against `main`.

## Guidelines

- **Keep PRs focused.** One logical change per PR makes review faster.
- **Match the existing style.** TypeScript strict mode, no `any`, no default exports in hooks.
- **Test your changes.** New hooks or behavior changes need corresponding Vitest tests under `tests/`.
- **Update the README** if you add or change public API surface.

## Reporting bugs

Open a [GitHub issue](https://github.com/sizzlorox/react-pretext/issues/new?template=bug_report.md). Include a minimal reproduction — the smaller the better.

## Proposing features

Open a [GitHub issue](https://github.com/sizzlorox/react-pretext/issues/new?template=feature_request.md) first to discuss the idea before writing code.

## Commit messages

Use short, imperative-mood subject lines, e.g. `fix: handle zero maxWidth in usePretextLayout`.

Prefix with one of: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `ci`.

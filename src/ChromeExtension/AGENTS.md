# AGENTS.md for src/ChromeExtension

Rules for the Chrome extension in `src/ChromeExtension`.

## Code style
- Use TypeScript static typing.
- Don't use `any` if a correct type can be described.
- Specify input and output types for functions.
- Move reusable utilities into `src/infrastructure`.

## Build before PR
- `cd /workspace/Ebay/src/ChromeExtension && npm run build`

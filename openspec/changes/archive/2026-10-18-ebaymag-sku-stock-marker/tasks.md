# Tasks

## 1. Extension

- [x] 1.1 Add a frontend product measurements URL helper to `src/ChromeExtension/src/constants.ts` and pass `{ availableQuantity, productUrl }` per lot from `EbayMagSiteProcessor` to `highlightStockRows`; verify `npm run build` succeeds
- [x] 1.2 Rework `StockQuantityHighlighter.ts`: stop touching the quantity cell; keep the green SKU; maintain the badges span after the SKU with the ❗ / ⚠️ marker + tooltip and the 🔗 product link (new tab, clicks not propagated); remove it for unknown SKUs; verify with the tests in 1.3
- [x] 1.3 Update `src/ChromeExtension/tests/StockQuantityHighlighter.test.ts` to cover every scenario of the modified `ebaymag-stock-quantity-check` spec with `[OpenSpecScenario]` comments; verify `npm test` passes

## 2. Integration checks

- [x] 2.1 Run `openspec validate ebaymag-sku-stock-marker --strict` and verify it passes
- [x] 2.2 Run `./scripts/agent-check/agent-check.sh` and verify every step passes except the known Windows-only failure of the coverage checker's own tests (`spawnSync openspec ENOENT`)

## Workflow follow-up

- Archive the change, update the spec Purpose, run the coverage checker, open the PR.

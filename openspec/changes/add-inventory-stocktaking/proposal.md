## Why

Staff have no way to record that a physical measurement (tube) was actually seen and counted during a stocktaking round, nor to correct its storage location while walking the shelves. Today `Location` can only be edited one-by-one from the office measurements table, with no link to "when was this last physically verified." A dedicated scan-driven inventory workflow lets staff walk the shelves, scan each measurement's QR code, and in one motion confirm it was counted (stamping an inventory date) and, if needed, fix its storage location.

## What Changes

- Add a new "Инвентаризация" (Inventory) tab/page to the Blazor client dedicated to stocktaking.
- Reuse the existing QR/barcode scanner (`Interop.StartQrScanner()` + `html5-qrcode`, already used on `Measurements.razor` and `MeasurementPhotos.razor`) rather than introducing a new scanning mechanism; factor the scan-button/`#reader` markup into a small reusable Razor component so a third page does not duplicate it inline a third time.
- Add a new `InventoryDate` property to the `ProductMeasurement` aggregate (`Server.Domain.Measurements`), recording when a measurement was last physically verified during a stocktaking scan.
- On each successful scan on the Inventory page, automatically stamp the scanned measurement's `InventoryDate` to "now" (server time).
- After a scan, let staff view and optionally update that measurement's existing `Location` property from the same page, without leaving the Inventory tab or re-scanning.
- Add a new application-layer use case and `WebApi.yaml` endpoint(s) to record an inventory scan (stamp `InventoryDate`, optionally update `Location` in the same call) for a measurement id.

## Capabilities

### New Capabilities
- `inventory-stocktaking`: Scan-driven stocktaking workflow — a dedicated Inventory tab where scanning a measurement's QR code stamps its inventory date and allows updating its storage location.

### Modified Capabilities
(none — `measurement-photos` is unaffected; the QR scanner JS interop and library are reused as-is, not changed)

## Impact

- New Blazor page: `src/Ebay/Frontend/Pages/Inventory.razor` (or similar), reachable from `src/Ebay/Frontend/Shared/NavMenu.razor`.
- New/extracted shared scanner component under `src/Ebay/Frontend/Shared/` reusing `src/Ebay/Frontend/Interop.cs` (`StartQrScanner`) and `src/Ebay/Frontend/wwwroot/js/interop.js`; no new JS scanning library.
- Domain: `src/Ebay/Server.Domain/Measurements/ProductMeasurement.cs` gains an `InventoryDate` property and a state-changing method to set it.
- Application: `src/Ebay/Server.Application.New/MeasurementService.cs` and `Server.Application.Abstractions.Driving/Abstractions/Services/IMeasurementService.cs` gain a use case to record an inventory scan (stamp date, optionally update location).
- Contracts: `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` gains a new endpoint under `/measurements/{measurementId}/inventory` (NSwag-generated client/server code); `Server.Adapters.Driving.WebApi/Controllers/WebApiController.cs` wires the new generated interface method to the application service.
- Database: write-model migration in `Server.Adapters.Driven.EF.WriteModel` adding the `InventoryDate` column to the measurement table (schema `wm`).
- No changes to the Chrome extension or the Legacy OpenAPI contract.

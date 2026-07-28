## 1. Domain

- [ ] 1.1 Add a nullable `DateTimeOffset InventoryDate` property to `ProductMeasurement` (`src/Ebay/Server.Domain/Measurements/ProductMeasurement.cs`), following the existing `LastTimeWatchedOnEbay` pattern (private setter).
- [ ] 1.2 Add a `MarkInventoried(DateTimeOffset scannedAtUtc)` method to `ProductMeasurement` that sets `InventoryDate`.

## 2. Write-model persistence

- [ ] 2.1 Add EF configuration for the new `InventoryDate` column in `Server.Adapters.Driven.EF.WriteModel`.
- [ ] 2.2 Generate and review the EF Core migration (`dotnet ef migrations add`) adding the nullable column to schema `wm`; confirm existing rows get `NULL`.

## 3. Application layer

- [ ] 3.1 Add a `RecordInventoryScan(string measurementId, CancellationToken)` use case to `IMeasurementService` (`Server.Application.Abstractions.Driving/Abstractions/Services/IMeasurementService.cs`) that stamps `InventoryDate` to `DateTimeOffset.UtcNow` and returns the measurement id and current `Location`; implement it in `MeasurementService` (`Server.Application.New/MeasurementService.cs`), throwing/returning not-found the same way `UpdateMeasurementLocation` does today when the measurement id is unknown.
- [ ] 3.2 Confirm `UpdateMeasurementLocation` (already implemented in `MeasurementService`) needs no logic changes to be reused by the new endpoint.

## 4. API contract

- [ ] 4.1 Add `POST /measurements/{measurementId}/inventory` to `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` (request: none; response: measurement id + current location; 404 when not found).
- [ ] 4.2 Add `PUT /measurements/{measurementId}/location` to `WebApi.yaml`, delegating to the existing `UpdateMeasurementLocation` use case (request: location string, blank clears it; 200; 404 when not found).
- [ ] 4.3 Regenerate NSwag client/server code and wire both new operations into `Server.Adapters.Driving.WebApi/Controllers/WebApiController.cs`, delegating straight to `IMeasurementService` with no logic in the controller.

## 5. Blazor client — shared scanner component

- [ ] 5.1 Extract the QR scan button + `<div id="reader">` host + `Interop.StartQrScanner()` call + measurement-id extraction (currently inlined in `Measurements.razor` and `MeasurementPhotos.razor`) into a new shared component under `src/Ebay/Frontend/Shared/` with an `OnScanned` callback; leave the two existing pages unmodified for this change.

## 6. Blazor client — Inventory tab

- [ ] 6.1 Add `src/Ebay/Frontend/Pages/Inventory.razor` using the shared scanner component from task 5.1.
- [ ] 6.2 On successful scan, call the new `POST /measurements/{measurementId}/inventory` endpoint via the generated `WebApiClient`, show a not-found message if the measurement doesn't exist, and otherwise show a scan-confirmed indicator plus the returned current storage location in an editable field.
- [ ] 6.3 Add a save action that calls `PUT /measurements/{measurementId}/location` only when staff actually changes the location field; show the persisted result.
- [ ] 6.4 Add an "Инвентаризация" entry to `src/Ebay/Frontend/Shared/NavMenu.razor` linking to the new page.

## 7. Verification

- [ ] 7.1 Add/extend unit tests for `ProductMeasurement.MarkInventoried` and the new `MeasurementService` use case (`[TestOf(typeof(...))]` per project convention), covering found and not-found cases.
- [ ] 7.2 Manually verify the end-to-end flow: scan a known measurement's QR code, confirm the inventory date is stamped, confirm the current location is shown, edit and save a new location, confirm it persists; scan an unknown code and confirm a not-found message with no side effects.
- [ ] 7.3 Run `./agent-check.sh` from the repository root.

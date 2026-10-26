# Proposal

## Why

Currencies and their rates exist only as rows someone added to the database by hand. A fresh database (a local run, a cloud sandbox, a new deployment) has none: the products page then fails with `KeyNotFoundException: RUB`, lot prices cannot be calculated, and the rate refresh has nothing to refresh, because it only updates currencies that already exist.

## What Changes

- On every start the application adds the default currencies that are missing: `USD` (base), `RUB` (target), `EUR`, `GBP`, `AUD`, `CAD`, `KZT`, with approximate placeholder rates dated 1970-01-01, which the rate refresh replaces.
- Currencies that already exist are never changed, so production rows stay as they are.

## Capabilities

### New Capabilities
- `default-currencies`: the set of currencies a database always has after the application starts.

### Modified Capabilities
<!-- none -->

## Impact

- `src/Ebay/Server.Application/Currencies` (new `DefaultCurrencyService`), `src/Ebay/Server.Adapters.Driving.BackgroundTasks` (startup hosted service, registered before the rate refresh).
- Tests in `src/Ebay/Tests.Unit` and `src/Ebay/Tests.Integration`.

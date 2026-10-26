## ADDED Requirements

### Requirement: Default currencies exist after start
When the application starts, it SHALL add every default currency that the database does not have: `USD`, `RUB`, `EUR`, `GBP`, `AUD`, `CAD` and `KZT`. An added currency SHALL use its ISO code as both its eBay and rate-source name, an approximate rate per one US dollar and the last update date 1970-01-01, so that it shows as never refreshed until the rate refresh replaces the rate. Currencies that already exist SHALL keep their name, rate and last update date.

#### Scenario: Started application has the default currencies
- **WHEN** the application has started on a database without currencies
- **THEN** the currency list contains `USD`, `RUB`, `EUR`, `GBP`, `AUD`, `CAD` and `KZT`

#### Scenario: Missing default currency is added with a placeholder rate
- **WHEN** default currencies are added and `CAD` does not exist
- **THEN** `CAD` exists with the rate-source name `CAD`, a positive rate and the last update date 1970-01-01

#### Scenario: Existing currency is kept
- **WHEN** default currencies are added and `RUB` already exists with its own name, rate and last update date
- **THEN** `RUB` keeps that name, rate and last update date

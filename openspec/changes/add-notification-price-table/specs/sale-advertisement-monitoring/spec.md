# Spec Delta

## ADDED Requirements

### Requirement: Notification lists notified products with their estimated prices
The notification body SHALL contain, below the matched lines, a table with one row per newly recorded interesting product of the advertisement, in the order the products were first matched. Each row SHALL show the product name (HTML-encoded), the estimated price and the number of units sold. Products that matched but were not newly recorded or are not interesting SHALL NOT be listed.

#### Scenario: Table row shows the product's estimated price in roubles
- **WHEN** an advertisement notifies product "6Н2П" whose average revenue is 15.4 USD per unit over 7 sold units, and the stored RUB rate is 80 per USD
- **THEN** the notification body has a table row with "6Н2П", "1232 RUB" and "7"

#### Scenario: Products that did not trigger the notification are not listed
- **WHEN** one advertisement matches a newly recorded interesting product, a product already recorded for the seller, and a non-interesting product
- **THEN** the table has exactly one row, for the newly recorded interesting product

#### Scenario: A product matched by several lines has one row
- **WHEN** two lines of one advertisement match the same newly recorded interesting product
- **THEN** the table has exactly one row for that product

#### Scenario: Product name is HTML-encoded
- **WHEN** a notified product is named "<b>6Н2П</b>"
- **THEN** the table row contains "&lt;b&gt;6Н2П&lt;/b&gt;" and not the raw tag

### Requirement: Estimated price falls back to USD without a RUB rate
When no RUB currency rate is stored, the notification SHALL still be sent and each estimated price SHALL be shown as the average revenue in USD, rounded to whole dollars and suffixed with "USD".

#### Scenario: Missing RUB rate shows the price in dollars
- **WHEN** a product with average revenue 15.4 USD is notified and no RUB rate is stored
- **THEN** the notification is sent and its table row shows "15 USD"

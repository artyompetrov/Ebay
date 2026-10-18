# ebaymag-stock-quantity-check Specification

## Purpose
Helps the operator keep ebaymag listing quantities in line with real stock by highlighting, on the ebaymag stock page, quantities that differ from the available quantity of our lots for sale.

## Requirements

### Requirement: Quantity greater than available is highlighted red
On the ebaymag stock page, when a row's SKU is the id of one of our lots for sale and the quantity shown in that row is greater than the lot's available quantity, the extension SHALL show the quantity in red with a tooltip stating how many units are actually in stock.

#### Scenario: Listing offers more units than are in stock
- **WHEN** the stock page shows quantity 4 for the SKU of a lot whose available quantity is 2
- **THEN** the quantity 4 is shown in red with a tooltip saying only 2 are in stock

#### Scenario: Listing offers units of a lot with nothing in stock
- **WHEN** the stock page shows quantity 1 for the SKU of a lot whose available quantity is 0
- **THEN** the quantity 1 is shown in red with a tooltip saying only 0 are in stock

### Requirement: Quantity less than available is highlighted yellow
On the ebaymag stock page, when a row's SKU is the id of one of our lots for sale and the quantity shown in that row is less than the lot's available quantity, the extension SHALL show the quantity in yellow with a tooltip stating how many units are in stock.

#### Scenario: Listing offers fewer units than are in stock
- **WHEN** the stock page shows quantity 1 for the SKU of a lot whose available quantity is 3
- **THEN** the quantity 1 is shown in yellow with a tooltip saying 3 are in stock

### Requirement: Matching or foreign quantities are not highlighted
The extension SHALL NOT highlight the quantity of a row when it equals the lot's available quantity, and SHALL NOT touch rows whose SKU is not the id of one of our lots for sale.

#### Scenario: Listing quantity equals available quantity
- **WHEN** the stock page shows quantity 2 for the SKU of a lot whose available quantity is 2
- **THEN** the quantity is shown without highlight or tooltip added by the extension

#### Scenario: Row of an unknown SKU
- **WHEN** the stock page shows a row whose SKU is not the id of any of our lots for sale
- **THEN** neither its SKU nor its quantity is highlighted

### Requirement: Highlights follow the current row content
The extension SHALL keep the SKU and quantity highlights of each row in line with the row's current SKU and quantity, removing a highlight and tooltip that no longer apply when the row content changes.

#### Scenario: Quantity is corrected on the page
- **WHEN** a quantity shown in red is changed on the stock page to the lot's available quantity
- **THEN** the red colour and tooltip are removed from it

#### Scenario: Row is reused for an unknown SKU
- **WHEN** a row that showed one of our lots with highlighted SKU and quantity starts showing a SKU that is not one of our lots
- **THEN** the SKU and quantity highlights and tooltip are removed from that row

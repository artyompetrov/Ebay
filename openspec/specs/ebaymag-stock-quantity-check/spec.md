# ebaymag-stock-quantity-check Specification

## Purpose
Helps the operator keep ebaymag listing quantities in line with real stock: on the ebaymag stock page, our lots are marked next to their SKU when the listed quantity differs from the available quantity, and link to the product in our app.

## Requirements

### Requirement: Over-stock listing is marked next to the SKU
On the ebaymag stock page, when a row's SKU is the id of one of our lots for sale and the listed quantity is greater than the lot's available quantity, the extension SHALL show a ❗ marker next to the SKU whose tooltip says the quantity must be reduced and how many units are in stock. The quantity cell SHALL NOT be changed.

#### Scenario: Listing offers more units than are in stock
- **WHEN** the stock page shows quantity 4 for the SKU of a lot whose available quantity is 2
- **THEN** a ❗ marker is shown next to the SKU with a tooltip saying 4 are listed but only 2 are in stock, and the quantity cell is unchanged

#### Scenario: Listing offers units of a lot with nothing in stock
- **WHEN** the stock page shows quantity 1 for the SKU of a lot whose available quantity is 0
- **THEN** a ❗ marker is shown next to the SKU with a tooltip saying 1 is listed but only 0 are in stock

### Requirement: Under-stock listing is marked next to the SKU
On the ebaymag stock page, when a row's SKU is the id of one of our lots for sale and the listed quantity is less than the lot's available quantity, the extension SHALL show a ⚠️ marker next to the SKU whose tooltip says the quantity can be increased and how many units are in stock. The quantity cell SHALL NOT be changed.

#### Scenario: Listing offers fewer units than are in stock
- **WHEN** the stock page shows quantity 1 for the SKU of a lot whose available quantity is 3
- **THEN** a ⚠️ marker is shown next to the SKU with a tooltip saying 1 is listed while 3 are in stock, and the quantity cell is unchanged

### Requirement: No marker for matching quantities or foreign SKUs
The extension SHALL NOT show a stock marker when the listed quantity equals the lot's available quantity, and SHALL NOT add anything to rows whose SKU is not the id of one of our lots for sale.

#### Scenario: Listing quantity equals available quantity
- **WHEN** the stock page shows quantity 2 for the SKU of a lot whose available quantity is 2
- **THEN** no stock marker is shown for that row

#### Scenario: Row of an unknown SKU
- **WHEN** the stock page shows a row whose SKU is not the id of any of our lots for sale
- **THEN** the SKU is not highlighted and no marker or link is added to the row

### Requirement: Product page link next to the SKU
For every row whose SKU is the id of one of our lots for sale, the extension SHALL show a 🔗 link next to the SKU that opens the measurements page of the lot's product in our app (`/Product/{productId}/Measurements`) in a new tab.

#### Scenario: Link to the product of a known lot
- **WHEN** the stock page shows the SKU of a lot whose product id is P
- **THEN** a 🔗 link next to the SKU points to `/Product/P/Measurements` of our app and opens in a new tab

### Requirement: Markers follow the current row content
The extension SHALL keep the SKU highlight, stock marker and product link of each row in line with the row's current SKU and quantity, removing those that no longer apply when the row content changes. While the listed quantity cannot be read (the quantity cell is being edited), the row's marker SHALL stay as it was.

#### Scenario: Quantity is corrected on the page
- **WHEN** a row shows a ❗ marker and its quantity is changed on the stock page to the lot's available quantity
- **THEN** the marker is removed while the product link stays

#### Scenario: Quantity cell is being edited
- **WHEN** a row shows a ❗ marker and its quantity cell is replaced by an edit control
- **THEN** the ❗ marker stays next to the SKU

#### Scenario: Row is reused for an unknown SKU
- **WHEN** a row that showed one of our lots with a highlighted SKU, a marker and a link starts showing a SKU that is not one of our lots
- **THEN** the SKU highlight, the marker and the link are removed from that row

# Spec Delta

## Purpose

Lets the operator register eBay lots of a product from the Chrome extension, keeping only the sales made under the lot's current title, and shows at a glance whether a stored lot still matches what eBay shows.

## ADDED Requirements

### Requirement: Registering a lot stores its current listing
When the extension submits a lot for a product, the backend SHALL create the lot if it is not stored yet, or replace the stored listing details (name, quantity per lot, lot size, price, currency, shipping, additional shipping, shipping country, description, condition, condition description, seller, location, title change date, categories) otherwise. Registering a lot SHALL also remove it from the product's ignored lots.

#### Scenario: New lot is registered
- **WHEN** a lot that is not stored is submitted for a product
- **THEN** reading that lot returns the product id and the submitted listing details

#### Scenario: Stored lot is registered again
- **WHEN** a stored lot is submitted again with a different price and name
- **THEN** reading that lot returns the new price and name

#### Scenario: Ignored lot is registered
- **WHEN** a lot that is ignored for a product is submitted for that product
- **THEN** the lot is no longer in that product's ignored lots

#### Scenario: Extension sends fields outside the contract
- **WHEN** a lot is submitted with extra fields `productId`, `autoPcs` and `additionalProperties`, and `pcs` written as the string `"1"`
- **THEN** the lot is stored with quantity per lot 1

### Requirement: Sales before the title change are not stored
Sellers reuse a listing for different goods by renaming it, so sales made before the latest title change are unknown goods. The backend SHALL store only the submitted sales dated at or after the submitted title change date, and SHALL delete stored sales of the lot dated before it. A lot whose title never changed SHALL be submitted with the title change date 1970-01-01T00:00:00Z.

#### Scenario: Sales before the title change are dropped
- **WHEN** a lot is submitted with title change date 2026-05-01 and sales dated 2026-04-30 and 2026-05-02
- **THEN** the stored lot has only the sale dated 2026-05-02

#### Scenario: Title changed since the last registration
- **WHEN** a stored lot with sales dated 2026-04-30 and 2026-05-02 is submitted again with title change date 2026-05-01 and no sales
- **THEN** the stored lot has only the sale dated 2026-05-02

#### Scenario: Sale at the title change moment
- **WHEN** a lot is submitted with a sale dated exactly at its title change date
- **THEN** the sale is stored and reported as recent

### Requirement: A sale is registered once per date
The backend SHALL identify a lot's sales by their date: submitting a sale with the date of a stored sale SHALL update that sale's price and quantity instead of adding another one.

#### Scenario: Same sale submitted twice
- **WHEN** a lot is submitted twice with a sale on the same date, the second time with quantity 3
- **THEN** the stored lot has one sale on that date, with quantity 3

### Requirement: Stored lot is returned with documented fields only
The lot returned by the backend SHALL contain only the fields documented in the API contract; it SHALL NOT contain an `additionalProperties` field.

#### Scenario: Reading a registered lot
- **WHEN** a registered lot is read through the API
- **THEN** neither the lot, its sales nor its categories contain an `additionalProperties` field

### Requirement: Lot page shows whether the stored lot matches eBay
On an eBay lot page the extension panel SHALL be white when the lot is not stored and red when the stored listing differs from eBay. When the listing matches, it SHALL be yellow if eBay shows a sale with a price (at or after the title change date) and the latest such sale's date differs from the latest stored sale with a price, and green otherwise.

#### Scenario: Lot is not stored
- **WHEN** the backend has no such lot
- **THEN** the panel is white

#### Scenario: Lot was just registered
- **WHEN** the lot read from eBay was submitted and the backend returns it as stored, with missing optional values as `null` and its fields in a different order
- **THEN** the panel is green

#### Scenario: eBay has a newer sale
- **WHEN** the listing matches and eBay's latest sale with a price is on 2026-10-20 while the latest stored sale with a price is on 2026-10-01
- **THEN** the panel is yellow

#### Scenario: Stored sales include sales eBay no longer shows
- **WHEN** the listing matches, eBay's latest sale with a price is stored, and the stored lot also has older sales without a price that eBay no longer shows
- **THEN** the panel is green

#### Scenario: Latest stored sale has no price
- **WHEN** the listing matches, eBay's latest sale with a price is stored, and a newer stored sale has no price
- **THEN** the panel is green

#### Scenario: eBay shows no sale with a price
- **WHEN** the listing matches and none of the sales eBay shows has a price
- **THEN** the panel is green

#### Scenario: Price changed on eBay
- **WHEN** eBay shows a price different from the stored one and every sale is stored
- **THEN** the panel is red

### Requirement: Listing comparison covers eBay-owned fields
The lot page SHALL treat the listing as different when any of name, lot size, shipping country, currency, price, shipping, additional shipping, condition, condition description, location or title change date differs. It SHALL ignore fields the operator sets or that eBay changes without affecting the offer: quantity per lot, categories, description, short description and seller. A missing value and `null` SHALL be equal; dates SHALL be compared as moments in time.

#### Scenario: Title change date differs
- **WHEN** eBay shows a title change after the stored title change date
- **THEN** the listing is different

#### Scenario: Operator-set fields differ
- **WHEN** only quantity per lot, categories, description, short description or seller differ
- **THEN** the listing is the same

#### Scenario: Missing and null values
- **WHEN** the stored lot has lot size and condition description `null` and the eBay lot has neither value
- **THEN** the listing is the same

#### Scenario: Same moment written differently
- **WHEN** the stored title change date is `1970-01-01T00:00:00Z` and the eBay one is `1970-01-01T00:00:00.000Z`
- **THEN** the listing is the same

### Requirement: Sold search results show which lots need registering
On an eBay search page filtered to sold items, for the product being worked on, the extension SHALL colour each result grey when the lot is ignored for that product, pink when it is not stored, yellow when its sold date (the start of that day in the browser's time zone) is later than the time it was last registered, and green otherwise, so a lot that sold later on the day it was registered stays green. A result SHALL be coloured only when at most 10 results up to and including it are not grey.

#### Scenario: Lot is ignored
- **WHEN** a result's lot is ignored for the product
- **THEN** the result is grey

#### Scenario: Lot is not stored
- **WHEN** a result's lot is not stored and not ignored
- **THEN** the result is pink

#### Scenario: Lot sold after it was registered
- **WHEN** a result shows "Sold Oct 21, 2026" and the lot was last registered on 2026-10-20 at 15:00 in the browser's time zone
- **THEN** the result is yellow

#### Scenario: Lot registered on the day it sold
- **WHEN** a result shows "Sold Oct 20, 2026" and the lot was last registered on 2026-10-20 at 15:00 in the browser's time zone
- **THEN** the result is green

#### Scenario: More than ten results need attention
- **WHEN** the page has 12 results that are not ignored
- **THEN** only the first 10 of them are coloured

### Requirement: Lots needing registration open in batches
The search page SHALL offer a button that opens, in new tabs, the next 5 coloured results that are yellow or pink, each with the product being worked on, and SHALL close the search page when no coloured result is yellow or pink.

#### Scenario: Several lots need registration
- **WHEN** 7 coloured results are yellow or pink and the operator presses the button
- **THEN** the first 5 of them are the lots to open

#### Scenario: Nothing needs registration
- **WHEN** every coloured result is green and the operator presses the button
- **THEN** there is no lot to open

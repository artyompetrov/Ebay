# Spec Delta

## REMOVED Requirements

### Requirement: Notification contents
**Reason**: The body no longer lists matched lines separately or marks ambiguous lines; the requirement is replaced under a new name because its "Ambiguous line is marked" scenario no longer holds.
**Migration**: See "Notification consists of a link, one table and the contact"; the subject format is unchanged.

### Requirement: Notification lists notified products with their estimated prices
**Reason**: The separate table of notified products below the list of lines is replaced by one table that pairs each notified line with every product it matched.
**Migration**: See "Notification table has one group of rows per notified line", "Notification table lists every product a notified line matched", "Notification table rows show the estimated price and units sold" and "Notification text is HTML-encoded".

## ADDED Requirements

### Requirement: Notification consists of a link, one table and the contact
A notification SHALL be sent per advertisement that produced at least one newly recorded interesting product. Its subject SHALL be the advertisement title followed by the seller display name in square brackets. Its body SHALL contain a link to the advertisement, then a single table of the notified lines and their products, then the seller contact when one was resolved, and nothing else.

#### Scenario: All matching lines appear in the notification
- **WHEN** two lines of one advertisement match the same newly recorded interesting product
- **THEN** the notification table contains both lines

#### Scenario: Subject uses the seller display name
- **WHEN** an advertisement titled "Радиолампы" from a seller with key "968d583acd6460911adbe0e9f5e97edb" and display name "Евгений Смирнов" is notified
- **THEN** the notification subject is "Радиолампы [Евгений Смирнов]"

#### Scenario: A line matching several products has no text marker
- **WHEN** a notified line matched two tracked products
- **THEN** the notification body does not contain "Нашлось несколько товаров"

### Requirement: Notification table has one group of rows per notified line
The notification table SHALL have the columns "Строка объявления", "Товар", "Оценка" and "Продано шт.". It SHALL contain one group of rows per distinct advertisement line that matched at least one newly recorded interesting product, in advertisement order, with one row per product of the group. The line SHALL be shown once, in a cell spanning all rows of its group. Other lines SHALL NOT be shown.

#### Scenario: A line matching two products spans two rows
- **WHEN** a notified line "Лампа 6Н2П новая" matched two tracked products
- **THEN** the table has a cell with "Лампа 6Н2П новая" spanning two rows, followed by one row per product

#### Scenario: A line that triggered nothing is not shown
- **WHEN** an advertisement has a line matching a newly recorded interesting product and another line matching only a product already recorded for the seller
- **THEN** the table contains the first line and does not contain the second one

#### Scenario: Identical lines are shown once
- **WHEN** an advertisement has the same line twice, and it matches a newly recorded interesting product
- **THEN** the table has exactly one group for that line

### Requirement: Notification table lists every product a notified line matched
The group of a notified line SHALL list every tracked product the line matched, including products already recorded for the seller and non-interesting products. Products that are newly recorded and interesting SHALL be shown in bold, the others SHALL NOT. A product matched by several notified lines SHALL be listed in the group of each of them.

#### Scenario: Triggering product is bold, the other matched product is not
- **WHEN** a notified line matches a newly recorded interesting product "6Н2П" and a product "6Н2П-ЕВ" already recorded for the seller
- **THEN** the line's group lists both products, "6Н2П" in bold and "6Н2П-ЕВ" not in bold

#### Scenario: Non-interesting product matched by a notified line is listed
- **WHEN** a notified line matches a newly recorded interesting product and a non-interesting product
- **THEN** the line's group lists both products, and only the interesting one is in bold

#### Scenario: A product matched by two lines is listed for each line
- **WHEN** two different lines of one advertisement match the same newly recorded interesting product
- **THEN** the table has two groups, and each of them lists that product

### Requirement: Notification table rows show the estimated price and units sold
Each product row SHALL show the product name, the estimated price and the number of units sold that the estimate is based on.

#### Scenario: Table row shows the product's estimated price in roubles
- **WHEN** an advertisement notifies product "6Н2П" whose average revenue is 15.4 USD per unit over 7 sold units, and the stored RUB rate is 80 per USD
- **THEN** the notification table has a row with "6Н2П", "1232 RUB" and "7"

### Requirement: Notification text is HTML-encoded
Advertisement lines, product names, the seller contact and the advertisement link SHALL be HTML-encoded in the notification body, so text from an advertisement or a product cannot change the email markup.

#### Scenario: Product name is HTML-encoded
- **WHEN** a notified product is named "<i>6Н2П</i>"
- **THEN** the notification body contains "&lt;i&gt;6Н2П&lt;/i&gt;" and not the raw tag

#### Scenario: Advertisement line is HTML-encoded
- **WHEN** a notified advertisement line is "6Н2П <10 шт> & 6Н1П"
- **THEN** the notification body contains "6Н2П &lt;10 шт&gt; &amp; 6Н1П" and not the raw line

### Requirement: Notification table has bounded column widths
The notification table SHALL use a fixed layout with an explicit width for every column, so its width does not depend on the text. Line and product cells SHALL wrap long words. Price and units-sold cells SHALL NOT wrap.

#### Scenario: Long unbroken line does not widen the table
- **WHEN** a notified advertisement line is 300 characters without spaces
- **THEN** the table uses a fixed layout, every column has an explicit width, and the line's cell allows breaking long words

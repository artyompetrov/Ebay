# search-site-highlighting Specification

## Purpose
Shows the operator which known products are mentioned on third-party sites (in Supplier mode) by highlighting the text that mentions them and showing their prices on hover, while keeping the host site as responsive as it is without the extension.

## Requirements

### Requirement: Text mentioning a known product is highlighted
In Supplier mode on a site other than eBay, our backend or localhost, the extension SHALL highlight every element whose own text matches the pattern of at least one known product. The colour SHALL be green if any matched product is interesting, otherwise yellow if any matched product is checked (no check required), otherwise grey.

#### Scenario: Text mentions an interesting product
- **WHEN** an element's text matches an interesting product and a checked product
- **THEN** the element gets the green highlight

#### Scenario: Text mentions only a checked product
- **WHEN** an element's text matches only a product that does not require a check and is not interesting
- **THEN** the element gets the yellow highlight

#### Scenario: Text mentions only a product that requires a check
- **WHEN** an element's text matches only a product that requires a check and is not interesting
- **THEN** the element gets the grey highlight

#### Scenario: Text mentions no known product
- **WHEN** an element's text matches no product pattern
- **THEN** the element gets no highlight

### Requirement: Highlighting does not change text layout
The highlight SHALL change only the background colour of the highlighted element; it SHALL NOT change font, size, weight or spacing.

#### Scenario: Highlighted element keeps its font
- **WHEN** an element is highlighted
- **THEN** the only style the highlight applies to it is a background colour

### Requirement: Only page text is matched
The extension SHALL NOT match text inside scripts, styles, `noscript`, editable fields (`textarea`, `input`, content-editable elements) or the extension's own tooltip, and SHALL NOT match whitespace-only text.

#### Scenario: Product name inside a script
- **WHEN** a product name appears only inside a `script` or `style` element
- **THEN** no element is highlighted and no product pattern is run on that text

#### Scenario: Product name typed into a text area
- **WHEN** a product name appears inside a `textarea`
- **THEN** the text area is not highlighted

### Requirement: Highlighting work runs only while the browser is idle
The extension SHALL do its matching only in the idle periods the browser grants, SHALL stop matching once the current idle period has no time left, and SHALL continue where it stopped in the next idle period, so that the page ends up fully highlighted.

#### Scenario: Idle period ends in the middle of the page
- **WHEN** the idle period runs out of time after only part of the page's text has been matched
- **THEN** no further product pattern is run until the next idle period, and the remaining text is matched in later idle periods until the whole page is highlighted

#### Scenario: Idle period ends in the middle of one text
- **WHEN** the idle period runs out of time while a single text is being checked against the product patterns
- **THEN** checking stops before the next pattern, and the next idle period continues with the remaining patterns for that text instead of starting it over

#### Scenario: No idle period is granted
- **WHEN** the browser grants no idle period
- **THEN** no product pattern is run

### Requirement: Only changed content is processed again
After the page has been fully processed, the extension SHALL process only content that was added or whose text changed, SHALL update highlights so they follow the current text, and SHALL request no work while the page does not change.

#### Scenario: Page does not change after the first pass
- **WHEN** the page has been fully highlighted and its content does not change
- **THEN** the extension requests no further idle periods and runs no product pattern

#### Scenario: Content is added to the page
- **WHEN** an element whose text mentions a known product is added to an already highlighted page
- **THEN** that element is highlighted, and text that was already processed is not matched again

#### Scenario: Text stops mentioning a product
- **WHEN** the text of a highlighted element changes so that it no longer matches any product
- **THEN** the element's highlight is removed

#### Scenario: Same text appears again
- **WHEN** a text identical to one already matched appears in another element
- **THEN** that element gets the same highlight without running any product pattern

### Requirement: Hovering a highlight shows the matched products
When the cursor enters a highlighted element, the extension SHALL show one tooltip listing the products matched by that element, sorted by average price from highest to lowest, each with its name linking to the product in our app. The tooltip SHALL close when the cursor moves more than 300 px from its centre or when its close button is clicked.

#### Scenario: Element mentions two products
- **WHEN** the cursor enters an element that matched products A (average price 100) and B (average price 300)
- **THEN** a tooltip lists B before A, with links to their pages in our app

#### Scenario: Cursor moves away
- **WHEN** the tooltip is open and the cursor moves more than 300 px from its centre
- **THEN** the tooltip closes

### Requirement: Hovering does not accumulate work
Hovering highlights SHALL NOT add event handlers or tooltip elements to the page: the number of handlers the extension registers and of tooltip elements in the page SHALL stay the same however many highlights are hovered, and the extension SHALL track mouse movement only while the tooltip is open.

#### Scenario: Many highlights are hovered
- **WHEN** the cursor enters 50 highlighted elements one after another
- **THEN** the page contains at most one tooltip and the extension has as many event handlers registered as after the first hover

#### Scenario: Tooltip is closed
- **WHEN** the tooltip is closed
- **THEN** the extension has no mouse movement handler registered

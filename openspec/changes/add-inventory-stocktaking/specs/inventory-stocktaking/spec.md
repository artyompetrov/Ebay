## ADDED Requirements

### Requirement: Inventory tab with QR-driven scanning
The system SHALL provide a dedicated "Инвентаризация" (Inventory) tab in the Blazor client, reachable from the main navigation, that lets staff scan a measurement's QR code using the existing QR scanner mechanism (the same `html5-qrcode`/`Interop.StartQrScanner()` interop already used elsewhere in the client) to identify the measurement being inventoried.

#### Scenario: Inventory tab is reachable from navigation
- **WHEN** staff opens the main navigation menu
- **THEN** an "Инвентаризация" entry is present and navigates to the Inventory page

#### Scenario: Scanning starts the same QR scanner used elsewhere
- **WHEN** staff activates the scan control on the Inventory page
- **THEN** the page opens the existing QR scanner (no separate/new scanning mechanism) and decodes a measurement id from the scanned code the same way the existing pages do

### Requirement: Inventory date stamped on successful scan
When a measurement is identified by a successful scan on the Inventory page, the system SHALL record the current time as that measurement's inventory date ("Дата инвентаризации").

#### Scenario: Scanning a known measurement stamps its inventory date
- **WHEN** staff scans a QR code that resolves to an existing measurement id on the Inventory page
- **THEN** the system sets that measurement's inventory date to the current server time and the page confirms the measurement was recorded as inventoried

#### Scenario: Scanning an unknown measurement does not stamp anything
- **WHEN** staff scans a QR code whose extracted id does not match any existing measurement
- **THEN** the system SHALL NOT change any measurement's inventory date, and the page SHALL show that the scanned measurement was not found

#### Scenario: Re-scanning an already-inventoried measurement updates the date again
- **WHEN** staff scans a QR code for a measurement that already has a previous inventory date
- **THEN** the system overwrites the inventory date with the current server time, replacing the previous value

### Requirement: Storage location review and update after a scan
After a successful scan on the Inventory page, the system SHALL show that measurement's current storage location and allow staff to update it, without requiring another scan.

#### Scenario: Current location is shown after a successful scan
- **WHEN** a scan on the Inventory page successfully identifies a measurement
- **THEN** the page displays that measurement's current storage location (which may be empty if none is set)

#### Scenario: Staff updates the storage location after a scan
- **WHEN** staff edits the displayed storage location for the scanned measurement and confirms the change
- **THEN** the system updates that measurement's storage location to the new value and the page reflects the saved value

#### Scenario: Staff leaves the storage location unchanged
- **WHEN** staff does not edit the storage location after a scan
- **THEN** the system SHALL NOT send or apply a location update for that measurement

### Requirement: Record-inventory-scan API endpoint
The system SHALL expose an API endpoint that stamps a measurement's inventory date to the current server time and returns that measurement's id and current storage location.

#### Scenario: Recording a scan for an existing measurement
- **WHEN** a client requests `POST /measurements/{measurementId}/inventory` for a measurement id that exists
- **THEN** the system sets that measurement's inventory date to the current server time and responds with the measurement id and its current storage location

#### Scenario: Recording a scan for a missing measurement
- **WHEN** a client requests `POST /measurements/{measurementId}/inventory` for a measurement id that does not exist
- **THEN** the system SHALL respond with 404 Not Found and SHALL NOT stamp any inventory date

### Requirement: Update-measurement-location API endpoint on the current contract
The system SHALL expose a current-contract API endpoint that updates a measurement's storage location, reusing the existing storage-location update behavior (including clearing the location when given a blank value).

#### Scenario: Updating the location for an existing measurement
- **WHEN** a client requests the location-update endpoint for a measurement id that exists with a non-blank location value
- **THEN** the system SHALL set that measurement's storage location to the trimmed value

#### Scenario: Clearing the location with a blank value
- **WHEN** a client requests the location-update endpoint for a measurement id that exists with a blank/whitespace-only location value
- **THEN** the system SHALL clear that measurement's storage location (set it to no value)

#### Scenario: Updating the location for a missing measurement
- **WHEN** a client requests the location-update endpoint for a measurement id that does not exist
- **THEN** the system SHALL respond with 404 Not Found

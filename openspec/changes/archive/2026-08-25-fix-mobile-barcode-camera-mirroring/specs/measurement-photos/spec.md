## MODIFIED Requirements

### Requirement: Phone-based photo upload
Staff SHALL be able to identify a measurement by scanning its barcode with a phone camera and upload one or more photos for that measurement directly from the phone's camera roll or camera. The page SHALL automatically classify the current browser client as mobile or non-mobile without asking the user. For a client classified as mobile, the environment-facing barcode camera preview SHALL be displayed in its natural, non-mirrored orientation; for a client classified as non-mobile, the scanner preview SHALL retain its existing horizontally mirrored presentation.

#### Scenario: Upload after scanning a barcode
- **WHEN** staff scans a measurement's barcode on the `/measurement-photos` page and then selects one or more photo files
- **THEN** each selected file is uploaded and associated with the scanned measurement id, and the page's photo list refreshes to include the new photos

#### Scenario: Upload blocked without a known measurement
- **WHEN** no measurement id has been established yet (no scan performed and no id supplied)
- **THEN** the upload control is disabled and no upload request is sent

#### Scenario: Rear-camera preview on a detected mobile client
- **WHEN** staff starts barcode scanning on a client that the browser identifies as mobile and the scanner requests the environment-facing camera
- **THEN** the page automatically displays the camera preview without horizontal mirroring and does not ask staff to choose a device type

#### Scenario: Scanner preview on a non-mobile client
- **WHEN** staff starts barcode scanning on a client that the browser identifies as non-mobile
- **THEN** the page automatically retains the existing horizontally mirrored scanner preview and does not ask staff to choose a device type

#### Scenario: Mobile detection compatibility fallback
- **WHEN** the browser does not expose its structured mobile-client indicator
- **THEN** the page determines mobile status using a browser-compatible client identification fallback and still starts the barcode scanner

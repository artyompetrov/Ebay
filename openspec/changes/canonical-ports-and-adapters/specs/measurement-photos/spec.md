# Spec Delta

## REMOVED Requirements

### Requirement: Bounded original photo size
**Reason**: The requirement bundled the upload-time bound with a one-time migration of previously stored photos. The migration has completed in production and its code is deleted, so that part no longer describes system behavior.
**Migration**: The upload-time behavior is preserved unchanged under "Bounded original photo size on upload". Tests mapped to the two upload scenarios are re-pointed to the new requirement name; the test mapped to "Previously stored photo exceeding the bound is migrated" is deleted together with the migration.

## ADDED Requirements

### Requirement: Bounded original photo size on upload
When a measurement photo is uploaded, the system SHALL cap the stored "original" content to a bounded maximum resolution and encoded quality, re-encoding it if the uploaded file exceeds that bound, instead of storing the uploaded bytes unmodified regardless of size.

#### Scenario: Uploading a photo above the bound
- **WHEN** staff uploads a photo whose resolution or file size exceeds the configured bound
- **THEN** the system stores a re-encoded version of the photo within the bound as the "original" content, rather than the unmodified uploaded bytes

#### Scenario: Uploading a photo within the bound
- **WHEN** staff uploads a photo whose resolution and file size are already within the configured bound
- **THEN** the system stores the photo without unnecessary re-encoding beyond what upload processing already does

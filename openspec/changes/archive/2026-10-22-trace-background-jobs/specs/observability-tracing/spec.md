# Spec Delta

## ADDED Requirements

### Requirement: Background job runs are traced
Each run of a background job, periodic or run once at startup, SHALL be recorded as its own trace: a root span named after the job, with no parent even when the job was started inside another span. Work done during the run SHALL be recorded inside that trace. A run that fails SHALL mark its span as an error; a run stopped by application shutdown SHALL NOT.

#### Scenario: Each periodic job run is a separate trace
- **WHEN** a periodic background job runs twice while spans are being collected
- **THEN** two root spans named after the job are recorded, each in its own trace

#### Scenario: Work inside a run belongs to the run's trace
- **WHEN** a background job run starts a span of its own while spans are being collected
- **THEN** that span is recorded in the run's trace with the run's span as its parent

#### Scenario: A startup job run is its own trace
- **WHEN** the DB cache cleanup job runs at startup while an unrelated span is active, with spans being collected
- **THEN** a root span named after the job is recorded in a new trace, not under the unrelated span

#### Scenario: A failing run marks its span as an error
- **WHEN** a background job run throws an exception while spans are being collected
- **THEN** the run's span has error status

#### Scenario: A run stopped by shutdown is not an error
- **WHEN** a background job run is cancelled because the application is stopping, while spans are being collected
- **THEN** the run's span does not have error status

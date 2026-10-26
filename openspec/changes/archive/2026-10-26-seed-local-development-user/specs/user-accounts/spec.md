## ADDED Requirements

### Requirement: Local development run gets a sign-in user
When the application starts in the `Development` environment with development user credentials (email and password) configured and the database has no users, it SHALL create one user with that email and password whose email is confirmed, so that the user can sign in. It SHALL NOT create the user when any user already exists, when the credentials are not configured, or when the environment is not `Development`; an existing user is never changed.

#### Scenario: Empty development database gets the configured user
- **WHEN** the application starts in the `Development` environment with development user credentials configured and the database has no users
- **THEN** a user with the configured email exists, its email is confirmed and the configured password is accepted for it

#### Scenario: Existing users prevent seeding
- **WHEN** the application starts in the `Development` environment with development user credentials configured and the database already has a user
- **THEN** no user with the configured email is created and the user count does not change

#### Scenario: Without configured credentials nothing is seeded
- **WHEN** the application starts in the `Development` environment without development user credentials and the database has no users
- **THEN** the database still has no users

#### Scenario: Outside Development nothing is seeded
- **WHEN** the application starts in the `Production` environment with development user credentials configured and the database has no users
- **THEN** the database still has no users

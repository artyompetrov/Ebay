# Proposal

## Why

The application has no self-service registration, so a fresh local database has no account and nobody can sign in to the frontend. Running the app locally to debug a page (by a developer or by a cloud agent that checks the UI with a headless browser) first needs a user created by hand in the database. Local runs need an account that exists without manual steps, and production must never get an account with a password known from the repository.

## What Changes

- On start, the application creates one sign-in user with configured credentials when all of these hold: it runs in the `Development` environment, the credentials are configured, and the database has no users yet.
- The credentials come from configuration (`DevelopmentUser__Email`, `DevelopmentUser__Password`) and are set only in `Server/Properties/launchSettings.json`; production configures neither them nor the `Development` environment.
- In any other environment the application ignores configured credentials and logs a warning instead of creating the user.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `user-accounts`: a local development run gets a seeded sign-in user.

## Impact

- `src/Ebay/Server.Adapters.Driven.EF.Identity` (new options and a startup seeding service).
- `src/Ebay/Server/Properties/launchSettings.json` (development credentials).
- Tests in `src/Ebay/Tests.Integration`.
- `src/Ebay/AGENTS.md` (how to sign in locally).

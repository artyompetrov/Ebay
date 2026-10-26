# Design

## Context

Accounts are created only by the owner (`user-accounts`: no self-service registration). A local run of `Server` uses the PostgreSQL from `launchSettings.json`; in a fresh cloud sandbox or after a local database reset that database has no users, so the frontend cannot be reached past the sign-in page.

## Goals / Non-Goals

**Goals:** a local run can be signed in to with known credentials and no manual step; production cannot get such an account.

**Non-Goals:** roles or permissions (the application has none); changing or resetting the password of an existing user; seeding any domain data.

## Decisions

1. **Three gates, all required:** `IHostEnvironment.IsDevelopment()`, both credentials configured, and an empty users table. "No users" alone is not enough: a fresh production deployment or a failed restore also starts with an empty users table, and the password is in the repository. Production never sets `ASPNETCORE_ENVIRONMENT` (`deploy/docker-compose.yaml`), so it runs as `Production`. The environment gate alone would also be weak (someone could set `Development` on a server by mistake), so the credentials are an explicit opt-in that only `launchSettings.json` provides. The empty-table gate keeps the seeding from adding an account with a known password next to real ones in a copied production database.
2. **Credentials in configuration, not code:** `DevelopmentUserOptions` (`DevelopmentUser:Email`, `DevelopmentUser:Password`), both optional; only `launchSettings.json` sets them. Configured credentials outside `Development` are a misconfiguration: the service logs a warning and does nothing, it does not stop the application.
3. **A hosted service runs the seeding** (`DevelopmentUserSeeder`, Identity adapter). `StartAsync` runs after the migrations in `Program` and before the server accepts requests; it creates a scope for the scoped `UserManager<ApplicationUser>` and creates the user with `EmailConfirmed = true`, since sign-in requires a confirmed account. Identity's password rules apply, so a weak configured password fails creation; that is logged as a warning and the application keeps running.

## Risks / Trade-offs

- [The password is public in the repository] → it only works on a `Development` run whose database had no users; production has neither the environment nor the credentials.
- [Integration tests run in `Development`] → they do not configure the credentials, so the shared test database gets no extra user; the seeding is tested against its own empty databases.

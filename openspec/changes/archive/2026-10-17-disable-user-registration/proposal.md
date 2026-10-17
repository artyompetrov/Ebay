# Proposal

## Why

Anyone on the internet can create an account and get full access to the API. The ASP.NET Core Identity UI registration pages are served unrestricted. `RequireConfirmedAccount = true` gives no protection: the project's `IEmailSender` is its own port, not `Microsoft.AspNetCore.Identity.UI.Services.IEmailSender`, so Identity UI falls back to its no-op sender and shows the confirmation link right on the `RegisterConfirmation` page. The Web API authorizes any signed-in user (`[Authorize]` without roles or policies). The whole flow (register → confirm → sign in) was reproduced on production in under a minute. The application has a single user and needs no self-service sign-up.

## What Changes

- **BREAKING** The Identity UI pages `Account/Register`, `Account/RegisterConfirmation`, `Account/ConfirmEmail` and `Account/ResendEmailConfirmation` are no longer served: any request to them, GET or POST, gets `404 Not Found`. No new accounts can be created through the application.
- The UI no longer offers any way to register:
  - the `Register` links are removed from the Blazor frontend menu and from the Identity UI layout partial;
  - the Identity UI `Login` page no longer links to registration or to resending the email confirmation.
- Signing in with an existing account works as before.

Out of scope: restricting which existing accounts may use the API (allowlist / authorization policy), removing existing accounts, and other findings of the security audit.

## Capabilities

### New Capabilities
- `user-accounts`: how user accounts come to exist and how users sign in to the application. This change adds the rule that there is no self-service registration and that sign-in for existing accounts keeps working.

### Modified Capabilities

## Impact

- `src/Ebay/Server.Adapters.Driven.EF.Identity`: Identity UI configuration that stops serving the registration-related pages.
- `src/Ebay/Server/Areas/Identity/Pages`: `Shared/_LoginPartial.cshtml` (link removed); a project-owned `Account/Login` page replaces the default one.
- `src/Ebay/Frontend/Shared/LoginDisplay.razor`: `Register` link removed.
- `src/Ebay/Tests.Integration`: new tests for the scenarios.
- No API contract, database or deployment changes. Existing accounts, including the one created when the issue was reproduced, are kept.

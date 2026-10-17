# Tasks

## 1. Registration pages are not served

- [x] 1.1 In `Server.Adapters.Driven.EF.Identity`, add the single list of disabled Identity UI pages (`/Account/Register`, `/Account/RegisterConfirmation`, `/Account/ConfirmEmail`, `/Account/ResendEmailConfirmation`) and an area page route-model convention in `AddEfIdentityAdapter` that clears their selectors (design D1); verify the solution builds with no warnings.
- [x] 1.2 Add an adapter extension that maps the same paths, for all HTTP methods, to a `404 Not Found` endpoint, and call it from `Server/Program.cs` before `MapFallbackToFile` (design D2); verify `GET /Identity/Account/Register` on a locally running host returns `404`, not the Blazor `index.html`. If it already returns `404` without the endpoints, drop them and record that in design.md.
- [x] 1.3 Add integration tests in `Tests.Integration` for scenarios "Registration page is not served", "Registration form submission creates no account" (no user with the posted email exists afterwards, checked through `UserManager`) and "Confirmation pages are not served" (`GET` and `POST` for each page), tagged `[OpenSpecScenario("user-accounts", "No self-service registration", ...)]`; verify they fail before 1.1–1.2 and pass after.

## 2. Sign-in page without registration links

- [x] 2.1 Scaffold `Server/Areas/Identity/Pages/Account/Login.cshtml` and `Login.cshtml.cs` for `ApplicationUser` from Identity UI 10.0.0 (design D3), adding the scaffolder's `_ViewImports.cshtml`/`_ViewStart.cshtml` only if the page does not render with the Identity layout without them; remove only the "Register as a new user" and "Resend email confirmation" links and apply the project C# style rules to the `.cs` file; verify the build passes and the page renders with the sign-in form.
- [x] 2.2 Remove the `Register` item from `Server/Areas/Identity/Pages/Shared/_LoginPartial.cshtml`; verify no `asp-page="/Account/Register"` remains under `Server/Areas`.
- [x] 2.3 Add integration tests for "Sign-in page has no registration links" (`200 OK`, no links to `Register` or `ResendEmailConfirmation`), "Valid credentials sign the user in" (user created through `UserManager`, antiforgery token taken from the rendered form, redirect to the return URL and an authentication cookie) and "Wrong password is rejected" (form shown again with an error, no authentication cookie), tagged `[OpenSpecScenario("user-accounts", ...)]`; verify they pass.

## 3. Frontend without registration link

- [x] 3.1 Remove the `Register` link from `Frontend/Shared/LoginDisplay.razor`; verify the frontend builds.
- [x] 3.2 Add a bUnit test in `Tests.Frontend` (`[TestOf(typeof(LoginDisplay))]`) for "Frontend menu has no registration link": for an anonymous user there is a "Log in" link and no "Register" link, tagged `[OpenSpecScenario("user-accounts", "UI offers no way to register", "Frontend menu has no registration link")]`; verify it passes.

## 4. Integration checks

- [x] 4.1 Run `./scripts/agent-check/agent-check.sh` from the repository root and verify it passes. (On Windows every step passes except the coverage checker's own tests, which fail with `spawnSync openspec ENOENT` because Node does not resolve `openspec.cmd`; the OpenSpec steps, including the coverage check, pass when run in a Linux container as in CI.)
- [x] 4.2 Start the app locally and sign in to the frontend through the Identity `Login` page as an existing user; verify the frontend shows the signed-in state and API calls succeed. (Verified at the HTTP level against the integration test host instead of a browser: the `Frontend` client's authorization-code flow redirects to the new `Login` page, signing in there returns to `/connect/authorize/callback`, which issues a code for `/authentication/login-callback`; the code is exchanged for an access token that the Web API accepts. The browser UI was not opened.)

## Workflow follow-up

- Sync the `user-accounts` spec and archive the change, then run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh` and fix any missing or stale mappings before merging.
- After deployment, verify that `POST https://<domain>/Identity/Account/Register` returns `404` and that signing in to the frontend and the Chrome extension still works.

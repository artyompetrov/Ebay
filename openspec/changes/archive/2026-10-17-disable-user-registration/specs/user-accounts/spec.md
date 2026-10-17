# Spec Delta

## Purpose

Defines how user accounts come to exist in the application and how users sign in, so that only accounts the owner already has can reach the application and its API.

## ADDED Requirements

### Requirement: No self-service registration
The application SHALL NOT let anyone create an account through its web endpoints. The account registration, registration confirmation, email confirmation and resend-confirmation pages (`/Identity/Account/Register`, `/Identity/Account/RegisterConfirmation`, `/Identity/Account/ConfirmEmail`, `/Identity/Account/ResendEmailConfirmation`) SHALL respond `404 Not Found` to every request, regardless of HTTP method or authentication.

#### Scenario: Registration page is not served
- **WHEN** an anonymous client sends `GET /Identity/Account/Register`
- **THEN** the response status is `404 Not Found`

#### Scenario: Registration form submission creates no account
- **WHEN** an anonymous client sends `POST /Identity/Account/Register` with a form containing a new email, a password and its confirmation
- **THEN** the response status is `404 Not Found` and no account with that email exists afterwards

#### Scenario: Confirmation pages are not served
- **WHEN** an anonymous client sends `GET` or `POST` to `/Identity/Account/RegisterConfirmation`, `/Identity/Account/ConfirmEmail` or `/Identity/Account/ResendEmailConfirmation`
- **THEN** every response status is `404 Not Found`

### Requirement: UI offers no way to register
No page of the application SHALL link to registration or to resending an email confirmation.

#### Scenario: Sign-in page has no registration links
- **WHEN** an anonymous user opens `GET /Identity/Account/Login`
- **THEN** the page is returned with `200 OK` and contains no link to `/Identity/Account/Register` or `/Identity/Account/ResendEmailConfirmation`

#### Scenario: Frontend menu has no registration link
- **WHEN** an anonymous user opens the frontend application
- **THEN** the sign-in area shows a "Log in" link and no "Register" link

### Requirement: Existing users can sign in
A user with an existing confirmed account SHALL be able to sign in through the sign-in page with their email and password; wrong credentials SHALL be rejected without signing in.

#### Scenario: Valid credentials sign the user in
- **WHEN** an existing user submits the sign-in form with their correct email and password
- **THEN** the response redirects to the requested return URL and sets the authentication cookie

#### Scenario: Wrong password is rejected
- **WHEN** an existing user submits the sign-in form with a wrong password
- **THEN** the sign-in page is shown again with an error and no authentication cookie is set

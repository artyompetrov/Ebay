# scraping-proxy Specification

## Purpose

Lets the sale advertisement sources that scrape third-party sites (qrz.ru, chipfind.ru, newaudioportal.com) send their HTTP traffic through an optional authenticated HTTP proxy, so the production server's own IP address is not exposed to those sites.

## Requirements

### Requirement: Scraping requests go through the configured proxy
When a proxy address is configured, every HTTP request made by a sale advertisement source that scrapes a third-party site (currently qrz.ru, chipfind.ru and newaudioportal.com) SHALL be sent through that HTTP proxy (HTTPS targets through a `CONNECT` tunnel). When a login and password are configured, the system SHALL authenticate to the proxy with them using Basic proxy authentication.

#### Scenario: qrz.ru request is tunnelled through the proxy with credentials
- **WHEN** the proxy address points to a stub proxy that answers the first `CONNECT` with `407` and a `Basic` challenge, login `user` and password `secret` are configured, and a qrz.ru collection runs
- **THEN** the stub proxy receives a `CONNECT www.qrz.ru:443` request carrying `Proxy-Authorization: Basic` with `user:secret`

#### Scenario: chipfind.ru request is tunnelled through the proxy with credentials
- **WHEN** the proxy address points to a stub proxy that answers the first `CONNECT` with `407` and a `Basic` challenge, login `user` and password `secret` are configured, and a chipfind.ru collection runs
- **THEN** the stub proxy receives a `CONNECT www.chipfind.ru:443` request carrying `Proxy-Authorization: Basic` with `user:secret`

#### Scenario: newaudioportal.com request is tunnelled through the proxy with credentials
- **WHEN** the proxy address points to a stub proxy that answers the first `CONNECT` with `407` and a `Basic` challenge, login `user` and password `secret` are configured, and a newaudioportal.com collection runs
- **THEN** the stub proxy receives a `CONNECT newaudioportal.com:443` request carrying `Proxy-Authorization: Basic` with `user:secret`

#### Scenario: Proxy without credentials
- **WHEN** the proxy address points to a stub proxy and no login or password is configured, and a qrz.ru collection runs
- **THEN** the stub proxy receives a `CONNECT www.qrz.ru:443` request without a `Proxy-Authorization` header

### Requirement: A proxy failure never falls back to a direct connection
When a proxy address is configured and the proxy is unreachable or refuses the request, the source's request SHALL fail and SHALL NOT be retried directly against the target site.

#### Scenario: Unreachable proxy fails the qrz.ru collection
- **WHEN** the proxy address points to a closed local port and a qrz.ru collection runs
- **THEN** the collection fails with an HTTP request error instead of returning advertisements fetched directly from qrz.ru

### Requirement: Without a configured proxy, scraping requests go directly
When the proxy address is empty or absent, every sale advertisement source that scrapes a third-party site SHALL connect to the target site directly, ignoring any system-wide proxy settings of the process.

#### Scenario: No proxy address configured
- **WHEN** the proxy address is empty and the qrz.ru, chipfind.ru and newaudioportal.com sources are registered
- **THEN** their HTTP clients are configured to use no proxy

### Requirement: Other outgoing HTTP traffic is not proxied
Only the sale advertisement sources that scrape third-party sites SHALL use the scraping proxy; every other outgoing HTTP client of the server SHALL keep its own connection settings.

#### Scenario: Unrelated HTTP client ignores the scraping proxy
- **WHEN** a proxy address is configured and the qrz.ru, chipfind.ru and newaudioportal.com sources are registered
- **THEN** an HTTP client of the application with another name is not configured with the scraping proxy

### Requirement: Invalid proxy settings fail startup
The server SHALL refuse to start when the proxy settings are invalid: an address that is not an absolute `http` URI with a host, an address containing user info, a login without a password or a password without a login, or a login/password without an address.

#### Scenario: Non-http proxy address
- **WHEN** the proxy address is `socks5://proxy.example:1080`
- **THEN** options validation fails for the address

#### Scenario: Relative proxy address
- **WHEN** the proxy address is `proxy.example:8080`
- **THEN** options validation fails for the address

#### Scenario: Credentials inside the proxy address
- **WHEN** the proxy address is `http://user:secret@proxy.example:8080`
- **THEN** options validation fails for the address

#### Scenario: Login without a password
- **WHEN** the proxy address is `http://proxy.example:8080`, the login is `user` and the password is empty
- **THEN** options validation fails for the credentials

#### Scenario: Credentials without an address
- **WHEN** the proxy address is empty, the login is `user` and the password is `secret`
- **THEN** options validation fails for the credentials

#### Scenario: Valid proxy settings
- **WHEN** the proxy address is `http://proxy.example:8080`, the login is `user` and the password is `secret`
- **THEN** options validation succeeds

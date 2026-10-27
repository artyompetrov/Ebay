# Spec Delta

## ADDED Requirements

### Requirement: A collection starts with a probe of the site's main page
When a proxy address is configured, a sale advertisement source that scrapes a third-party site SHALL, before requesting anything else in a collection, request its site's main page through the proxy: `https://www.qrz.ru/`, `https://www.chipfind.ru/` or `https://newaudioportal.com/`. The probe SHALL pass only when the response has a 2xx status and its whole body is received within the probe timeout (default 15 s).

#### Scenario: Passing probe is followed by the collection
- **WHEN** a proxy address is configured, the chipfind.ru main page answers `200` with a full body, and a chipfind.ru collection runs
- **THEN** the first request of the collection is `GET https://www.chipfind.ru/`, and the feed is requested after it

#### Scenario: Each source probes its own main page
- **WHEN** a proxy address is configured and a qrz.ru, a chipfind.ru and a newaudioportal.com collection run
- **THEN** their first requests are `GET https://www.qrz.ru/`, `GET https://www.chipfind.ru/` and `GET https://newaudioportal.com/` respectively

#### Scenario: Non-success status fails the probe
- **WHEN** the main page answers `403` (a Cloudflare challenge)
- **THEN** the probe fails

#### Scenario: Body that stops arriving fails the probe
- **WHEN** the main page answers `200` with headers and the first part of the body, then sends nothing more, and the probe timeout elapses
- **THEN** the probe fails with a timeout reason

#### Scenario: Unreachable site fails the probe
- **WHEN** the request for the main page fails with a connection error
- **THEN** the probe fails

### Requirement: A failed probe switches the proxy exit IP and probes again
When the probe fails and an IP change link is configured, the system SHALL request the link, wait the IP change delay (default 10 s), and probe again, until a probe passes or the maximum number of IP changes (default 20) has been requested. When a probe passes, the collection SHALL continue on the current exit IP. A failed IP change request SHALL count as one IP change and SHALL NOT stop the rotation.

#### Scenario: Passing first probe keeps the current exit IP
- **WHEN** an IP change link is configured and the first probe passes
- **THEN** the IP change link is not requested and the collection continues

#### Scenario: Probe passes after several IP changes
- **WHEN** an IP change link is configured, the maximum number of IP changes is 20, and the probe fails 3 times and then passes
- **THEN** the IP change link is requested exactly 3 times, each request is followed by the IP change delay before the next probe, and the collection continues

#### Scenario: Failed IP change request still counts as an attempt
- **WHEN** an IP change link is configured, the maximum number of IP changes is 2, the first IP change request answers `500` and every probe fails
- **THEN** the IP change link is requested exactly 2 times and the probe runs 3 times

#### Scenario: IP change link is requested directly with a browser User-Agent
- **WHEN** a proxy address and an IP change link are configured and the IP change link is requested
- **THEN** the request is a `GET` of the configured link carrying a browser `User-Agent`, sent by an HTTP client that is not configured with the scraping proxy

#### Scenario: Cancellation ends the rotation without an error result
- **WHEN** an IP change link is configured, the probe fails, and the collection is cancelled during the IP change delay
- **THEN** the collection ends as cancelled instead of returning an error result, and the IP change link is not requested again

### Requirement: A collection without a working exit IP ends with an error
When no probe passes after the allowed IP changes, or the probe fails and no IP change link is configured, the source's collection SHALL end with an error result naming the failed probe, SHALL NOT request anything else from the site, and SHALL NOT retry the request directly.

#### Scenario: Every IP change is used up
- **WHEN** an IP change link is configured, the maximum number of IP changes is 3, and every probe fails during a chipfind.ru collection
- **THEN** the IP change link is requested exactly 3 times, the probe runs 4 times, the collection returns an error result, and the feed is never requested

#### Scenario: Failed probe without an IP change link
- **WHEN** a proxy address is configured, no IP change link is configured, and the probe fails during a chipfind.ru collection
- **THEN** the probe runs once, the collection returns an error result, and the feed is never requested

### Requirement: Without a configured proxy, a collection does not probe
When the proxy address is empty or absent, a sale advertisement source SHALL start its collection without a probe and SHALL NOT request the IP change link.

#### Scenario: No proxy address, no probe
- **WHEN** the proxy address is empty and a chipfind.ru collection runs
- **THEN** the first request of the collection is the feed request

### Requirement: The IP change link is not exposed
The IP change link carries the provider's proxy key, so the system SHALL NOT write it to logs, traces, collection error results or the text form of the proxy settings.

#### Scenario: Settings text hides the IP change link
- **WHEN** the IP change link is `https://changeip.mobileproxy.space/?proxy_key=abc123&format=json` and the proxy settings are converted to text
- **THEN** the text does not contain `abc123`

#### Scenario: Rotation logs do not contain the proxy key
- **WHEN** the IP change link `https://changeip.mobileproxy.space/?proxy_key=abc123&format=json` is requested during a rotation
- **THEN** no log record written during the collection, and not the collection's error result, contains `abc123`

#### Scenario: Rotation traces do not contain the proxy key
- **WHEN** the IP change link `https://changeip.mobileproxy.space/?proxy_key=abc123&format=json` is requested during a rotation
- **THEN** no tag of any span started during the collection contains `abc123`

## MODIFIED Requirements

### Requirement: Scraping requests go through the configured proxy
When a proxy address is configured, every HTTP request that a sale advertisement source sends to the third-party site it scrapes (currently qrz.ru, chipfind.ru and newaudioportal.com), the main page probe included, SHALL be sent through that HTTP proxy (HTTPS targets through a `CONNECT` tunnel). The request to the proxy provider's IP change link is not a request to the scraped site and SHALL NOT use the proxy. When a login and password are configured, the system SHALL authenticate to the proxy with them using Basic proxy authentication.

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
- **WHEN** the proxy address points to a closed local port, no IP change link is configured, and a qrz.ru collection runs
- **THEN** the collection returns an error result instead of advertisements fetched directly from qrz.ru

### Requirement: Invalid proxy settings fail startup
The server SHALL refuse to start when the proxy settings are invalid: an address that is not an absolute `http` URI with a host, an address containing user info, a login without a password or a password without a login, a login/password or IP change link without an address, an IP change link that is not an absolute `http` or `https` URI, a maximum number of IP changes outside 1-100, a probe timeout that is not positive or over 5 min, or an IP change delay under 5 s (the provider rejects the same request repeated within 3-5 s) or over 10 min.

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

#### Scenario: IP change link without an address
- **WHEN** the proxy address is empty and the IP change link is `https://changeip.mobileproxy.space/?proxy_key=abc123`
- **THEN** options validation fails for the IP change link

#### Scenario: Relative IP change link
- **WHEN** the proxy address is `http://proxy.example:8080` and the IP change link is `changeip.mobileproxy.space/?proxy_key=abc123`
- **THEN** options validation fails for the IP change link

#### Scenario: Non-http IP change link
- **WHEN** the proxy address is `http://proxy.example:8080` and the IP change link is `ftp://changeip.mobileproxy.space/?proxy_key=abc123`
- **THEN** options validation fails for the IP change link

#### Scenario: Zero IP changes
- **WHEN** the proxy address is `http://proxy.example:8080` and the maximum number of IP changes is `0`
- **THEN** options validation fails for the maximum number of IP changes

#### Scenario: Too many IP changes
- **WHEN** the proxy address is `http://proxy.example:8080` and the maximum number of IP changes is `101`
- **THEN** options validation fails for the maximum number of IP changes

#### Scenario: Non-positive probe timeout
- **WHEN** the proxy address is `http://proxy.example:8080` and the probe timeout is `00:00:00`
- **THEN** options validation fails for the probe timeout

#### Scenario: Probe timeout too long
- **WHEN** the proxy address is `http://proxy.example:8080` and the probe timeout is `00:06:00`
- **THEN** options validation fails for the probe timeout

#### Scenario: IP change delay too long
- **WHEN** the proxy address is `http://proxy.example:8080` and the IP change delay is `00:11:00`
- **THEN** options validation fails for the IP change delay

#### Scenario: IP change delay below the provider's limit
- **WHEN** the proxy address is `http://proxy.example:8080` and the IP change delay is `00:00:04`
- **THEN** options validation fails for the IP change delay

#### Scenario: Valid proxy settings
- **WHEN** the proxy address is `http://proxy.example:8080`, the login is `user`, the password is `secret` and the IP change link is `https://changeip.mobileproxy.space/?proxy_key=abc123&format=json`
- **THEN** options validation succeeds

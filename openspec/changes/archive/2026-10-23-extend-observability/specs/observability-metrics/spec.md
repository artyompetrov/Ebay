# Spec Delta

## Purpose
Defines which backend metrics are recorded and exported, which data they must never contain, and how long they stay queryable for people and the coding agent.

## ADDED Requirements

### Requirement: Incoming request metrics are recorded
The backend SHALL record the duration of every incoming HTTP request as a histogram metric, labeled with the HTTP method, the matched route template and the response status code. The labels SHALL NOT contain URL query strings or header values.

#### Scenario: An API request is recorded in request metrics
- **WHEN** an authenticated client calls an API endpoint while metrics are being collected
- **THEN** the request duration metric has a measurement labeled with that endpoint's route template, the HTTP method and the response status code

#### Scenario: Request metrics contain no query strings
- **WHEN** a client calls an API endpoint with a query string containing a distinctive value while metrics are being collected
- **THEN** no label of any exported metric contains that value

### Requirement: Library and application meters are exported
The backend SHALL export the metrics of the outgoing HTTP client, the database client, the message bus, the email client and the .NET runtime, and of every one of its own meters, which are named with the `Server.` prefix.

#### Scenario: Measurements of every exported meter are recorded
- **WHEN** a measurement is recorded on a meter of each of the outgoing HTTP client, the database client, the message bus, the email client, the .NET runtime and an application `Server.` meter, while metrics are being collected
- **THEN** each of those measurements is exported

#### Scenario: Runtime metrics are exported without application activity
- **WHEN** metrics are collected from the running backend
- **THEN** the exported metrics include .NET runtime metrics such as garbage collection counts

### Requirement: Metrics are queryable for thirty days
Recorded metrics SHALL be stored and queryable through the Grafana instance for 30 days after they are recorded, including by the read-only account used by the agent's Grafana MCP server. Metrics older than 30 days SHALL be deleted.

#### Scenario: Agent queries a recent metric
- **WHEN** the agent queries the backend's request duration metric through the Grafana MCP server within 30 days after requests were made in production
- **THEN** the query returns the measurements of those requests
- **NOT COVERED BY TEST:** depends on the deployed Prometheus, collector and Grafana containers and the production MCP account, which the test suites do not start; verified manually after deployment

#### Scenario: Old metrics are removed
- **WHEN** a measurement is older than 30 days
- **THEN** it is no longer returned by metric queries
- **NOT COVERED BY TEST:** retention is enforced by the Prometheus storage configuration in deployment, which the test suites do not run, and waiting 30 days is not feasible in a test

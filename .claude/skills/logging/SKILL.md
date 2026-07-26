---
name: logging
description: Project logging rules. Use when adding, changing, or reviewing log messages, log levels, structured logging decisions, retry or shutdown logs, exception logging, and checks for sensitive data in logs.
---

# Logging

## Baseline

Write all log messages in English and in one consistent record format. The product default logging level is `INFO`.

Never log sensitive data: passwords, tokens, credentials, or similar secrets.

Make error messages clear enough for developers, QA engineers, and technical support.

The events below are the required minimum. Add other logs when they are useful, at the appropriate level.

Do not log `OperationCanceledException` as `WARN` or `ERROR` when it represents normal shutdown. At the place where cancellation is intentionally handled, log the shutdown fact and reason at `INFO`.

## Levels

Each level includes all events from more severe levels.

- `FATAL`: the service cannot start, stop, or serve business tasks.
- `ERROR`: a business operation failed but the application keeps running; the failure is reproducible on the same input or retries are exhausted; fixing requires restart, reconfiguration, or update.
- `WARN`: recoverable condition caused by user configuration or external environment; includes temporary failures that will be retried, such as network or database unavailability before retries are exhausted.
- `INFO`: service start/stop, domain commands and events, state machine transitions, start and end of dataflow stages.
- `DEBUG`: inputs and outputs of large computations, all incoming adapter requests without bodies, interservice calls such as HTTP method, URL, status code, MQ topic, and message type. For large collections, log processing statistics instead of full content.
- `TRACE`: maximum detail and volume: full request and response parameters, and per-item details for large collection processing.

## Level Decision Tree

Choose the level by asking who the record is for.

For developers diagnosing internals:

- use `TRACE` when full parameters, headers, body, or high-volume per-item detail are needed;
- use `DEBUG` when inputs, outputs, and statistics are enough.

For operators and developers observing business process or state:

- use `INFO` when the record is not tied to an undesirable state;
- use `WARN` when the condition is undesirable but recoverable through configuration, environment changes, or retry;
- use `ERROR` when retries are exhausted or the same data reproduces the failure while the application keeps running;
- use `FATAL` when the application cannot continue.

---
# Do not edit manually - this file is mirrored.
name: web-api
description: Carbon project Web API rules. Use when designing, implementing, changing, or reviewing REST endpoints, OpenAPI/Swagger annotations, request or response DTOs, manual web-adapter validation, status codes, pagination, endpoint naming, and external error responses.
---

# Web API

## Contract

REST API contracts are described through Swagger/OpenAPI.

Keep OpenAPI annotations current with code: endpoints, parameters, response codes, and error models must be documented, and the schema must match behavior.

Keep the contract platform-independent. JSON must not expose framework artifacts such as type discriminators or CLR class names.

## Validation

NSwag generates DataAnnotations from schema constraints such as `required`, `minLength`, `maxLength`, `pattern`, `minimum`, `maximum`, `minItems`, and `maxItems`. `[ApiController]` validates them during model binding and returns `400` automatically. Do not duplicate this validation manually.

Manual validation in the web adapter is only for constraints the generator cannot express:

- `minProperties` and `maxProperties`, because DataAnnotations has no equivalent;
- invalid query/body parameter combinations;
- constraints that cannot be represented in the OpenAPI schema.

If a constraint is visible as an attribute on the generated DTO, it already works. If it is not visible there, the web adapter owns it and it deserves tests.

## Resources And Methods

Name resources as plural nouns, for example `/incidents` and `/tasks`. Use nesting only for genuinely related resources.

Express actions with HTTP methods instead of verbs in URLs:

- `GET` for reading;
- `POST` for creation;
- `PUT` for update;
- `DELETE` for deletion.

Use explicit command endpoints only for operations that do not fit CRUD. Keep RPC-style commands as exceptions.

Preserve idempotency: `GET`, `PUT`, and `DELETE` are idempotent; `POST` is not. Use this when choosing between `POST` creation and `PUT` update.

Use `snake_case` for method naming.

Good examples:

```text
GET    /api/incidents/v1/incidents
GET    /api/incidents/v1/incidents/{id}
POST   /api/incidents/v1/incidents
PUT    /api/incidents/v1/incidents/{id}
DELETE /api/incidents/v1/incidents/{id}
GET    /api/incidents/v1/incidents/{id}/tasks
```

Bad examples:

```text
GET  /api/incidents/v1/get_incidents
POST /api/incidents/v1/incidents/{id}/delete
```

Command example:

```text
POST /api/incidents/v1/scanner_agents/{id}/restart
```

## Responses

Use correct status codes: `2xx` for success, `4xx` for client errors, and `5xx` for server errors. Do not return `200` with an error body.

Return lists with pagination and total count. Enforce a maximum page size.

Represent date/time as UTC ISO 8601. Use camelCase JSON fields. Omit empty optional fields.

## Errors

Return errors in one consistent format with a machine-readable type or code and a human-readable message.

Use English messages. Do not expose sensitive data such as credentials, internal addresses, or stack traces to external consumers.

Do not blindly pass through status codes from downstream calls. Translate them into responses that make sense for this API's clients.

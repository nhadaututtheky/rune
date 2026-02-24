---
name: "@rune/backend"
description: Backend patterns — API design, authentication, database patterns, and middleware architecture.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$12"
  target: Backend developers
---

# @rune/backend

## Skills Included

### api-patterns
RESTful and GraphQL API design patterns — resource naming, pagination, filtering, error responses, versioning, rate limiting.

### auth-patterns
Authentication and authorization patterns — JWT, OAuth 2.0, session management, RBAC, API key management, MFA flows.

### database-patterns
Database design and query patterns — schema design, migrations, indexing strategies, N+1 prevention, connection pooling, read replicas.

### middleware-patterns
Middleware architecture — request validation, error handling, logging, CORS, compression, caching headers, request ID tracking.

## Connections

```
Calls → docs-seeker (L3): lookup API documentation
Called By ← cook (L1): when backend task detected
Called By ← review (L2): when API code is being reviewed
```

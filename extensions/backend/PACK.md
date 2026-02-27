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

## Purpose

Backend codebases accumulate structural debt in four areas: inconsistent API contracts (mixed naming, missing pagination, vague errors), insecure auth flows (token mismanagement, missing refresh rotation, weak RBAC), database anti-patterns (N+1 queries, missing indexes, unsafe migrations), and ad-hoc middleware (duplicated validation, no request tracing, inconsistent error format). This pack addresses each systematically — detect the anti-pattern, emit the fix, verify the result. Each skill is independent but they compound: clean APIs need solid auth, solid auth needs safe queries, safe queries need proper middleware.

## Triggers

- Auto-trigger: when `routes/`, `controllers/`, `middleware/`, `*.resolver.ts`, `*.service.ts`, or server framework config detected
- `/rune api-patterns` — audit and fix API design
- `/rune auth-patterns` — audit and fix authentication flows
- `/rune database-patterns` — audit and fix database queries and schema
- `/rune middleware-patterns` — audit and fix middleware stack
- Called by `cook` (L1) when backend task is detected
- Called by `review` (L2) when API/backend code is under review

## Skills Included

### api-patterns

RESTful and GraphQL API design patterns — resource naming, pagination, filtering, error responses, versioning, rate limiting.

#### Workflow

**Step 1 — Detect API surface**
Use Grep to find route definitions (`app.get`, `app.post`, `router.`, `@Get()`, `@Post()`, `@Query`, `@Mutation`). Read each route file to inventory: endpoint paths, HTTP methods, response shapes, error handling approach.

**Step 2 — Audit naming and structure**
Check each endpoint against REST conventions: plural nouns for collections (`/users` not `/getUsers`), nested resources for relationships (`/users/:id/posts`), query params for filtering (`?status=active`), consistent error envelope. Flag violations with specific fix for each.

**Step 3 — Add missing pagination and filtering**
For list endpoints returning unbounded arrays, emit cursor-based or offset pagination. For endpoints with no filtering, add query param parsing with Zod/Joi validation. Emit the middleware or decorator that enforces the pattern.

#### Example

```typescript
// BEFORE: inconsistent naming, no pagination, bare error
app.get('/getUsers', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

// AFTER: REST naming, cursor pagination, error envelope
app.get('/users', validate(paginationSchema), async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const users = await userRepo.findMany({ cursor, limit: limit + 1 });
  const hasNext = users.length > limit;
  res.json({
    data: users.slice(0, limit),
    pagination: {
      next_cursor: hasNext ? users[limit - 1].id : null,
      has_more: hasNext,
    },
  });
});
```

---

### auth-patterns

Authentication and authorization patterns — JWT, OAuth 2.0, session management, RBAC, API key management, MFA flows.

#### Workflow

**Step 1 — Detect auth implementation**
Use Grep to find auth-related code: `jwt.sign`, `jwt.verify`, `bcrypt`, `passport`, `next-auth`, `lucia`, `cookie`, `session`, `Bearer`, `x-api-key`. Read auth middleware and login/register handlers to understand the current approach.

**Step 2 — Audit security posture**
Check for: tokens stored in localStorage (XSS risk → use httpOnly cookies), missing refresh token rotation, JWT without expiry, password hashing without salt rounds check, missing CSRF protection on cookie-based auth, hardcoded secrets. Flag each with severity and specific fix.

**Step 3 — Emit secure auth flow**
Based on detected framework (Express, Fastify, Next.js, etc.), emit the corrected auth flow: access token (short-lived, 15min) + refresh token (httpOnly cookie, 7d, rotation on use), proper password hashing (bcrypt rounds ≥ 12), RBAC middleware with role hierarchy.

#### Example

```typescript
// BEFORE: JWT in localStorage, no refresh, no expiry
const token = jwt.sign({ userId: user.id }, SECRET);
res.json({ token });
// Client: localStorage.setItem('token', token);

// AFTER: short-lived access + httpOnly refresh cookie
const accessToken = jwt.sign(
  { sub: user.id, role: user.role },
  ACCESS_SECRET,
  { expiresIn: '15m' }
);
const refreshToken = jwt.sign(
  { sub: user.id, jti: crypto.randomUUID() },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);
await tokenStore.save(refreshToken, user.id); // for rotation tracking

res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
res.json({ access_token: accessToken, expires_in: 900 });
```

---

### database-patterns

Database design and query patterns — schema design, migrations, indexing strategies, N+1 prevention, connection pooling, read replicas.

#### Workflow

**Step 1 — Detect ORM and query patterns**
Use Grep to find ORM usage (`prisma.`, `knex(`, `sequelize.`, `typeorm`, `drizzle`, `mongoose.`, `db.query`) and raw SQL strings. Read schema files (`schema.prisma`, `migrations/`, `models/`) to understand the data model.

**Step 2 — Detect N+1 and missing indexes**
Scan for loops containing database calls (a query inside `for`, `map`, `forEach` → N+1). Check foreign key columns for missing indexes. Identify queries with `WHERE` clauses on unindexed columns. Flag each with the specific query and fix.

**Step 3 — Emit optimized queries**
For N+1: emit eager loading (`include`, `populate`, `JOIN`). For missing indexes: emit migration files. For unsafe raw SQL: emit parameterized version. For connection pooling: check pool config and recommend sizing based on max connections.

#### Example

```typescript
// BEFORE: N+1 — one query per post to get author
const posts = await prisma.post.findMany();
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// AFTER: eager loading, single query with JOIN
const posts = await prisma.post.findMany({
  include: { author: { select: { id: true, name: true, avatar: true } } },
});

// Migration: add missing index
-- CreateIndex
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

---

### middleware-patterns

Middleware architecture — request validation, error handling, logging, CORS, compression, caching headers, request ID tracking.

#### Workflow

**Step 1 — Audit middleware stack**
Read the main server file (app.ts, server.ts, index.ts) to inventory all middleware in registration order. Check for: missing request ID generation, missing structured logging, inconsistent error responses, missing input validation, CORS misconfiguration (`*` in production).

**Step 2 — Detect error handling gaps**
Use Grep to find `catch` blocks, error middleware signatures (`err, req, res, next`), and unhandled promise rejections. Check if errors return consistent format (same envelope for 400, 401, 403, 404, 500). Flag any that leak stack traces or internal details in production.

**Step 3 — Emit middleware improvements**
For each gap, emit the middleware function: request ID (`X-Request-Id` header, UUID per request), structured JSON logger (request method, path, status, duration, request ID), global error handler with consistent envelope, Zod-based request validation middleware.

#### Example

```typescript
// Request ID middleware
const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

// Structured error handler — consistent envelope, no stack leak
const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  logger.error({ err, requestId: req.id, path: req.path });
  res.status(status).json({
    error: { code: err.code || 'INTERNAL_ERROR', message },
    request_id: req.id,
  });
};

// Zod validation middleware
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details: result.error.flatten() },
    });
  }
  Object.assign(req, result.data);
  next();
};
```

---

## Connections

```
Calls → docs-seeker (L3): lookup API documentation and framework guides
Calls → sentinel (L2): security audit on auth implementations
Called By ← cook (L1): when backend task detected
Called By ← review (L2): when API code is being reviewed
Called By ← audit (L2): backend health dimension
```

## Tech Stack Support

| Framework | ORM | Auth Library | Notes |
|-----------|-----|-------------|-------|
| Express 5 | Prisma | Passport / custom JWT | Most common Node.js stack |
| Fastify 5 | Drizzle | @fastify/jwt | Performance-focused |
| Next.js 16 (Route Handlers) | Prisma | NextAuth v5 / Lucia | Full-stack apps |
| NestJS 11 | TypeORM / Prisma | @nestjs/passport | Enterprise patterns |
| FastAPI | SQLAlchemy | python-jose / authlib | Python async |
| Django 5 | Django ORM | django-rest-framework | Python batteries-included |

## Constraints

1. MUST use parameterized queries for ALL database operations — never string interpolation in SQL.
2. MUST NOT store secrets (JWT secret, API keys, DB password) in source code — use environment variables validated at startup.
3. MUST emit migration files for all schema changes — no direct `ALTER TABLE` in application code.
4. MUST validate all request input at the boundary (middleware/decorator) — not inside business logic.
5. MUST return consistent error envelope format across all endpoints — `{ error: { code, message }, request_id }`.

## Sharp Edges

| Failure Mode | Severity | Mitigation |
|---|---|---|
| Auth pattern emits JWT without expiry or with excessively long TTL (>24h for access token) | CRITICAL | Hard-code max 15min access / 7d refresh in emitted code; flag any `expiresIn` > threshold |
| N+1 detection misses ORM lazy-loading (Sequelize, TypeORM default behavior) | HIGH | Check ORM config for `lazy: true` / default relation loading; audit `.then()` chains on relations |
| Migration emitted without rollback script (ALTER without DOWN migration) | HIGH | Every migration must include both `up()` and `down()` — flag any migration without both |
| CORS middleware set to `origin: '*'` passes review for non-production | MEDIUM | Check NODE_ENV / deployment target; flag wildcard CORS in production configs |
| Middleware order wrong (error handler before routes, validation after route handler) | MEDIUM | Emit middleware registration in correct order with comments explaining why |
| Rate limiting suggested but Redis/store not available in project | LOW | Check for existing Redis/memory store; suggest in-memory rate limiter as fallback |

## Done When

- API audit report emitted with naming violations, missing pagination, and fix diffs
- Auth flow hardened: short-lived access tokens, httpOnly refresh cookies, proper hashing
- N+1 queries detected and replaced with eager loading; missing indexes migrated
- Middleware stack has: request ID, structured logging, global error handler, input validation
- All emitted code uses project's existing framework and ORM (detected from package.json)
- Structured report emitted for each skill invoked

## Cost Profile

~8,000–16,000 tokens per full pack run (all 4 skills). Individual skill: ~2,000–4,000 tokens. Sonnet default. Use haiku for detection scans (Step 1 of each skill); escalate to sonnet for code generation and security audit.

---
name: "@rune/security"
description: Deep security analysis — OWASP audit, penetration testing patterns, secret management, and compliance checking.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$15"
  target: Security engineers
---

# @rune/security

## Purpose

@rune/security delivers manual-grade security analysis for teams that need more than an automated gate. Where `sentinel` (L2) runs fast checks on every commit, this pack runs thorough, on-demand audits: threat modeling entire auth flows, mapping real attack surfaces, designing vault strategies, and producing compliance audit trails. Grouped because all four skills share the same threat mindset — assume breach, prove safety, document evidence.

## Triggers

- `/rune security` — manual invocation, full pack audit
- `/rune owasp-audit` | `/rune pentest-patterns` | `/rune secret-mgmt` | `/rune compliance` — single skill invocation
- Called by `cook` (L1) when auth, crypto, payment, or PII-handling code is detected
- Called by `review` (L2) when security-critical patterns are flagged during code review

## Skills Included

### owasp-audit

Deep OWASP Top 10 audit — goes beyond sentinel's automated checks with manual code review of authentication flows, session management, access control logic, and cryptographic patterns. Produces exploitability-rated findings.

#### Workflow

**Step 1 — Threat Model**
Use Read to load entry points (routes, controllers, middleware). Map which OWASP categories apply to this codebase (A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A07 Auth Failures). Build a risk matrix before touching any code.

**Step 2 — Manual Code Review**
Use Grep to locate auth middleware, session setup, role checks, and crypto calls. Read each file. Manually verify: Are authorization checks applied consistently? Are sessions invalidated on logout? Are crypto primitives current (no MD5/SHA1 for passwords)?

**Step 3 — Verify Exploitability and Report**
For each finding, confirm it is reachable from an unauthenticated or low-privilege context. Rate severity (CRITICAL/HIGH/MEDIUM/LOW). Emit a structured report with file:line references and concrete remediation steps.

#### Example

```typescript
// FINDING: A01 — Missing authorization middleware on admin route
// File: src/routes/admin.ts, Line: 12

// VULNERABLE: route mounted without auth guard
router.get('/admin/users', getAllUsers)

// REMEDIATION: apply requireAuth + requireRole before handler
router.get('/admin/users', requireAuth, requireRole('admin'), getAllUsers)

// VERIFY: requireAuth must reject missing/invalid JWTs
// VERIFY: requireRole must check DB role, not client-supplied header
```

---

### pentest-patterns

Penetration testing methodology — attack surface mapping, vulnerability identification, proof-of-concept construction, and remediation verification. Outputs actionable PoC code, not just advisories.

#### Workflow

**Step 1 — Map Attack Surface**
Use Grep to enumerate all HTTP endpoints, WebSocket handlers, file upload paths, and external-facing inputs. List trust boundaries: what data crosses from client to server without validation? Identify highest-value targets (auth endpoints, admin APIs, payment flows).

**Step 2 — Identify and Construct PoC**
For each attack vector, use Read to inspect input handling. Write minimal PoC code (curl command, script, or payload) that demonstrates the vulnerability — SSRF via URL parameter, SQL injection via unsanitized filter, IDOR via predictable ID enumeration.

**Step 3 — Suggest Remediation and Verify Fix**
Pair each PoC with a concrete fix. After fix is applied, use Bash to re-run the PoC and confirm it no longer succeeds. Document the before/after in the security report.

#### Example

```typescript
// FINDING: SSRF — user-supplied URL fetched server-side without allowlist
// File: src/api/webhook.ts, Line: 34

// VULNERABLE: attacker can probe internal services
const response = await fetch(req.body.callbackUrl)

// POC: curl -X POST /api/webhook -d '{"callbackUrl":"http://169.254.169.254/latest/meta-data/"}'

// REMEDIATION: validate against allowlist before fetching
const ALLOWED_HOSTS = new Set(['api.partner.com', 'hooks.stripe.com'])
const parsed = new URL(req.body.callbackUrl)
if (!ALLOWED_HOSTS.has(parsed.hostname)) {
  throw new ForbiddenError('callbackUrl host not in allowlist')
}
```

---

### secret-mgmt

Secret management patterns — audit current secret handling, design vault or environment strategy, implement rotation policies, and verify zero leaks in logs, errors, and source history.

#### Workflow

**Step 1 — Scan Current Secret Handling**
Use Grep to search for hardcoded credentials, API keys, connection strings, and JWT secrets across all source files and config files. Check git history with Bash (`git log -S 'password' --source --all`) to surface secrets ever committed. Catalog every secret by type and location.

**Step 2 — Design Vault or Env Strategy**
Based on project type (serverless, container, bare metal), prescribe a secret backend: AWS Secrets Manager, HashiCorp Vault, Doppler, or `.env` + CI/CD injection. Define which secrets are per-environment vs per-service. Write the access pattern (IAM role, token scope, least privilege).

**Step 3 — Implement Rotation Policy and Verify No Leaks**
Add secret validation at startup (fail fast if required env var is missing). Document rotation schedule per secret type. Use Grep to confirm secrets never appear in log statements, error responses, or exception stack traces.

#### Example

```typescript
// PATTERN: startup validation — fail fast on missing secrets
import { z } from 'zod'

const SecretsSchema = z.object({
  DATABASE_URL:    z.string().url(),
  JWT_SECRET:      z.string().min(32),
  STRIPE_SECRET:   z.string().startsWith('sk_'),
  OPENAI_API_KEY:  z.string().startsWith('sk-'),
})

// throws ZodError at boot if any secret is absent or malformed
export const secrets = SecretsSchema.parse(process.env)

// NEVER log secrets — use masked representation in logs
logger.info(`DB connected to ${new URL(secrets.DATABASE_URL).hostname}`)
```

---

### compliance

Compliance checking — identify applicable standards (SOC 2, GDPR, HIPAA, PCI-DSS), map requirements to code patterns, perform gap analysis, and generate audit-ready evidence.

#### Workflow

**Step 1 — Identify Applicable Standards**
Read project README, data model, and infrastructure config to determine which standards apply: does the app handle health data (HIPAA), payment card data (PCI-DSS), EU personal data (GDPR), or serve enterprise customers (SOC 2)? Output a compliance scope document before analysis.

**Step 2 — Map Requirements to Code**
Use Grep to locate data retention logic, consent flows, access logging, encryption at rest/transit, and data deletion endpoints. Cross-reference each requirement against actual implementation. For each gap, record: requirement, current state, risk, and remediation effort.

**Step 3 — Generate Audit Trail**
Use Read to verify logging coverage on sensitive operations (login, data export, admin actions, PII access). Confirm logs are tamper-evident, include actor identity and timestamp, and are retained for required duration. Emit a structured compliance report suitable for auditor review.

#### Example

```typescript
// PATTERN: GDPR-compliant audit trail for PII access
interface AuditEvent {
  eventId:    string      // UUID, immutable
  actor:      string      // userId or serviceAccount
  action:     string      // 'READ_PII' | 'EXPORT_DATA' | 'DELETE_USER'
  resource:   string      // 'users/{id}'
  timestamp:  string      // ISO 8601 UTC
  ip:         string      // requestor IP for breach tracing
  outcome:    'SUCCESS' | 'DENIED'
}

// Log to append-only store — never DELETE or UPDATE audit rows
async function logAuditEvent(event: AuditEvent): Promise<void> {
  await db.auditLog.create({ data: event })
  // Also emit to SIEM (Splunk, Datadog, etc.) for real-time alerting
}
```

---

## Connections

```
Calls → scout (L2): scan codebase for security patterns before audit
Calls → verification (L3): run security tooling (Semgrep, Trivy, npm audit)
Called By ← review (L2): when security-critical code detected during review
Called By ← cook (L1): when auth/input/payment/PII code is in scope
```

## Constraints

1. MUST use opus model for auth, crypto, and payment code review — these domains require maximum reasoning depth.
2. MUST NOT rely solely on automated tool output — every finding requires manual confirmation of exploitability before reporting.
3. MUST produce actionable findings: each issue includes file:line reference, severity rating, and concrete remediation steps.
4. MUST differentiate scope from sentinel — @rune/security does deep on-demand analysis; sentinel does fast automated gates on every commit. Never duplicate sentinel's job.

## Sharp Edges

| Failure Mode | Severity | Mitigation |
|---|---|---|
| Reporting false positives as confirmed vulnerabilities | HIGH | Always verify exploitability manually before including in final report |
| Auditing only code, missing infra/config attack surface | HIGH | Include Dockerfile, CI/CD yaml, and nginx/CDN config in scope |
| Secret scan misses base64-encoded or env-injected secrets | HIGH | Scan both raw and decoded forms; check CI/CD variable lists |
| Compliance gap analysis based on outdated standard version | MEDIUM | Reference standard version explicitly (e.g., GDPR 2016/679, PCI-DSS v4.0) |
| OWASP audit skips indirect dependencies (transitive vulns) | MEDIUM | Run `npm audit --all` or `pip-audit` to surface transitive CVEs |
| Pentest PoC accidentally run against production | CRITICAL | Confirm target environment before executing any PoC — add env guard to scripts |

## Difference from sentinel

`sentinel` = lightweight automated gate (every commit, fast, cheap, blocks bad merges)
`@rune/security` = deep manual-grade audit (on-demand, thorough, expensive, produces audit-ready reports)

sentinel catches: known CVEs in deps, hardcoded secrets, obvious injection patterns.
@rune/security catches: logic flaws in auth flows, missing authorization on specific routes, compliance gaps, attack chains spanning multiple services.

## Done When

- All OWASP Top 10 categories explicitly assessed (confirmed safe or finding raised)
- Every HIGH/CRITICAL finding has a PoC or reproduction steps confirming exploitability
- Secret audit covers source history, not just current HEAD
- Compliance report maps each applicable standard requirement to a code location or gap
- Structured security report emitted with severity ratings and remediation steps

## Cost Profile

~8,000–20,000 tokens per full pack audit depending on codebase size. opus default for auth/crypto/payment review. haiku for initial pattern scanning (scout phase). Expect 3–5 minutes elapsed for a mid-size application.

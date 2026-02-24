---
name: watchdog
description: Post-deploy monitoring. Checks if deployed app is healthy — HTTP status, response times, error detection, and smoke test report.
metadata:
  author: runedev
  version: "0.2.0"
  layer: L3
  model: sonnet
  group: monitoring
---

# watchdog

## Purpose

Post-deploy monitoring. Receives a deployed URL and list of expected endpoints, runs health checks, measures response times, detects errors, and returns a structured smoke test report.

## Called By (inbound)

- `deploy` (L2): post-deploy monitoring setup
- `launch` (L1): monitoring as part of launch pipeline

## Calls (outbound)

None — pure L3 utility.

## Executable Instructions

### Step 1: Receive Target

Accept input from calling skill:
- `base_url` — deployed application URL (e.g. `https://myapp.com`)
- `endpoints` — list of paths to check (e.g. `["/", "/health", "/api/status"]`)

If no endpoints provided, default to: `["/", "/health", "/ready"]`

### Step 2: Health Check

For each endpoint, run an HTTP status check using `Bash`:

```bash
curl -s -o /dev/null -w "%{http_code}" https://myapp.com/health
```

- 2xx → HEALTHY
- 3xx → REDIRECT (note final destination)
- 4xx → CLIENT_ERROR (flag as alert)
- 5xx → SERVER_ERROR (flag as critical alert)
- Connection refused / timeout → UNREACHABLE (flag as critical)

### Step 3: Response Time

For each endpoint, measure latency using `Bash`:

```bash
curl -s -o /dev/null -w "%{time_total}" https://myapp.com/health
```

Thresholds:
- < 500ms → FAST
- 500ms–2000ms → ACCEPTABLE
- > 2000ms → SLOW (flag as alert)

### Step 4: Error Detection

Scan responses for problems:
- 4xx/5xx HTTP codes → log endpoint + status code
- Response time > 2s → log endpoint + measured time
- Connection timeout (curl exits non-zero) → UNREACHABLE
- Empty response body on non-204 endpoints → flag as WARNING

Collect all flagged issues into an `alerts` list.

### Step 5: Report

Output the following report structure:

```
## Watchdog Report: [base_url]

### Smoke Test Results
- [endpoint] — [HTTP status] ([response_time]s) — [HEALTHY|REDIRECT|CLIENT_ERROR|SERVER_ERROR|UNREACHABLE]

### Alert Rules Applied
- Response time > 2s → alert
- Any 4xx on non-auth endpoint → alert
- Any 5xx → critical alert
- Unreachable → critical alert

### Alerts
- [CRITICAL|WARNING] [endpoint] — [reason]

### Summary
- Total endpoints checked: [n]
- Healthy: [n]
- Alerts: [n]
- Overall status: ALL_HEALTHY | DEGRADED | DOWN
```

If no alerts: output `Overall status: ALL_HEALTHY`.

## Output Format

```
## Watchdog Report: [base_url]
### Smoke Test Results
- / — 200 (0.231s) — HEALTHY
- /health — 200 (0.089s) — HEALTHY
- /api/status — 500 (1.203s) — SERVER_ERROR

### Alerts
- CRITICAL /api/status — HTTP 500

### Summary
- Total: 3 | Healthy: 2 | Alerts: 1
- Overall status: DEGRADED
```

## Constraints

1. MUST report with specific metrics — not vague "performance seems slow"
2. MUST include baseline comparison when available
3. MUST NOT generate false alarms — precision over recall

## Cost Profile

~500-1500 tokens input, ~300-800 tokens output. Sonnet for configuration quality.

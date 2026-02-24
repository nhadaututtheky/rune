---
name: preflight
description: Pre-commit quality gate that catches "almost right" code. Goes beyond linting — checks logic correctness, error handling, regressions, and completeness.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L2
  model: sonnet
  group: quality
---

# preflight

## Purpose

Pre-commit quality gate that catches "almost right" code — the kind that compiles and passes linting but has logic errors, missing error handling, or incomplete implementations. Goes beyond static analysis to check data flow, edge cases, async correctness, and regression impact. The last defense before code enters the repository.

## Triggers

- Called automatically by `cook` before commit phase
- Called by `fix` after applying fixes (verify fix quality)
- `/rune preflight` — manual quality check
- Auto-trigger: when staged changes exceed 100 LOC

## Calls (outbound)

- `scout` (L2): find code affected by changes (dependency tracing)
- `sentinel` (L2): security sub-check on changed files
- `hallucination-guard` (L3): verify imports and API references exist

## Called By (inbound)

- `cook` (L1): before commit phase — mandatory gate
- `fix` (L2): after applying fixes to verify quality
- `review` (L2): can trigger preflight for deeper analysis

## Workflow

1. **Identify changes** — get list of modified files, functions, and their dependencies
2. **Logic review** — trace data flow through changed functions, check edge cases (null, empty, boundary), verify async/await correctness
3. **Error handling audit** — every async function has try/catch, every fetch has error handling, error messages are user-friendly, no bare catch
4. **Regression check** — identify existing code affected by changes, check if affected areas have tests, flag untested impact zones
5. **Completeness check** — new API endpoint has validation, new UI has loading/error states, new feature has tests, new config has documentation
6. **Security sub-check** — delegate to sentinel for security-specific analysis
7. **Import verification** — delegate to hallucination-guard for import/API checks
8. **Generate verdict** — aggregate findings, determine PASS/WARN/BLOCK

## Check Categories

```
LOGIC       — data flow errors, edge case misses, async bugs
ERROR       — missing try/catch, bare catches, unhelpful error messages
REGRESSION  — untested impact zones, breaking changes to public API
COMPLETE    — missing validation, missing loading states, missing tests
SECURITY    — delegated to sentinel
IMPORTS     — delegated to hallucination-guard
```

## Output Format

```
## Preflight Report
- **Status**: PASS | WARN | BLOCK
- **Files Checked**: [count]
- **Changes**: +[added] -[removed] lines across [files] files

### Logic Issues
- `path/to/file.ts:42` — Possible null dereference: `user.name` without null check
- `path/to/api.ts:85` — Async function missing await on database call

### Error Handling
- `path/to/handler.ts:20` — Bare catch block swallows error silently

### Regression Risk
- `utils/format.ts` — Changed function used by 5 other modules, only 2 have tests

### Completeness
- `api/users.ts` — New POST endpoint missing input validation
- `components/Form.tsx` — No loading state during submission

### Security (from sentinel)
- [sentinel findings if any]

### Verdict
WARN — 3 issues found (0 blocking, 3 should-fix). Safe to commit with acknowledgment.
```

## Cost Profile

~2000-4000 tokens input, ~500-1500 tokens output. Sonnet for logic analysis quality.

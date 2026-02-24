---
name: verification
description: Run project checks — lint, type-check, test suite, build validation. Universal validator called by multiple skills to confirm code health.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L3
  model: haiku
  group: validation
---

# verification

## Purpose

Universal project validator that runs lint, type-check, test suite, and build validation. Verification is the final "does it actually work?" check — called by cook before commit, by fix after changes, by deploy before deployment, and by sentinel for security tool output. Runs on haiku for speed and cost efficiency.

## Triggers

- Called by multiple L1/L2 skills as final validation step
- `/rune verify` — manual verification run
- Auto-trigger: before any git commit in cook workflow

## Calls (outbound)

None — verification is a pure L3 utility. It runs project-specific commands and reports results.

## Called By (inbound)

- `cook` (L1): Phase 6 VERIFY — final check before commit
- `fix` (L2): validate fix doesn't break existing functionality
- `test` (L2): validate test coverage meets threshold
- `deploy` (L2): post-deploy health checks
- `sentinel` (L2): run security audit tools (npm audit, etc.)
- `safeguard` (L2): verify safety net is solid before refactoring

## Workflow

1. **Detect project type** — read package.json, pyproject.toml, Cargo.toml, etc.
2. **Run checks** in order:
   - **Lint** — eslint, ruff, clippy (project-specific)
   - **Type check** — tsc, mypy, cargo check
   - **Test suite** — jest, pytest, cargo test (full or targeted)
   - **Build** — npm run build, cargo build (optional, for deploy)
3. **Collect results** — pass/fail per check with error details
4. **Report** — structured output for calling skill

## Output Format

```
## Verification Report
- **Status**: PASS | FAIL
- **Project**: [name] | **Type**: [detected]

### Checks
| Check | Status | Details |
|-------|--------|---------|
| Lint | PASS | 0 errors, 2 warnings |
| Types | PASS | No errors |
| Tests | PASS | 42/42 passed (95% coverage) |
| Build | PASS | Built in 3.2s |

### Errors (if any)
- [error details with file:line]

### Warnings
- [warning details]
```

## Cost Profile

~500-1000 tokens input, ~200-500 tokens output. Haiku for speed. Most time spent waiting for project commands to execute, not on token processing.

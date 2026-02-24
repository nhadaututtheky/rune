---
name: safeguard
description: Build safety nets before refactoring. Creates characterization tests, boundary markers, config freezes, and rollback points.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L2
  model: sonnet
  group: rescue
---

# safeguard

## Purpose

Build safety nets before any refactoring begins. Safeguard creates characterization tests that capture current behavior, adds boundary markers to distinguish legacy from new code, freezes config files, and creates git rollback points. Nothing gets refactored without safeguard running first.

## Triggers

- Called by `rescue` Phase 1 SAFETY NET
- Called by `surgeon` when untested module encountered

## Calls (outbound)

- `scout` (L2): find all entry points and public interfaces
- `test` (L2): write characterization tests capturing current behavior
- `verification` (L3): verify safety net is solid

## Called By (inbound)

- `rescue` (L1): Phase 1 SAFETY NET — build protection before surgery
- `surgeon` (L2): untested module found during surgery

## Cross-Hub Connections

- `surgeon` → `safeguard` — untested module found during surgery

## Workflow

1. **Audit existing tests** — scout finds test files, assess coverage gaps
2. **Characterization tests** — test writes tests capturing CURRENT behavior (not ideal behavior)
3. **Boundary markers** — add comments: `@legacy`, `@new-v2`, `@bridge`, `@do-not-touch`
4. **Config freeze** — lock tsconfig, eslint, lockfile versions
5. **Rollback point** — `git tag rune-rescue-baseline`
6. **Verify** — verification confirms all tests pass

## Output Format

```
## Safeguard Report
- **Tests Added**: [count]
- **Coverage**: [before]% → [after]%
- **Markers Added**: [count]
- **Rollback Tag**: rune-rescue-baseline

### Characterization Tests
- `tests/char/[module].test.ts` — [count] tests capturing current behavior

### Boundary Markers
- `@legacy`: [count] files marked
- `@do-not-touch`: [count] files protected

### Config Frozen
- [list of locked config files]
```

## Cost Profile

~2000-5000 tokens input, ~1000-2000 tokens output. Sonnet for test writing quality.

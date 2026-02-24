---
name: scope-guard
description: Track scope creep. Compares actual implementation against original plan, alerts on drift, and logs scope changes with reasons.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L3
  model: haiku
  group: monitoring
---

# scope-guard

## Purpose

Track scope creep by comparing actual implementation against the original plan. Alerts when scope is expanding beyond what was planned, tracks effort, and logs scope changes with justification. Distinguishes necessary expansion from creep.

## Triggers

- Called by L1 orchestrators to check scope drift
- Auto-trigger: when files changed exceed plan expectations

## Calls (outbound)

None — pure L3 monitoring utility.

## Called By (inbound)

- Auto-triggered by L1 orchestrators when files changed exceed plan expectations

## Workflow

1. **Baseline** — parse original task/plan into checklist, store in .rune/scope.md
2. **Monitor** — track files changed vs plan, tool calls per task
3. **Detect drift** — alert on: editing unplanned files, exceeding planned file count, high tool call count
4. **Log changes** — when scope changes, record WHY (necessary vs creep)
5. **Report** — drift percentage and recommendations

## Output Format

```
## Scope Report
- **Planned files**: [count] | **Actual files**: [count]
- **Drift**: [percentage]
- **Status**: ON TRACK | MINOR DRIFT | SIGNIFICANT DRIFT

### Scope Changes
- [change] — [reason: necessary | creep]

### Recommendations
- [suggestion to refocus or acknowledge expansion]
```

## Cost Profile

~200-500 tokens input, ~100-300 tokens output. Haiku. Lightweight monitor.

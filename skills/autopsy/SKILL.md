---
name: autopsy
description: Full codebase health assessment. Analyzes complexity, dependencies, dead code, tech debt, and git hotspots. Produces a health score and rescue plan.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L2
  model: opus
  group: rescue
---

# autopsy

## Purpose

Full codebase health assessment for legacy projects. Autopsy analyzes complexity, dependency coupling, dead code, tech debt, and git hotspots to produce a health score per module and a prioritized rescue plan. Uses opus for deep analysis quality.

## Triggers

- Called by `rescue` Phase 0 RECON
- Called by `onboard` when project appears messy
- `/rune autopsy` — manual health assessment

## Calls (outbound)

- `scout` (L2): deep structural scan — files, LOC, entry points, imports
- `research` (L3): identify if tech stack is outdated
- `trend-scout` (L3): compare against current best practices
- `journal` (L3): record health assessment findings

## Called By (inbound)

- `rescue` (L1): Phase 0 RECON — assess damage before refactoring

## Workflow

1. **Structure scan** — scout maps files, LOC, entry points
2. **Complexity analysis** — cyclomatic complexity > 10, nesting > 4 levels
3. **Dependency map** — coupling analysis, circular dependencies (Mermaid diagram)
4. **Health scoring** — 1-100 per module using 25+ factors
5. **Archaeology** — git log hotspots, git blame age, dead code detection
6. **Report** — RESCUE-REPORT.md with prioritized findings

## Health Score Factors

```
CODE QUALITY    — cyclomatic complexity, nesting depth, function length
DEPENDENCIES    — coupling, circular deps, outdated packages
TEST COVERAGE   — line coverage, branch coverage, test quality
DOCUMENTATION   — inline comments, README, API docs
MAINTENANCE     — git hotspots, commit frequency, author count
DEAD CODE       — unused exports, unreachable branches
```

## Output Format

```
## Autopsy Report: [Project Name]
- **Overall Health**: [score]/100
- **Modules Assessed**: [count]
- **Critical Issues**: [count]

### Module Health
| Module | Health | Complexity | Coupling | Tests | Priority |
|--------|--------|-----------|----------|-------|----------|
| auth | 72 | medium | low | 85% | low |
| payments | 34 | high | high | 12% | critical |

### Dependency Graph
[Mermaid diagram]

### Rescue Priority
1. [module] — [reason] — [suggested pattern]

### Git Archaeology
- Hotspot: [file] ([change frequency])
- Oldest untouched: [file] ([age])
```

## Cost Profile

~5000-10000 tokens input, ~2000-4000 tokens output. Opus for deep analysis. Most expensive L2 skill but runs once per rescue.

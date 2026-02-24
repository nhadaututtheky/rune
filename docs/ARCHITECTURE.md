# Rune Architecture

## 4-Layer Model

| Layer | Name | Count | Can Call | Called By | State |
|-------|------|-------|----------|----------|-------|
| L1 | Orchestrators | 4 | L2, L3 | User only | Stateful (workflow) |
| L2 | Workflow Hubs | 15 | L2 (cross-hub), L3 | L1, L2 | Stateful (task) |
| L3 | Utilities | 16 | Nothing (pure) | L1, L2 | Stateless |
| L4 | Extension Packs | 12 | L3 | L2 (domain match) | Config-based |

## Mesh Protocol

### Loop Prevention

```
Rule 1: No self-calls (history[-1] !== target)
Rule 2: Max 2 visits to same skill per chain
Rule 3: Max chain depth: 8
Rule 4: If blocked → escalate to L1 orchestrator
```

### Model Auto-Selection

```
Read-only / scan?           → haiku   (cheapest)
Write / edit / generate?    → sonnet  (default)
Architecture / security?    → opus    (deep reasoning)

Override: priority=critical → always opus
Override: budget constraint → downgrade
Override: user preference   → manual in config
```

### Parallel Execution

| Context | Max Parallel | Reason |
|---------|-------------|--------|
| L3 utilities (haiku) | 5 | Cheap, fast, independent |
| L2 hubs (sonnet) | 3 | Moderate cost, may share context |
| L1 orchestrators | 1 | Only one orchestrator at a time |

### Error Handling & Resilience

| If this fails... | Try this instead... |
|-------------------|---------------------|
| debug can't find cause | problem-solver (different reasoning) |
| docs-seeker can't find | research (broader web search) |
| browser-pilot can't capture | verification (CLI checks) |
| scout can't find files | research + docs-seeker |
| test can't run (env broken) | deploy fix env → test again |
| review finds too many issues | plan re-scope → fix priorities |

## Skill Groups

### L1 Orchestrators

| Skill | Model | Role |
|-------|-------|------|
| cook | sonnet | Feature implementation orchestrator |
| team | opus | Multi-agent parallel orchestrator |
| launch | sonnet | Deploy + marketing orchestrator |
| rescue | sonnet | Legacy refactoring orchestrator |

### L2 Workflow Hubs

| Group | Skills |
|-------|--------|
| CREATION | plan, scout, brainstorm |
| DEVELOPMENT | debug, fix, test, review |
| QUALITY | sentinel, preflight, onboard |
| DELIVERY | deploy, marketing |
| RESCUE | autopsy, safeguard, surgeon |

### L3 Utilities

| Group | Skills |
|-------|--------|
| KNOWLEDGE | research, docs-seeker, trend-scout |
| REASONING | problem-solver, sequential-thinking |
| VALIDATION | verification, hallucination-guard |
| STATE | context-engine, journal, session-bridge |
| MONITORING | watchdog, scope-guard |
| MEDIA | browser-pilot, asset-creator, video-creator |
| DEPS | dependency-doctor |

## Cross-Hub Mesh (L2 ↔ L2)

```
plan ↔ brainstorm     (creative ↔ structure)
fix ↔ debug           (fix ↔ root cause)
test → debug          (unexpected failure)
review → test         (untested edge case found)
review → fix          (bug found during review)
fix → test            (verify after fix)
deploy → test         (pre-deploy verification)
debug → scout         (find related code)
marketing → scout     (analyze assets)
plan → scout          (scan before planning)
fix → review          (self-review complex fix)
review → scout        (more context needed)
surgeon → safeguard   (untested module found)
preflight → sentinel  (security sub-check)
```

## Context Bus

Each workflow maintains a shared context managed by L1:

```
L1: full bus (complete picture)
L2: relevant subset (only what they need)
L3: minimal query (stateless, no history)
L4: domain-filtered subset
```

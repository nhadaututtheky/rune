---
name: journal
description: Rescue-specific state tracking across sessions. Manages RESCUE-STATE.md, module-status.json, dependency graphs, and Architecture Decision Records.
metadata:
  author: runedev
  version: "0.2.0"
  layer: L3
  model: haiku
  group: state
---

# journal

## Purpose

Rescue-specific state tracking across sessions. Journal manages the persistent state files that allow rescue workflows to span multiple sessions without losing progress. Separate from session-bridge which handles general context — journal is specifically for rescue operations.

## Triggers

- Called by rescue skills after each phase completion
- Auto-trigger: after surgeon completes a module

## Calls (outbound)

None — pure L3 state management utility.

## Called By (inbound)

- `surgeon` (L2): update progress after each surgery session
- `rescue` (L1): read state for rescue dashboard
- `autopsy` (L2): save initial health assessment

## Files Managed

```
.rune/RESCUE-STATE.md      — Human-readable rescue progress (loaded into context)
.rune/module-status.json   — Machine-readable module states
.rune/dependency-graph.mmd — Mermaid diagram, color-coded by health
.rune/adr/                 — Architecture Decision Records (one per decision)
```

## Execution

### Step 1 — Load state

Use `Read` to load current rescue state:

```
Read: .rune/RESCUE-STATE.md
Read: .rune/module-status.json
```

If either file does not exist, initialize it with an empty template:

- `RESCUE-STATE.md`: create with header `# Rescue State\n\n**Started**: [date]\n**Phase**: 1\n`
- `module-status.json`: create with `{ "modules": [], "lastUpdated": "[iso-date]" }`

Parse `module-status.json` to extract current module states and health scores.

### Step 2 — Update progress

For each module that was completed during this session:

1. Locate the module entry in the parsed `module-status.json`
2. Update its fields:
   - `status`: set to `"complete"` (or `"in-progress"` / `"blocked"` as appropriate)
   - `healthScore`: set to the post-surgery score (0-100)
   - `completedAt`: set to current ISO timestamp
3. Mark the active module pointer in `RESCUE-STATE.md` — update the `**Current Module**` line to the next pending module

Use `Write` to save the updated `module-status.json`.

Use `Edit` to update the relevant lines in `RESCUE-STATE.md` (current phase, current module, counts of completed vs pending).

### Step 3 — Record decisions

For each architectural decision or trade-off made during this session:

1. Generate an ADR filename: `.rune/adr/ADR-[NNN]-[slug].md` where NNN is the next sequential number
2. Use `Write` to create the ADR file with this format:

```markdown
# ADR-[NNN]: [Decision Title]

**Date**: [YYYY-MM-DD]
**Status**: Accepted
**Module**: [affected module]

## Context
[Why this decision was needed]

## Decision
[What was decided]

## Rationale
[Why this approach over alternatives]

## Consequences
[Impact on files/modules/future work]
```

### Step 4 — Update dependency graph

If any module dependencies changed during this session (new imports, removed dependencies, refactored interfaces):

Use `Read` on `.rune/dependency-graph.mmd` to load the current Mermaid diagram.

Use `Edit` to update the affected node entries:
- Change node color/style to reflect new health status (e.g., `style ModuleName fill:#00d084` for healthy, `fill:#ff6b6b` for broken)
- Add or remove edges as dependencies changed

Use `Write` to save the updated `.rune/dependency-graph.mmd`.

### Step 5 — Save state

Use `Write` to finalize any remaining state file changes not already saved in Steps 2-4.

Confirm all four managed files are consistent:
- `RESCUE-STATE.md` reflects current phase and module
- `module-status.json` has updated scores and timestamps
- ADR files exist for all decisions made
- `dependency-graph.mmd` reflects current module relationships

### Step 6 — Report

Emit the journal update summary to the calling skill.

## Output Format

```
## Journal Update
- **Phase**: [current rescue phase]
- **Module**: [current module]
- **Health**: [before] → [after]
- **ADRs Written**: [count]
- **Files Updated**: [list of .rune/ files modified]
- **Next Module**: [next in queue, or "rescue complete"]
```

## Context Recovery (new session)

```
1. Read .rune/RESCUE-STATE.md   → full rescue history
2. Read .rune/module-status.json → module states and health scores
3. Read git log                  → latest changes since last session
4. Read CLAUDE.md               → project conventions
→ Result: Zero context loss across rescue sessions
```

## Constraints

1. MUST record decisions with rationale — not just "decided to use X"
2. MUST timestamp all entries
3. MUST NOT log sensitive data (secrets, tokens, credentials)

## Cost Profile

~200-500 tokens input, ~100-300 tokens output. Haiku. Pure file management.

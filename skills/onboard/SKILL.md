---
name: onboard
description: Auto-generate project context for AI sessions. Scans codebase, creates CLAUDE.md and .rune/ setup so every future session starts with full context.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L2
  model: sonnet
  group: quality
---

# onboard

## Purpose

Auto-generate project context for AI sessions. Scans the codebase and creates a CLAUDE.md project config plus .rune/ state directory so every future session starts with full context. Saves 10-20 minutes of re-explaining per session on undocumented projects.

## Triggers

- `/rune onboard` — manual invocation on any project
- Called by `rescue` as Phase 0 (understand before refactoring)
- Auto-trigger: when no CLAUDE.md exists in project root

## Calls (outbound)

- `scout` (L2): deep codebase scan — structure, frameworks, patterns, dependencies

## Called By (inbound)

- User: `/rune onboard` manual invocation
- `rescue` (L1): Phase 0 — understand legacy project before refactoring
- `cook` (L1): if no CLAUDE.md found, onboard first

## Workflow

1. **Codebase analysis** — detect framework, language, package manager, entry points, LOC, file count
2. **Structure mapping** — directory tree, module boundaries, key files identification
3. **Convention detection** — naming patterns, code style, error handling patterns, test structure
4. **Generate CLAUDE.md** — project description, tech stack, directory guide, conventions, commands
5. **Setup .rune/ directory** — initialize state files for session-bridge
6. **Generate .runeignore** — AI-specific ignore file (exclude node_modules, dist, binaries, large data)

## Output Files

```
project/
├── CLAUDE.md              # Project config for AI sessions
└── .rune/
    ├── conventions.md     # Detected patterns & style
    ├── decisions.md       # Empty, ready for session-bridge
    ├── progress.md        # Empty, ready for session-bridge
    └── session-log.md     # Empty, ready for session-bridge
```

## CLAUDE.md Template

```markdown
# [Project Name] — Project Configuration

## Overview
[Auto-detected description]

## Tech Stack
- Framework: [detected]
- Language: [detected]
- Package Manager: [detected]
- Test Framework: [detected]

## Directory Structure
[Generated tree with annotations]

## Conventions
- Naming: [detected patterns]
- Error handling: [detected patterns]
- State management: [detected patterns]

## Commands
- Install: [detected]
- Dev: [detected]
- Build: [detected]
- Test: [detected]
- Lint: [detected]

## Key Files
- Entry point: [path]
- Config: [paths]
- Routes/API: [paths]
```

## Output Format

```
## Onboard Report
- **Project**: [name] | **Framework**: [detected] | **Language**: [detected]
- **Files**: [count] | **LOC**: [count] | **Modules**: [count]

### Generated
- CLAUDE.md (project configuration)
- .rune/conventions.md (detected patterns)
- .rune/decisions.md (initialized)
- .rune/progress.md (initialized)

### Observations
- [notable patterns]
- [potential issues]
- [recommendations]
```

## Cost Profile

~2000-5000 tokens input, ~1000-2000 tokens output. Sonnet for analysis quality.

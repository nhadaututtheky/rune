---
name: onboard
description: Auto-generate project context for AI sessions. Scans codebase, creates CLAUDE.md and .rune/ setup so every future session starts with full context.
metadata:
  author: runedev
  version: "0.2.0"
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

## Executable Steps

### Step 1 — Full Scan
Invoke `rune:scout` on the project root. Collect:
- Top-level directory structure (depth 2)
- All config files: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `composer.json`, `.nvmrc`, `.python-version`
- Entry point files: `main.*`, `index.*`, `app.*`, `server.*`
- Test directory names and test file patterns
- CI/CD config files: `.github/workflows/`, `Makefile`, `Dockerfile`
- README.md if present

Do not read every source file — scout gives the skeleton. Use `Read` only on config files and entry points.

### Step 2 — Detect Tech Stack
From the scan output, determine with confidence:
- **Language**: TypeScript | JavaScript | Python | Rust | Go | other
- **Framework**: Next.js | Vite+React | SvelteKit | Express | FastAPI | Django | none | other
- **Package manager**: npm | pnpm | yarn | pip | poetry | cargo | go modules
- **Test framework**: Vitest | Jest | pytest | cargo test | go test | none
- **Build tool**: tsc | vite | webpack | esbuild | cargo | none
- **Linter/formatter**: ESLint | Biome | Ruff | Black | Clippy | none

If a field cannot be determined with confidence, write "unknown" — do not guess.

### Step 3 — Extract Conventions
Read 3–5 representative source files (pick files with the most connections in the project — typically the main module, a route/controller file, and a utility file). Extract:
- **Naming patterns**: camelCase | snake_case | PascalCase for files, functions, variables
- **Import style**: named imports | default imports | barrel files (index.ts)
- **Error handling pattern**: try/catch | Result type | error boundary | unhandled
- **State management**: React Context | Zustand | Redux | Svelte stores | none
- **API pattern**: REST | tRPC | GraphQL | SDK | none
- **Test structure**: co-located (`file.test.ts`) | separate directory (`tests/`) | none

Write extracted conventions as bullet points — be specific, not generic.

### Step 4 — Generate CLAUDE.md
Use `Write` to create `CLAUDE.md` at the project root. Populate every section using data from Steps 2–3. Do not leave template placeholders — if data is unknown, write "unknown" or omit the section. Use the template below as the exact structure.

If a `CLAUDE.md` already exists, use `Read` to load it first, then merge — preserve any human-written sections (comments starting with `<!-- manual -->`) and update auto-detected sections only.

### Step 5 — Initialize .rune/ Directory
Use `Bash` to create the directory: `mkdir -p .rune`

Use `Write` to create each file:
- `.rune/conventions.md` — paste the extracted conventions from Step 3 in full detail
- `.rune/decisions.md` — create with header `# Architecture Decisions` and one placeholder row in a markdown table (Date | Decision | Rationale | Status)
- `.rune/progress.md` — create with header `# Progress Log` and one placeholder entry
- `.rune/session-log.md` — create with header `# Session Log` and current date as first entry

### Step 6 — Commit
Use `Bash` to stage and commit the generated files:
```bash
git add CLAUDE.md .rune/ && git commit -m "chore: initialize rune project context"
```

If `git` is not available or the directory is not a git repo, skip this step and add an INFO note to the report: "Not a git repository — files written but not committed."

If any of the `.rune/` files already exist, do not overwrite them (they may contain human-written decisions). Log **INFO**: "Skipped existing .rune/[file] — manual content preserved."

## CLAUDE.md Template

```markdown
# [Project Name] — Project Configuration

## Overview
[Auto-detected description from README or entry point comments]

## Tech Stack
- Framework: [detected]
- Language: [detected]
- Package Manager: [detected]
- Test Framework: [detected]
- Build Tool: [detected]
- Linter: [detected]

## Directory Structure
[Generated tree with one-line annotations per directory]

## Conventions
- Naming: [detected patterns — specific, not generic]
- Error handling: [detected pattern]
- State management: [detected pattern]
- API pattern: [detected pattern]
- Test structure: [detected pattern]

## Commands
- Install: [detected command]
- Dev: [detected command]
- Build: [detected command]
- Test: [detected command]
- Lint: [detected command]

## Key Files
- Entry point: [absolute path]
- Config: [absolute paths]
- Routes/API: [absolute paths]
```

## Output Format

```
## Onboard Report
- **Project**: [name] | **Framework**: [detected] | **Language**: [detected]
- **Files**: [count] | **LOC**: [estimate] | **Modules**: [count]

### Generated
- CLAUDE.md (project configuration)
- .rune/conventions.md (detected patterns)
- .rune/decisions.md (initialized)
- .rune/progress.md (initialized)
- .rune/session-log.md (initialized)

### Skipped (already exist)
- [list of files not overwritten]

### Observations
- [notable patterns or anomalies found]
- [potential issues detected]
- [recommendations for the developer]
```

## Constraints

1. MUST scan actual project files — never generate CLAUDE.md from assumptions
2. MUST detect and respect existing CLAUDE.md content — merge, don't overwrite
3. MUST include: build commands, test commands, lint commands, project structure
4. MUST NOT include obvious/generic advice ("write clean code", "use meaningful names")
5. MUST verify generated commands actually work by running them

## Cost Profile

~2000-5000 tokens input, ~1000-2000 tokens output. Sonnet for analysis quality.

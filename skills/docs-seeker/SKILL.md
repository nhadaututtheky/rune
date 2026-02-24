---
name: docs-seeker
description: Find documentation for APIs, libraries, and error messages. Looks up official docs, changelog entries, and migration guides.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L3
  model: haiku
  group: knowledge
---

# docs-seeker

## Purpose

Find documentation for APIs, libraries, and error messages. Docs-seeker looks up official docs, changelog entries, deprecation notices, and migration guides. Called when skills encounter unfamiliar APIs or unclear error messages.

## Triggers

- Called by L2 skills needing documentation
- Auto-trigger: when error message contains library name or API reference

## Calls (outbound)

None — pure L3 utility using WebSearch, WebFetch, and Context7 tools.

## Called By (inbound)

- `debug` (L2): lookup API docs for unclear errors
- `fix` (L2): check correct API usage before applying changes
- `review` (L2): verify API usage is current and correct

## Workflow

1. **Identify target** — library name, version, API endpoint, or error code
2. **Search docs** — official documentation, GitHub issues, Stack Overflow
3. **Extract** — relevant API signatures, usage examples, known issues
4. **Format** — structured output with code examples

## Output Format

```
## Documentation: [Library/API]
- **Version**: [detected]
- **Source**: [official docs URL]

### API Reference
- [function/endpoint signature]
- [parameters and types]
- [return value]

### Usage Example
[code snippet from docs]

### Known Issues
- [relevant issues or deprecations]
```

## Cost Profile

~300-600 tokens input, ~200-400 tokens output. Haiku. Fast lookup.

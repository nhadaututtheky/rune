---
name: browser-pilot
description: Browser automation — open URLs, take screenshots, extract console/network errors, run Lighthouse audits, and fill forms.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L3
  model: sonnet
  group: media
---

# browser-pilot

## Purpose

Browser automation for testing and verification. Opens URLs, takes screenshots, extracts console errors and network failures, runs Lighthouse audits, and performs basic form interactions. Used for e2e testing, deploy verification, and visual regression.

## Triggers

- Called by L2 skills needing browser interaction

## Calls (outbound)

None — pure L3 utility using Playwright MCP tools.

## Called By (inbound)

- `test` (L2): e2e and visual testing
- `deploy` (L2): verify live deployment
- `debug` (L2): capture browser console errors
- `marketing` (L2): screenshot for assets

## Capabilities

```
NAVIGATE     — open URL, wait for load
SCREENSHOT   — full page, viewport, specific element
CONSOLE      — extract errors, warnings, logs
NETWORK      — capture failed requests, slow responses
LIGHTHOUSE   — performance, accessibility, SEO scores
INTERACT     — click buttons, fill forms, select options
COMPARE      — visual snapshot comparison (before/after)
```

## Output Format

```
## Browser Report: [URL]
- **Status**: [HTTP status]
- **Load Time**: [duration]

### Console Errors
- [error message with source]

### Screenshots
- [saved screenshot paths]

### Lighthouse (if run)
- Performance: [score]
- Accessibility: [score]
- SEO: [score]
```

## Cost Profile

~500-1500 tokens input, ~300-800 tokens output. Sonnet for interaction logic.

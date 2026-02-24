// Rune Post-Session Reflect Hook
// Structured self-review checklist at session end (Stop event)
// Prompts Claude to verify work is actually complete before closing

console.log(`
┌─────────────────────────────────────────────────────┐
│  Rune Session End — Verification Checklist          │
├─────────────────────────────────────────────────────┤
│  Before closing this session, confirm:              │
│                                                     │
│  □ All TodoWrite tasks marked complete?             │
│  □ Tests ran and passing?                           │
│  □ No hardcoded secrets introduced?                 │
│  □ If schema changed: migration + rollback exist?   │
│  □ Verification ran (lint + types + build)?         │
│                                                     │
│  If any item is unclear → address it now.           │
└─────────────────────────────────────────────────────┘
`);

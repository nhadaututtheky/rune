---
name: "@rune/ui"
description: Frontend UI patterns — design systems, component architecture, accessibility audits, and animation patterns.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$12"
  target: Frontend developers
---

# @rune/ui

## Skills Included

### design-system
Generate and enforce design system tokens — colors, typography, spacing, shadows, border radius. Detects existing patterns and creates a consistent token set.

### component-patterns
Component architecture patterns — compound components, render props, composition, slots. Guides refactoring from prop-heavy components to composable architectures.

### a11y-audit
Accessibility audit beyond automated tools. Checks WCAG 2.1 AA compliance — focus management, screen reader testing, color contrast, ARIA patterns, keyboard navigation.

### animation-patterns
Motion design patterns — micro-interactions, page transitions, scroll animations, loading states. Uses CSS transitions, Framer Motion, or GSAP based on project stack.

## Connections

```
Calls → asset-creator (L3): generate design assets
Called By ← review (L2): when UI code is being reviewed
Called By ← cook (L1): when frontend task detected
```

## Tech Stack Support

| Framework | Styling | Components |
|-----------|---------|------------|
| React 19 | TailwindCSS 4 | shadcn/ui |
| Next.js 16 | CSS Modules | Radix UI |
| SvelteKit 5 | CSS Custom Props | Custom |
| Vue 3 | TailwindCSS 4 | Headless UI |

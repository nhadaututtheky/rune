---
name: "@rune/analytics"
description: Analytics patterns — tracking setup, A/B testing, funnel analysis, and dashboard design.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$12"
  target: Growth engineers
---

# @rune/analytics

## Skills Included

### tracking-setup
Analytics tracking — Google Analytics 4, Plausible, PostHog, Mixpanel. Event taxonomy design, consent management, server-side tracking, UTM handling.

### ab-testing
A/B testing patterns — experiment design, statistical significance, feature flags (LaunchDarkly, Unleash), rollout strategies, result analysis.

### funnel-analysis
Funnel analysis — conversion tracking, drop-off identification, cohort analysis, retention metrics, LTV calculation, attribution modeling.

### dashboard-patterns
Analytics dashboard design — KPI cards, time series charts, comparison views, drill-down navigation, export functionality, real-time counters.

## Connections

```
Calls → @rune/ui (L4): dashboard components
Calls → @rune/backend (L4): tracking API setup
Called By ← marketing (L2): measuring campaign performance
Called By ← cook (L1): when analytics feature requested
```

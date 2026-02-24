---
name: "@rune/saas"
description: SaaS patterns — multi-tenancy, billing integration, subscription management, and user onboarding flows.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$12"
  target: SaaS builders
---

# @rune/saas

## Skills Included

### multi-tenant
Multi-tenancy patterns — database isolation strategies (shared schema, schema-per-tenant, DB-per-tenant), tenant context middleware, data partitioning.

### billing-integration
Billing integration — Stripe, Paddle, LemonSqueezy. Subscription lifecycle, webhook handling, invoice generation, usage-based billing, dunning management.

### subscription-flow
Subscription UI flows — pricing page, checkout, plan upgrades/downgrades, cancellation, trial management, feature gating.

### onboarding-flow
User onboarding patterns — progressive disclosure, setup wizards, product tours, activation metrics, empty states, invite flows.

## Connections

```
Calls → @rune/backend (L4): API patterns for billing
Calls → @rune/ui (L4): onboarding UI components
Called By ← cook (L1): when SaaS project detected
```

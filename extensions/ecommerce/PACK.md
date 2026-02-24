---
name: "@rune/ecommerce"
description: E-commerce patterns — Shopify development, payment integration, shopping cart, and inventory management.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$12"
  target: E-commerce developers
---

# @rune/ecommerce

## Skills Included

### shopify-dev
Shopify development patterns — Liquid templates, theme customization, Shopify API, App Bridge, metafields, custom storefronts with Hydrogen.

### payment-integration
Payment integration — Stripe, PayPal, Apple Pay, Google Pay. Checkout flows, 3D Secure, refunds, disputes, PCI compliance.

### cart-system
Shopping cart architecture — cart state management, persistent carts, guest checkout, coupon/discount systems, tax calculation.

### inventory-mgmt
Inventory management patterns — stock tracking, variant management, warehouse allocation, low stock alerts, backorder handling.

## Connections

```
Calls → @rune/backend (L4): API patterns for orders
Called By ← cook (L1): when ecommerce project detected
```

---
name: marketing
description: Create marketing assets and execute launch strategy. Generates landing copy, social banners, SEO meta, blog posts, and video scripts.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L2
  model: sonnet
  group: delivery
---

# marketing

## Purpose

Create marketing assets and execute launch strategy. Marketing generates landing page copy, social media banners, SEO metadata, blog posts, and video scripts. Analyzes the project to create authentic, data-driven marketing content.

## Triggers

- Called by `launch` Phase 4 MARKET
- `/rune marketing` — manual marketing asset creation

## Calls (outbound)

- `scout` (L2): analyze existing project assets and features
- `asset-creator` (L3): generate banners, OG images, graphics
- `video-creator` (L3): create demo/explainer video scripts
- `trend-scout` (L3): market trends for positioning
- `research` (L3): competitor analysis, SEO data

## Called By (inbound)

- `launch` (L1): marketing phase of launch pipeline
- User: `/rune marketing` direct invocation

## Workflow

1. **Analyze project** — scout features, value props, target audience
2. **Research market** — trend-scout for positioning, research for competitors
3. **Generate copy** — landing page, product descriptions, social posts
4. **Create visuals** — asset-creator for banners, OG images
5. **SEO setup** — meta tags, structured data, sitemap
6. **Video** — video-creator for demo scripts

## Output Format

```
## Marketing Assets
- **Landing Copy**: [generated]
- **Social Posts**: [count]
- **Visuals**: [count]

### Generated Files
- marketing/landing-copy.md
- marketing/social-posts.md
- marketing/seo-meta.json
- marketing/video-script.md
```

## Cost Profile

~2000-5000 tokens input, ~1000-3000 tokens output. Sonnet for copywriting quality.

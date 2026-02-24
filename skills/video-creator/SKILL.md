---
name: video-creator
description: Video content creation — screen recording automation, video scripts, editing instructions, thumbnails, and demo flow planning.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L3
  model: sonnet
  group: media
---

# video-creator

## Purpose

Video content creation for product demos and marketing. Generates screen recording scripts, video scripts, ffmpeg editing instructions, thumbnails, and demo flow planning. Handles the planning side of video creation.

## Triggers

- Called by marketing for video content
- Called by launch for demo videos

## Calls (outbound)

None — pure L3 utility.

## Called By (inbound)

- `marketing` (L2): demo/explainer video scripts
- `launch` (L1): product demo videos

## Capabilities

```
DEMO SCRIPT     — step-by-step screen recording plan
VIDEO SCRIPT    — narration script with timestamps
EDITING         — ffmpeg commands for cuts, transitions, overlays
THUMBNAILS      — thumbnail design specs
FLOW PLANNING   — optimal demo flow showing features
```

## Output Format

```
## Video Plan: [Title]
- **Type**: demo | explainer | tutorial
- **Duration**: [estimated]

### Script
[Timestamped script with narration and screen actions]

### Recording Steps
1. [action to perform on screen]
2. [action to perform on screen]

### Editing Notes
- [ffmpeg commands or editing instructions]
```

## Cost Profile

~500-1500 tokens input, ~500-1000 tokens output. Sonnet for script quality.

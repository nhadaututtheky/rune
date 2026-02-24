---
name: "@rune/trading"
description: Fintech and trading patterns — real-time data, financial dashboards, technical indicators, and WebSocket architecture.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$15"
  target: Fintech developers
---

# @rune/trading

## Skills Included

### fintech-patterns
Financial application patterns — money handling (never floats), transaction processing, audit trails, regulatory compliance, PnL calculations.

### realtime-data
Real-time data architecture — WebSocket management, auto-reconnect with exponential backoff, event-driven state updates, data normalization, rate limiting.

### chart-components
Financial chart patterns — candlestick, line, area charts with TradingView/Lightweight Charts. Real-time updates, zoom, crosshair, indicators overlay.

### indicator-library
Technical indicator implementations — SMA, EMA, RSI, MACD, Bollinger Bands, VWAP. Streaming calculation patterns for real-time data.

## Connections

```
Calls → @rune/ui (L4): chart component styling
Called By ← cook (L1): when trading project detected
```

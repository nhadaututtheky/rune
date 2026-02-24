---
name: "@rune/devops"
description: DevOps patterns — Docker, CI/CD pipelines, monitoring setup, server configuration, and SSL/domain management.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$12"
  target: DevOps engineers
---

# @rune/devops

## Skills Included

### docker
Dockerfile and docker-compose patterns — multi-stage builds, layer optimization, security hardening, development vs production configs.

### ci-cd
CI/CD pipeline configuration — GitHub Actions, GitLab CI, build matrices, test parallelization, deployment gates, semantic release.

### monitoring
Production monitoring setup — Prometheus, Grafana, alerting rules, SLO/SLI definitions, log aggregation, distributed tracing.

### server-setup
Server configuration — Nginx/Caddy reverse proxy, systemd services, firewall rules, SSH hardening, automatic updates.

### ssl-domain
SSL certificate management and domain configuration — Let's Encrypt automation, DNS records, CDN setup, redirect rules.

## Connections

```
Calls → verification (L3): validate configs
Called By ← deploy (L2): deployment infrastructure
Called By ← launch (L1): production setup
```

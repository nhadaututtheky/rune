---
name: "@rune/security"
description: Deep security analysis — OWASP audit, penetration testing patterns, secret management, and compliance checking.
metadata:
  author: runedev
  version: "0.1.0"
  layer: L4
  price: "$15"
  target: Security engineers
---

# @rune/security

## Skills Included

### owasp-audit
Deep OWASP Top 10 audit — goes beyond sentinel's automated checks with manual-grade analysis of authentication flows, session management, access control, and cryptographic patterns.

### pentest-patterns
Penetration testing methodology — threat modeling, attack surface mapping, vulnerability exploitation patterns, remediation verification.

### secret-mgmt
Secret management patterns — vault integration, environment variable strategies, rotation policies, CI/CD secret injection, zero-trust architecture.

### compliance
Compliance checking — SOC 2, GDPR, HIPAA, PCI-DSS requirements mapped to code patterns, audit trail generation.

## Connections

```
Calls → scout (L2): scan for security patterns
Calls → verification (L3): run security tools
Called By ← review (L2): when security-critical code detected
Called By ← cook (L1): when auth/input/sensitive code
```

## Difference from sentinel

sentinel = lightweight automated gate (every commit, fast, cheap)
@rune/security = deep manual-grade audit (on-demand, thorough, expensive)

---
name: Bug Report
about: Report a bug or defect to track quality and DORA metrics
title: '[BUG] '
labels: 'type:bugfix'
assignees: ''
---

## Bug Description

**Summary:**
<!-- A clear and concise description of what the bug is -->

**Severity:**
- [ ] P1: Critical (Production down, data loss, security vulnerability)
- [ ] P2: Major (Feature broken, degraded performance, user-facing issue)
- [ ] P3: Minor (Small bug, cosmetic issue, nice-to-have fix)

## Steps to Reproduce

1.
2.
3.
4.

## Expected Behavior

<!-- What should happen -->

## Actual Behavior

<!-- What actually happens -->

## Environment

- **Browser/Client:**
- **OS:**
- **Version:**
- **Deployment:** Production / Staging / Development

## Screenshots/Logs

<!-- If applicable, add screenshots or paste error logs -->

```
[Paste error logs here]
```

## DORA Metrics - Change Failure Rate Tracking

**Incident Classification:**
- [ ] This is a production incident (dora:incident)
- [ ] Caused by recent deployment (dora:hotfix needed)
- [ ] Requires immediate rollback

**Incident Timeline:**
- **Detected At:** YYYY-MM-DD HH:MM (UTC)
- **Reported At:** YYYY-MM-DD HH:MM (UTC)
- **Severity Impact:**
  - [ ] Total outage (all users affected)
  - [ ] Partial outage (some users affected)
  - [ ] Degraded service (all users affected minimally)
  - [ ] Minor issue (few users affected)

**Related Deployment:**
- **Deployment ID/PR:** #___
- **Deployed At:** YYYY-MM-DD HH:MM (UTC)
- **Time Since Deployment:** ___ hours/days

## Fix Tracking

**AI Assistance for Fix:**
- [ ] Will use AI to assist with fix (ai:assisted)
- [ ] Planning to use AI for debugging
- [ ] Human-only fix required

**Estimated Effort:**
- [ ] Quick fix (< 2 hours) - velocity:quick-win
- [ ] Medium fix (2-8 hours) - velocity:medium
- [ ] Complex fix (> 1 day) - velocity:complex

**Time to Restore Service (MTTR):**
- **Fix Started At:** YYYY-MM-DD HH:MM (UTC)
- **Fix Deployed At:** YYYY-MM-DD HH:MM (UTC)
- **Service Restored At:** YYYY-MM-DD HH:MM (UTC)
- **Total Downtime:** ___ hours/minutes

## Root Cause Analysis

**Category:**
- [ ] Code defect
- [ ] Configuration error
- [ ] Infrastructure issue
- [ ] Third-party service
- [ ] Database issue
- [ ] Security vulnerability
- [ ] Other: ___

**Root Cause:**
<!-- To be filled after investigation -->

**Prevention:**
<!-- How can we prevent this in the future? -->
- [ ] Add tests
- [ ] Improve monitoring
- [ ] Add alerting
- [ ] Update documentation
- [ ] Code review process improvement
- [ ] Other: ___

## Additional Context

<!-- Any other context about the problem -->

---

**This issue will be tracked for:**
- Change Failure Rate (% of deployments causing issues)
- Mean Time to Restore (MTTR)
- Quality metrics
- AI impact on debugging and fixing

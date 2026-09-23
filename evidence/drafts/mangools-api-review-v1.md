# Mangools API / Data Review — Evidence Draft v1

**State:** SOURCE DRAFT
**Hands-on evidence date:** 2026-09-21
**Current API documentation checked:** 2026-09-23

## What we tested before the API review

The prior SelectVerdict frozen test used Mangools Free+ through the product interfaces. KWFinder accepted all 25 frozen keywords. SiteProfiler and LinkMiner completed all four frozen-domain checks. SERPChecker coverage stopped after the first three of six fixed queries because the observed lookup allowance was exhausted. SERPWatcher accepted 25 keywords, but rank values were not available at the final verification poll.

That is useful hands-on product evidence, but it is not evidence of Mangools API performance.

## What Mangools documents now

Mangools publishes an API reference with API-key authentication using the `x-access-token` header and a machine-readable OpenAPI specification. The documentation covers product data and an AI Search Watcher API.

AI Search Watcher is documented for monitoring brand/topic visibility and citations across AI-powered search surfaces, with operations for models, monitors, prompts and settings.

## What remains unknown

Search Data Bench has not authenticated the current account against the Mangools API. We therefore do not claim that the current Free+ account is entitled to every documented API operation, nor do we claim SDB-B01 cost, latency or quota.

## Evidence status

- Prior KWFinder/UI run: VERIFIED HANDS-ON.
- Prior SERPChecker/UI run: VERIFIED HANDS-ON / LIMIT.
- Prior SERPWatcher setup: VERIFIED HANDS-ON; rank output unavailable in window.
- Current API existence/auth scheme: OFFICIAL DOCUMENTED.
- AI Search Watcher API: OFFICIAL DOCUMENTED.
- SDB-B01 API execution: NOT TESTED.
- Exact full affiliate URL: UNKNOWN.

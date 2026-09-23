# SE Ranking API Review — Evidence Draft v1

**State:** SOURCE DRAFT
**Hands-on evidence date:** 2026-09-21
**Provenance:** SelectVerdict Phase 1A frozen test

## What the prior API run actually returned

Under Google / United States / English / Desktop, 25 frozen keywords were submitted to SE Ranking. Twenty-three returned keyword data and two returned explicit no-data responses. All six frozen SERP deep-dives returned ten rows. Rank Tracker accepted all 25 frozen keywords and returned position rows for 24; one remained unavailable after polling.

Competitive/domain and backlink research were also completed for all four frozen domains.

## Execution evidence

The successful GitHub Actions execution recorded 524.734 seconds. API units moved from 100000 to 98980 across the full Step 3 window, a net observed decrease of 1020 units. Exact per-endpoint attribution of that entire delta was not established. Direct monetary cost was $0.

An early burst attempt produced HTTP 429 rate limiting. Later execution used throttling/retries. A separate implementation field-name error was corrected without changing frozen inputs.

## Important boundary

This is real hands-on API evidence, but it came from the SelectVerdict Phase 1A protocol. It is not a completed Search Data Bench SDB-B01 run and cannot be used to claim an identical-workload victory over DataForSEO or Mangools.

## Evidence status

- Prior keyword-data execution: VERIFIED HANDS-ON.
- Prior SERP execution: VERIFIED HANDS-ON.
- Prior rank-tracking execution: VERIFIED HANDS-ON with one unavailable result.
- Prior competitive/backlink execution: VERIFIED HANDS-ON.
- SDB-B01 execution: NOT TESTED.
- Main product plan name in captured evidence: UNKNOWN.

## Commercial disclosure

Verified referral destination: https://seranking.com/?ga=5265149&source=link

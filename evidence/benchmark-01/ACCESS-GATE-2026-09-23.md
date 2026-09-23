# Search Data Bench — Benchmark #1 Access Gate

**Date:** 2026-09-23
**Protocol:** SDB-B01 v1
**Status:** OPEN

| Provider | Account/API evidence | Repository execution state | Benchmark status |
|---|---|---|---|
| DataForSEO | Existing DataForSEO account/API access is evidenced outside this repo; sandbox workflow already prepared. | Search Data Bench runner credentials not yet verified; sandbox PASS not yet recorded. | BLOCKED ON SECURE AUTH CHECK |
| SE Ranking | API was executed successfully in SelectVerdict Phase 1A under its separate frozen protocol. | Search Data Bench has not yet established its own authenticated execution path. | BLOCKED ON ACCESS TRANSFER/CONFIG |
| Mangools | Product hands-on work exists from SelectVerdict Phase 1A. | Exact API entitlement/authenticated API access for Search Data Bench is not yet verified. | UNKNOWN / ACCESS CHECK REQUIRED |

## Rule

Prior success in another repository is evidence that an account/API existed, not permission to copy credentials or to claim a Search Data Bench run. Credentials must remain in secure secret storage and must never be committed, printed in logs, or pasted into evidence files.

## Immediate execution order

1. Complete DataForSEO zero-cost sandbox authentication smoke test already prepared in this repository.
2. Establish SE Ranking authenticated API path without altering SelectVerdict D10 or its frozen evidence.
3. Verify whether the current Mangools account includes usable API access and what endpoints/limits apply.
4. Only after the access gate is resolved, execute SDB-B01 production workloads and retain sanitized evidence.

# Search Data Bench — DataForSEO sandbox integration protocol v1

**Version:** 1.0
**Frozen:** 2026-09-23, before the first sandbox run
**Status:** FROZEN / ACCESS PENDING

## Purpose

Prove that the Search Data Bench workflow can authenticate to DataForSEO and parse one SERP API response without spending money or publishing synthetic data. This is **not** a provider-quality benchmark or a live SERP measurement.

## Fixed input

- Endpoint: `POST https://sandbox.dataforseo.com/v3/serp/google/organic/live/advanced`
- Body: one task only: `{"keyword":"dataforseo api","location_code":2840,"language_code":"en","device":"desktop","depth":10}`
- Auth: DataForSEO API login/password via environment variables in the runner; never user account password, URL parameters, repository files, logs, or workflow inputs.
- Request count: exactly one sandbox POST.
- Cost ceiling: $0. Stop if the host is anything other than `sandbox.dataforseo.com`.

## Evidence and checks

Record run URL, commit SHA, timestamp, HTTP status, top-level and task status codes, result-shape observations, and reported cost. Never print the authorization header, credentials or complete raw response in public logs. Missing credentials are a BLOCKED outcome, not an API product failure.

A PASS requires successful authenticated sandbox response, expected top-level/task success codes, and a parseable task result. Sandbox output contains dummy data by vendor design; no sandbox ranking URL, price, freshness claim, SERP feature, or search volume can be used as live evidence.

## Next distinct stage

Only after this smoke test passes: define a live-data method, independent comparator or evaluation criteria, sampling time/location, actual API price and spending limit, and evidence retention before making any published benchmark claim. The public site remains unchanged during the sandbox stage.

Official references:
- https://docs.dataforseo.com/v3/auth/
- https://docs.dataforseo.com/v3/appendix-sandbox/
- https://docs.dataforseo.com/v3/serp-se-type-live-advanced/

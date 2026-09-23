# Search Data Bench — Benchmark #1 Frozen Protocol

**Protocol:** SDB-B01
**Version:** 1.0
**Frozen:** 2026-09-23
**Status:** FROZEN / ACCESS GATE

## Research question

How do DataForSEO, SE Ranking API and Mangools API differ when asked for the same search-data workloads under the same US/English/Desktop conditions?

This benchmark measures observable API output, coverage, disagreement, latency and reported/request cost. It does not declare an overall winner and does not treat proprietary metrics as equivalent.

## Providers

1. DataForSEO
2. SE Ranking API
3. Mangools API

Tally is out of scope. SerpApi is reserved for a later direct SERP comparison.

## Fixed environment

- Market/location: United States
- Language: English
- Device: Desktop where the provider exposes device choice
- Run window: same execution session where practical; preserve provider timestamps
- Raw responses: retained as evidence, with secrets removed
- Missing/unsupported fields: preserved as missing; never imputed
- Failed/limited calls: preserved as evidence and not silently retried into a clean result

## Frozen workload A — keyword data

Exact keywords:

1. serp api
2. best serp api
3. google serp api
4. seo api
5. best seo api
6. seo data api
7. keyword research api
8. rank tracking api
9. backlink api
10. search data api
11. ai search api
12. ai visibility api
13. ai search visibility
14. ai visibility tools
15. dataforseo api
16. se ranking api
17. mangools api
18. serp data api
19. search volume api
20. keyword data api

Capture only fields actually returned. At minimum attempt: search volume, CPC, paid competition, provider-specific organic difficulty/competition metric, timestamp/update metadata, and request cost where exposed.

## Frozen workload B — SERP deep dives

Exact queries:

1. serp api
2. best serp api
3. seo api
4. keyword research api
5. ai search api
6. dataforseo api

For each provider/API that supports comparable Google organic SERP retrieval, request top 10 organic results under the fixed environment. Preserve rank, URL, domain, title and SERP feature/type metadata when returned.

Do not substitute a web UI result for an unavailable API result.

## Frozen workload C — provider capability/access observation

Record whether the authenticated account exposes, through API, the following without inferring equivalence:

- keyword/search-volume data
- organic SERP data
- rank-tracking data
- backlink data
- AI-search / AI-visibility data
- documented/request-reported price or cost

A documented capability is OFFICIAL DOCUMENTED until executed. Only executed output is VERIFIED HANDS-ON.

## Measurements

For identical workloads calculate only defensible comparisons:

- response success/failure/limit state
- returned-row coverage
- missing-field rate
- top-10 URL/domain overlap for comparable SERPs
- pairwise rank disagreement for shared URLs
- search-volume disagreement for shared keywords
- latency measured by our runner
- actual/reported request cost when observable

Do not average proprietary difficulty metrics across providers. Display them side by side with provider labels only.

## Evidence states

- VERIFIED HANDS-ON
- OFFICIAL DOCUMENTED
- THIRD-PARTY
- NOT TESTED
- UNAVAILABLE / LIMIT
- UNKNOWN

## Stop rules

Stop a provider branch if authentication is unavailable, an unexpected paid operation is required, a rate/plan limit blocks the frozen workload, or the endpoint cannot be mapped to the frozen task without changing the task.

Do not change frozen keywords, SERP queries, market, language, device, or comparison rules after the first production call. Any change requires Benchmark #2 or protocol v2 and an explicit reason.

## Publication boundary

No public benchmark claim is authorized until:
1. provider access is checked;
2. raw/sanitized evidence is retained;
3. the frozen workload has been attempted for all three providers;
4. limitations are recorded;
5. calculations are reproducible;
6. editorial QA separates hands-on evidence from official documentation.

SelectVerdict Phase 1A/D10 is independent and must not be modified by this experiment.

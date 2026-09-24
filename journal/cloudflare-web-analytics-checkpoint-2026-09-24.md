# Cloudflare Web Analytics checkpoint — 2026-09-24

Asset: WF-A002 — searchdatabench.com

## Verified hands-on
Cloudflare dashboard > Analytics > Web Analytics is active for searchdatabench.com.

Observed 24-hour dashboard snapshot on 2026-09-24 (GMT+5):
- Visits: 19
- Page views: 23
- Page load time shown: 286 ms
- Core Web Vitals panels shown as Good for the observed sample.

These are a dashboard snapshot, not an organic-search baseline and not affiliate-click counts.

## Custom event limitation
Cloudflare Web Analytics does not currently support custom events. Therefore existing Search Data Bench browser events (affiliate_click / outbound_click with eventId) cannot be persisted into Cloudflare Web Analytics itself.

Merchant-click persistence remains UNRESOLVED. Do not infer zero clicks from the absence of stored custom-event data.

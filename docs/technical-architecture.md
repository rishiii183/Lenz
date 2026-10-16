# Technical Architecture — ThreatLens

## 1. Status

Proposed architecture for review. Verify current API schemas, quotas, package compatibility, and hosting limits before implementation. No infrastructure or external services should be provisioned until approved.

## 2. High-level design

```text
Cloudflare Radar (or verified alternative)
                 |
                 v
      Backend data collector
       - timeout / retry
       - rate-limit handling
       - response validation
                 |
                 v
      Normalization + cache
       - canonical schema
       - source timestamp
       - fetch timestamp
       - provenance
                 |
           REST API
                 |
                 v
      React + TypeScript UI
       - map / globe
       - KPI cards
       - trend charts
       - freshness / error states
```

For the MVP, REST plus periodic polling is the default. WebSockets should be introduced only if a concrete requirement justifies them; WebSockets do not make upstream data fresher.

## 3. Proposed technology choices

### Frontend
- React + TypeScript + Vite.
- Tailwind CSS for styling.
- `globe.gl` / Three.js for globe rendering, after checking library docs, license, accessibility, and performance.
- Recharts for conventional charts, unless research shows a better fit.

### Backend
- Python + FastAPI.
- Pydantic models for validated response contracts.
- Async HTTP client such as HTTPX, selected after dependency review.
- In-memory TTL cache initially; add Redis only if multiple instances, rate-limit coordination, or other demonstrated needs require it.

### Persistence
- No database required by default for the first snapshot-based MVP.
- Add PostgreSQL only if the product needs persisted historical snapshots, user accounts, saved filters, or replay data.
- Do not add TimescaleDB until query volume and time-series requirements justify it.

### Deployment
- Static frontend hosting such as Vercel.
- Separate Python backend host with environment-variable support.
- Confirm current free-tier, sleep, networking, and persistent-process limitations before selecting a provider.
- Never assume local development settings work unchanged in production.

## 4. Backend responsibilities

1. Fetch source data from a documented endpoint.
2. Apply explicit request timeout and bounded retry/backoff.
3. Validate the upstream response; do not silently coerce invalid values.
4. Normalize data to a stable internal schema.
5. Cache responses according to the source's update cadence and API policy.
6. expose health and data-status information without leaking secrets.
7. Return source observation time, retrieval time, source name, units, and aggregation interval where available.
8. Log errors safely without tokens or sensitive headers.

## 5. Suggested internal data contract

This is an application-owned example schema, not a claim about the provider's raw response:

```json
{
  "source": "cloudflare_radar",
  "dataset": "network_layer_ddos_timeseries",
  "metric": "provider_defined_metric",
  "value": null,
  "unit": "provider_defined_unit",
  "period_start": null,
  "period_end": null,
  "aggregation_interval": null,
  "retrieved_at": null,
  "is_simulated": false,
  "source_url": "https://developers.cloudflare.com/radar/"
}
```

Use explicit nulls or omit unavailable fields. Do not invent units, values, timestamps, or geographic coordinates. Actual schema must be derived from a verified API response.

## 6. Frontend responsibilities

- Request normalized data from the backend.
- Render loading, success, stale, empty, and error states.
- Display source and observation window.
- Render geographic marks only for locations supported by the source.
- Avoid drawing an origin-to-destination arc unless that relationship is actually present in data.
- Keep synthetic visuals in a separately labelled demo layer.
- Respect reduced-motion preferences and avoid unnecessary GPU-heavy effects.

## 7. Security and reliability

- Keep API tokens in backend environment variables or the hosting provider's secret store.
- Add `.env` to `.gitignore` and commit `.env.example` only with placeholder values.
- Validate all incoming query parameters.
- Limit response size and request frequency.
- Use safe CORS configuration for the deployed frontend origin.
- Do not expose upstream stack traces to clients.
- Use dependency pinning/lockfiles and basic automated tests.
- Avoid authentication unless the MVP introduces user-specific or sensitive capabilities.

## 8. API endpoint proposal

- `GET /api/health` — application health only.
- `GET /api/threats/summary` — latest normalized summary.
- `GET /api/threats/timeseries?range=...` — supported time-series view.
- `GET /api/threats/regions` — geographic aggregation only if source supports it.
- `GET /api/data-status` — source, observation window, retrieval time, stale status.

These are proposed internal endpoints; final names and schemas can be adjusted after research.

## 9. Data lifecycle

- Fetch on a backend schedule or on-demand with cache protection.
- Store the latest valid result in cache.
- Track `observed_period` separately from `retrieved_at`.
- When upstream data has not changed, do not manufacture new events.
- When the source fails, serve the last valid response with an explicit stale flag if appropriate.
- Invalidate or replace cached data only after successful validation.

## 10. Architecture decisions to confirm

- Which Radar endpoint and metrics are actually available for the intended use.
- Whether a key/token is required for the selected endpoint and what permissions apply.
- Current quotas and acceptable polling cadence.
- Whether region-level data is available in a form suitable for mapping.
- Whether database persistence is needed in the MVP.
- Hosting provider and deployment costs/limits.

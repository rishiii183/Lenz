# Research Log — ThreatLens

## Purpose

Record official documentation, verify API capabilities, and capture decisions before implementation. Research claims must be tied to the source that supports them. If a feature cannot be supported by verified data, mark it as unknown or out of scope rather than guessing.

## 1. Initial sources

### Cloudflare Radar
- Main docs: https://developers.cloudflare.com/radar/
- API reference: https://developers.cloudflare.com/api/resources/radar/
- Network-layer attacks: https://developers.cloudflare.com/radar/investigate/network-layer-attacks/
- Application-layer attacks: https://developers.cloudflare.com/radar/investigate/application-layer-attacks/

Initial understanding to verify during implementation planning:
- Radar provides aggregated network-layer and application-layer DDoS datasets and time-series endpoints.
- Aggregated datasets must not be described as a universal second-by-second stream of individual attacks.
- A geographic statistic does not automatically establish a factual attacker-to-victim route.
- Endpoint schema, query parameters, authentication requirements, quotas, retention, granularity, and geographic meaning must be checked in the current docs.

### Google Antigravity
- Rules: https://antigravity.google/docs/rules/
- Projects: https://antigravity.google/docs/projects/
- Agent overview: https://antigravity.google/docs/agent/

Initial understanding:
- Antigravity supports persistent project instructions, including `AGENTS.md`, `GEMINI.md`, and `.agents/rules/*.md` in supported project/workspace contexts.
- Verify the current app/workspace behavior in the installed Antigravity version.

### General coding-agent instructions
- GitHub Copilot agent best practices: https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/best-practices-for-using-copilot-to-work-on-tasks
- VS Code agent instructions: https://github.com/microsoft/vscode-docs/blob/main/docs/agent-customization/custom-instructions.md

These are supplementary references for instruction-file practices, not substitutes for Antigravity-specific documentation.

## 2. Required research before implementation

The agent should use web search/browser research to answer each item and record source URLs plus date checked.

- [ ] Identify the exact Cloudflare Radar endpoint suitable for an MVP summary.
- [ ] Identify the exact time-series endpoint and valid query parameters.
- [ ] Confirm authentication and token scopes for the chosen endpoints.
- [ ] Inspect a sample response and document real field names, units, nullability, and timestamps.
- [ ] Confirm source update cadence, aggregation intervals, and rate limits.
- [ ] Determine which geographic breakdowns are supported and what they mean.
- [ ] Confirm whether any endpoint actually provides paired source/target geography; do not infer this.
- [ ] Check the license/terms for any map tiles, basemaps, and visualization libraries.
- [ ] Check current React, Vite, Tailwind, globe.gl/Three.js, Recharts, FastAPI, Pydantic and HTTPX documentation for installation and compatibility.
- [ ] Check deployment platform limits, environment variable configuration, and backend process behavior.
- [ ] Choose cache strategy based on upstream cadence and rate limits.
- [ ] Record all decisions and unresolved risks before asking the user to approve implementation.

## 3. Open-source/library review

Review primary project pages and repositories; do not add dependencies merely because they are popular.

- globe.gl: https://github.com/vasturiano/globe.gl
- Three.js: https://github.com/mrdoob/three.js
- Recharts: https://github.com/recharts/recharts
- FastAPI: https://github.com/fastapi/fastapi
- Pydantic: https://github.com/pydantic/pydantic
- HTTPX: https://github.com/encode/httpx
- Vite: https://github.com/vitejs/vite
- Tailwind CSS: https://github.com/tailwindlabs/tailwindcss

For each selected dependency, record why it is needed, license, current maintenance/activity signals, bundle/runtime implications, and whether a simpler alternative is sufficient.

## 4. Build now vs. use later

### Build in MVP
- Core map/globe and dashboard layout.
- One verified real DDoS dataset.
- Normalized backend response and caching.
- Trend visualization supported by the endpoint.
- Freshness, provenance, loading/error states.
- Explicitly labelled optional simulation layer.
- Tests and local/deployment documentation.

### Use later, after MVP validation
- AI analyst.
- Explainable anomaly detection.
- Historical replay.
- Threat correlation graph.
- Authorized monitoring of user-owned infrastructure.
- Redis, PostgreSQL/TimescaleDB, WebSockets, queue workers, or other infrastructure unless an MVP requirement justifies them.

## 5. Decision log

| Decision | Current status | Rationale / next step |
|---|---|---|
| Cloudflare Radar as initial source | Proposed | Verify current endpoint, schema, access and limits |
| Aggregated data is not individual live events | Fixed product constraint | Avoid misleading representation |
| React + TypeScript + Vite | Proposed | Confirm current compatibility |
| FastAPI backend | Proposed | Keep secrets server-side and normalize data |
| REST + polling first | Proposed | Simpler than WebSockets for periodic aggregates |
| No database initially | Proposed | Add persistence only if the MVP needs it |
| Advanced differentiators deferred | Fixed scope decision | Finish a trustworthy basic product first |

## 6. Research output format

For every finding, record:
- Question.
- Answer in your own words.
- Direct source URL.
- Date checked.
- Impact on product/architecture.
- Confidence or unresolved caveat.

Do not mark an item verified based on a search snippet alone when the exact API docs or response schema can be inspected.

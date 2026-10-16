# Project Context — ThreatLens

## 1. Working name

**ThreatLens** (working name; branding can be changed later).

## 2. Product vision

Build a polished, interactive cybersecurity dashboard that visualizes global DDoS threat intelligence and explains what the available data actually represents. The first release is a strong portfolio-ready MVP. Advanced differentiators are deliberately deferred until the basic product works.

## 3. Primary user

A visitor, recruiter, or hackathon judge who wants to explore global DDoS trends through an interactive map and clear analytics.

## 4. MVP in scope

- Dark, responsive dashboard UI.
- Interactive globe or map with geographic visualizations only where the underlying data supports them.
- KPI cards for metrics genuinely returned by the selected data source.
- DDoS trend chart over a supported time range.
- Protocol/category breakdown when supported by the chosen endpoint.
- Recent-data/status panel with source, observation period, and last successful retrieval time.
- Backend integration with Cloudflare Radar or another verified source selected after research.
- Loading, empty, stale-data, API-error, and rate-limit states.
- A documented simulation mode for development/demo use; simulated data must be visibly labelled and never represented as real incidents.
- README, setup instructions, basic tests, and deployment configuration.

## 5. Explicitly out of scope for MVP

- Claiming to detect every DDoS attack worldwide.
- Claiming a global second-by-second stream of individual attacks when the provider exposes aggregated statistics.
- Drawing factual origin-to-target attack arcs unless the source actually supplies a defensible source/target relationship.
- AI threat analyst, anomaly detection, historical replay, threat correlation graph, and personal website exposure monitoring. These are candidate post-MVP features.
- Offensive tooling, attack generation, scanning of third-party targets, or DDoS execution.

## 6. Current technology direction (verify before locking)

- Frontend: React + TypeScript + Vite.
- Styling: Tailwind CSS.
- Globe: `globe.gl` / Three.js, subject to compatibility and bundle/performance review.
- Charts: Recharts or another small, well-supported charting library.
- Backend: Python + FastAPI.
- Live client updates: start with REST and polling; add WebSockets only if they provide real value for the MVP.
- Storage: start without a database if cached snapshots and source data are sufficient; add PostgreSQL only when history/persistence is required.
- Hosting: frontend on Vercel or another suitable static host; backend on a host that supports the required Python runtime and long-running requests. Confirm current platform limits before choosing.

These are proposed defaults, not permission to install packages or deploy. Research and document any material change.

## 7. Data integrity principles

1. Every metric must identify its source and observation period.
2. Show the last successful fetch time separately from the observation period.
3. Do not label a dashboard as "live" in a way that implies fresher data than the provider supplies.
4. Distinguish source-provided observations, derived calculations, and synthetic demo events.
5. Never fabricate source/target locations or imply that country-level aggregates identify an individual attacker.
6. Handle missing or stale data honestly rather than filling gaps with invented real-looking events.

## 8. Decision log

- Start with the basic product; defer differentiating features until the MVP is stable.
- Prefer a small, understandable architecture over premature distributed infrastructure.
- Keep API secrets on the backend in environment variables.
- No coding until the user approves the plan after research and architecture review.

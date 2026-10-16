# Product Requirements Document (PRD)

## 1. Summary

ThreatLens is a web-based DDoS threat-intelligence visualization dashboard. It combines an interactive geographic visualization with real aggregated DDoS statistics, trends, and transparent data-freshness indicators.

## 2. Problem statement

Cyberattack maps can look impressive but often obscure where the data comes from, whether a displayed event is real, and how current the data is. ThreatLens should make global DDoS trends easier to explore without overstating the precision or real-time nature of available data.

## 3. Goals

- Make aggregated DDoS trends understandable at a glance.
- Provide an attractive, responsive, interactive map experience.
- Explain data source, time range, freshness, and limitations.
- Keep the MVP feasible for a solo developer using an AI coding agent.
- Establish a clean base that can later support replay, anomaly detection, AI explanations, or website telemetry.

## 4. Non-goals

- Comprehensive detection of all global attacks.
- Guaranteed per-second event stream.
- Attribution of attacks to a real-world person or exact attacker location.
- DDoS testing or attack execution.
- Enterprise-grade multi-tenant SOC functionality in the first release.

## 5. Target audience and primary user story

**User story:** As a visitor, I want to explore DDoS trends on a map and in charts so that I can understand broad patterns and see exactly when and where the underlying data came from.

## 6. Functional requirements

### FR-1: Dashboard overview
Display a clear title, data-source status, observation period, last successful fetch time, and a small number of useful metric cards. Only display metrics supported by the chosen endpoint.

### FR-2: Geographic visualization
Render the geographic breakdown supported by the data source. Clicking a supported region may reveal its metric and observation period. Do not infer origin-to-target routes from unrelated aggregate metrics.

### FR-3: Trend analytics
Display a time-series chart for a documented metric and selected time range. Clearly label units and aggregation interval. If the API does not return a requested metric, omit it rather than inventing a value.

### FR-4: Data provenance
Provide a visible data-source label and a short explanation of what the data means. Include a link to the source documentation.

### FR-5: Freshness and failure states
Show loading, no-data, stale-data, rate-limited, and provider-error states. Keep the last valid snapshot if appropriate, but label it stale.

### FR-6: Simulation mode
If a visual demo needs synthetic arcs/events, provide an unmistakable "SIMULATED DEMO DATA" label and visually distinguish these elements from source-backed data. Simulation must be off or clearly separated in the normal real-data view.

### FR-7: Responsive and accessible UI
Support desktop and mobile layouts, keyboard access for controls, legible contrast, and reduced-motion preferences where feasible.

### FR-8: Configuration
Read provider credentials from backend environment variables. Never expose API tokens in frontend bundles, public responses, logs, or committed files.

## 7. Non-functional requirements

- Maintainable component boundaries and typed API contracts.
- Basic unit tests for data normalization and error handling.
- No secret values committed to source control.
- Sensible API timeout, retry/backoff, and caching behavior.
- Graceful behavior when the upstream source is unavailable.
- Clear local development and deployment documentation.
- Do not add heavy infrastructure without a demonstrated MVP need.

## 8. MVP acceptance criteria

The MVP is acceptable when:
1. A developer can run the frontend and backend using documented steps.
2. The dashboard loads and renders a verified API response or a clearly labelled demo fixture.
3. At least one real DDoS statistic is displayed with source and observation-period context, once API access is configured.
4. Unsupported metrics/locations are not fabricated.
5. Provider errors and stale data are visibly handled.
6. API credentials remain backend-only.
7. Core normalization and UI-state behavior have tests.
8. The application builds successfully and the README describes known limitations.
9. The user has reviewed the finished implementation before any production deployment.

## 9. Success measures

- A first-time visitor can identify the data source and freshness within 10 seconds.
- No simulated item can be mistaken for a verified real incident.
- A new developer can start the app by following the README.
- The dashboard remains usable when the upstream API is unavailable.

## 10. Post-MVP candidates (not committed scope)

- Historical timeline replay.
- Explainable anomaly detection.
- AI analyst grounded in source data.
- Threat correlation graph.
- Authorized monitoring of a user's own website telemetry.

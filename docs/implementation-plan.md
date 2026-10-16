# Implementation Plan — ThreatLens

## Current status

Planning only. Do not code until the user approves the researched plan and architecture.

## Phase 0 — Research and approval

Deliverables:
- Verify the data provider, endpoint, schema, access requirements, aggregation cadence, and geographic meaning.
- Check selected library docs, licenses, compatibility, and deployment limits.
- Update `research.md` with source URLs and dated findings.
- Resolve architecture decisions and update `technical-architecture.md`.
- Present concise trade-offs and ask for approval.

Exit criteria: user explicitly approves the MVP plan.

## Phase 1 — Project skeleton

- Create frontend and backend folders.
- Add dependency manifests and lockfiles.
- Add `.gitignore`, `.env.example`, and setup instructions.
- Add minimal health endpoint and frontend shell.
- Confirm both run locally.

Exit criteria: reproducible local setup with no real credentials required.

## Phase 2 — Dashboard with typed fixtures

- Build the responsive dashboard layout.
- Create typed internal data contracts.
- Add metric cards, trend chart, map component, source status, loading/empty/error states.
- Use clearly labelled fixture data during UI development.

Exit criteria: visual flow works without implying fixtures are real.

## Phase 3 — Real data integration

- Implement the verified upstream client.
- Validate and normalize actual API responses.
- Add timeout, retry/backoff, caching, and safe error handling.
- Add tests for response normalization and invalid/missing data.
- Show source, observation period, retrieval time, and stale status.

Exit criteria: at least one real metric renders correctly when credentials/access are configured; tests cover failure paths.

## Phase 4 — Geographic visualization

- Use only verified geographic dimensions.
- Add map interactions and region details where supported.
- Add an optional simulation layer only if needed and label it persistently.
- Respect reduced motion and test performance.

Exit criteria: no fabricated routes or ambiguous real/simulated events.

## Phase 5 — Verification and deployment

- Run formatter, lint, type checks, unit tests, and production builds.
- Test API timeout, rate-limit, stale-data, and no-data behavior.
- Audit for secret leakage and overly permissive CORS.
- Document environment variables and deployment steps.
- Deploy only after the user reviews and approves the target platform/action.

Exit criteria: working public demo, setup guide, known limitations, and user-reviewed deployment.

## Phase 6 — Post-MVP prioritization

Only after MVP acceptance, evaluate:
1. Historical replay.
2. Explainable anomaly detection.
3. AI analyst grounded in data.
4. Threat correlation graph.
5. Authorized own-site telemetry.

Select at most one advanced feature first based on user value, data availability, and implementation cost.

## Definition of done for every task

- Scope is limited to the approved task.
- Tests or appropriate verification are run.
- No secrets are added.
- Source-backed facts remain distinguishable from simulations.
- Changed files and decisions are summarized.
- Known limitations and failed checks are reported honestly.

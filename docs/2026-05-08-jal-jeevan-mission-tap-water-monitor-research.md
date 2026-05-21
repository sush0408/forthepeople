# District Jal Jeevan Mission Tap-Water Coverage Monitor

Date: 2026-05-08

## Feature name and user value

Feature: District Jal Jeevan Mission (JJM) tap-water coverage monitor

User value:
- Citizens can see whether rural households in their district are getting Functional Household Tap Connections (FHTCs) without navigating multiple government dashboards.
- The feature fits ForThePeople’s district shell because it is a public-service coverage metric, not a beneficiary lookup.
- It can complement existing water and infrastructure modules with a simple coverage + freshness story.

## Source URLs

- [JJM public dashboard](https://ejalshakti.gov.in/JJMreport/)
- [Jal Jeevan Mission portal](https://jaljeevanmission.gov.in/)
- [OGD India catalog resource: district-wise number of villages and households in Karnataka provided tap water connections](https://www.data.gov.in/resource/district-wise-number-villages-and-households-karnataka-provided-tap-water-connections)
- [Government Open Data License - India](https://www.data.gov.in/)

## Licensing and access notes

- `data.gov.in` resources are published through the Government Open Data platform and are generally intended for public reuse under the Government Open Data License - India.
- The JJM public dashboard is openly viewable without login, but dashboard scraping should still be treated as operationally fragile unless a stable export/API is confirmed.
- State-specific or district-specific extracts on OGD appear easier to operationalize than scraping the full national dashboard first.

## Update frequency

- The JJM dashboard appears to be updated frequently and is framed as an operational progress dashboard rather than a one-time report.
- OGD dataset exports may lag the live dashboard and may be refreshed on a state-driven or periodic basis rather than on a daily cadence.
- Practical product assumption:
  dashboard-backed freshness can be near-daily,
  OGD import freshness may be weekly or less predictable depending on the resource.

## District and state granularity

- State granularity is clearly available in the public dashboard.
- District granularity is available, but not always through one uniform national bulk export.
- At least some OGD resources expose district-wise records for a specific state, which makes a state-by-state rollout realistic.
- Village-level and scheme-detail drilldowns exist in parts of the JJM reporting ecosystem, but they should be treated as optional follow-on scope.

## Available data fields

Likely usable fields across dashboard + OGD extracts:
- state name
- district name
- number of villages
- total rural households
- households with tap-water connections / FHTCs
- coverage percentage
- fully covered / partially covered status indicators where available
- reporting / snapshot date or freshness indicator when exposed

Potential follow-on fields if a stable district drilldown is found:
- water-quality affected habitations
- schools / anganwadis with tap-water availability
- source sustainability / greywater management progress

## Data quality concerns

- District naming and slug alignment will require alias handling across OGD exports, JJM dashboard labels, and ForThePeople district config.
- Household denominators may shift over time, so percentage changes can reflect both new connections and revised baselines.
- National and state dashboard views may not expose identical fields, which creates uneven rollout quality across states.
- Some states may publish cleaner district exports than others, so a nationwide promise should not be made until multi-state imports are validated.

## Implementation risks

- The main risk is transport instability: dashboard HTML or internal endpoints may change without notice.
- OGD resources may be state-specific instead of national, which means rollout is more operationally complex but still realistic.
- “Coverage” is a public progress metric, not a guarantee of daily water service quality; UI copy must avoid overstating what the source proves.
- Freshness needs to be honest per source. If a district snapshot is old, the card should say that explicitly instead of implying live telemetry.

## Privacy and legal concerns

- The candidate sources are aggregate public-service coverage metrics, so privacy risk is low if the product stays at district or higher aggregation.
- Do not ingest household-level beneficiary or address-level records even if some drilldown surfaces expose them.
- Keep source attribution visible because users may otherwise assume the app is generating these values itself.

## Split implementation tasks

1. Data model
- Add `jjmCoverageSnapshot` rows keyed by `stateSlug`, `districtSlug`, `snapshotDate`, and `sourceKey`.
- Store raw numerator, denominator, computed percentage, granularity, and source URL.

2. Scraper / import / API
- Start with one stable state-level OGD district export plus a dashboard freshness probe.
- Normalize district aliases against ForThePeople config.
- Expose `/api/data/jjm` with aggregate coverage values and explicit freshness metadata.

3. UI surface
- Add a rural water-access card in the water or infrastructure surface.
- Show total rural households, connected households, coverage percentage, and source freshness.
- Use careful copy such as “tap-water connection coverage” instead of “daily water supply”.

4. Tests
- Cover district alias joins, denominator changes, stale snapshots, zero-household edge cases, and local-empty fallback behavior.
- Add rendering tests for honest stale/fallback copy.

5. Rollout / backfill
- Pilot Karnataka first if the OGD extract remains usable.
- Expand state-by-state only after validating district joins and refresh cadence across at least two non-Karnataka states.

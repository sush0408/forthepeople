# District Rural Housing Progress Monitor Research

## Feature name and user value

- Feature: District Rural Housing Progress Monitor
- User value: citizens can inspect how PMAY-G rural housing delivery is moving in their district instead of relying on statewide headline claims or beneficiary-search flows.

## Source URLs

- PMAY-G official portal: [https://pmayg.dord.gov.in/netiayHome/Home.aspx](https://pmayg.dord.gov.in/netiayHome/Home.aspx)
- PMAY-G reporting portal entrypoint: [https://report.pmayg.dord.gov.in](https://report.pmayg.dord.gov.in)
- OGD catalog for PMAY-G: [https://www.data.gov.in/catalog/pradhan-mantri-awaas-yojana-gramin](https://www.data.gov.in/catalog/pradhan-mantri-awaas-yojana-gramin)
- PIB launch note for the public dashboard: [https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1800355](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1800355)

## Licensing and access notes

- The OGD catalog lists PMAY-G under NDSAP/GODL India on data.gov.in, which is suitable for documented reuse of published datasets and metadata.
- The public PMAY-G dashboard and reporting portal are openly reachable without login for aggregate views, but I did not find an explicit machine-readable API contract or a separate reuse license on the dashboard itself.
- Recommendation: treat dashboard scraping as operationally allowed for public aggregate pages but keep the implementation behind a source adapter that can fall back to OGD exports when available.

## Update frequency

- The PMAY-G homepage exposed an "As on: 04/05/2026" stamp on the live counters when checked on May 5, 2026.
- Inference: this looks like an actively refreshed operational MIS, probably at least daily and possibly more often for aggregate counters.
- Product recommendation: do not promise "live" copy until we confirm the actual district report cadence from the reporting portal.

## District and state granularity

- State-level totals are public on the main dashboard.
- District-level reporting is the target fit for ForThePeople.
- The PIB launch note says the dashboard is drillable down to block level, which suggests district and sub-district operational cuts exist in the reporting stack.
- Important boundary: PMAY-G is rural-only, so urban districts with mostly PMAY-U relevance need copy that makes the scheme scope explicit.

## Available data fields

- Aggregate targets
- Registered households
- Sanctioned houses
- Completed houses
- Funds transferred
- Phase and year-wise completion progress
- Likely district/block drilldowns for physical and financial progress from the reporting portal

## Data quality concerns

- Rural-only scope can be misunderstood as full district housing coverage if the UI is not explicit.
- District naming and legacy spellings may differ from ForThePeople slugs and from other datasets.
- Reporting may lag field reality because PMAY-G depends on operational updates in AwaasSoft/AwaasApp.
- Public beneficiary-search surfaces may expose person-level data, but those should not be part of this feature.

## Implementation risks

- The public dashboard appears HTML-first; scraper reliability may depend on brittle report parameters or form posts.
- No documented public API was identified in this pass.
- Some useful figures may exist only at state/block cuts or in year-specific tables, so district feature scope should be validated before UI promises trend depth.
- Phase-I, Phase-II, and cumulative views need a clear normalization strategy so the UI does not mix incomparable totals.

## Privacy and legal concerns

- Avoid ingesting person-level beneficiary records, registration numbers, Aadhaar-linked flows, or grievance/status-search data.
- Restrict the feature to district aggregate metrics and source links.
- Preserve source attribution and scheme-scope labeling so users do not interpret PMAY-G as a universal housing census.

## Split implementation tasks

1. Data model
   Add rural-housing snapshot tables keyed by state, district, scheme phase, report date, and source metadata for sanctioned/completed/registered/funds metrics.
2. Scraper/import/API
   Prototype a PMAY-G report ingestor from the public reporting portal, normalize district aliases, and expose `/api/data/rural-housing`.
3. UI surface
   Add a rural-housing progress card with scheme-scope labeling, sanctioned vs completed counts, funds transferred, and freshness/source details.
4. Tests
   Cover district alias joins, phase normalization, missing report dates, rural-only copy, and empty local fallback behavior.
5. Rollout/backfill
   Pilot one state with stable district joins, verify phase math, then expand only after district coverage and cadence are confirmed.

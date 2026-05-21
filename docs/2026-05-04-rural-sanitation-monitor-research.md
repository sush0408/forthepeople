# District Rural Sanitation Coverage Monitor

## Feature name and user value

- Feature: District Rural Sanitation Coverage Monitor
- User value: citizens can quickly see whether rural toilet coverage, household sanitation progress, and district-level Swachh Bharat reporting are improving without digging through ministry dashboards.

## Source URLs

- OGD catalog: [Daily data on Rural Sanitation Coverage under Swachh Bharat Mission](https://www.data.gov.in/catalog/daily-data-rural-sanitation-coverage-under-swachh-bharat-mission)
- OGD district resource: [District-wise Coverage of Individual Household Latrine (IHHL) as on date](https://www.data.gov.in/resource/district-wise-coverage-individual-household-latrine-ihhl-date)
- Official mission site: [Swachh Bharat Mission - Grameen](https://www.swachhbharatmission.ddws.gov.in/index.php/)
- Official FAQ / monitoring notes: [SBM-G FAQ](https://swachhbharatmission.ddws.gov.in/faq)

## Licensing and access notes

- The OGD catalog is published on `data.gov.in` under the Government Open Data License - India / NDSAP.
- Access appears public via web download and catalog APIs. No paid credentialing is indicated on the catalog page.
- The official SBM-G site is public and useful as a secondary source for program context and monitoring language.

## Update frequency

- The catalog describes the sanitation coverage dataset as daily.
- The FAQ says monitoring is maintained online with district and GP level updates; monthly household progress is also monitored.
- Practical implementation assumption: treat district records as near-daily administrative data, but expect irregular refresh cadence by state.

## District and state granularity

- State: yes
- District: yes
- Block: available in the broader catalog
- Gram Panchayat: available in the broader catalog
- Urban coverage: no, this source is for SBM-G / rural sanitation only

## Available data fields

- Confirmed from the catalog and resource labels:
  - state
  - district
  - IHHL / rural toilet coverage context
  - target vs achievement framing
- Likely available district fields, inferred from the catalog family and related resource labels:
  - total rural households in scope
  - households with toilets / IHHL achieved
  - coverage percentage
  - reporting date or snapshot date
- Implementation note: field names should be validated against the actual CSV/API payload before schema lock.

## Data quality concerns

- Rural-only coverage can be misread as whole-district sanitation unless the UI labels it clearly.
- District names may use legacy spellings or state-specific naming variants, so alias normalization will be required.
- Administrative dashboards can show optimistic coverage figures and may lag field reality.
- Different states may update at different cadences, so freshness should be shown explicitly per district.
- ODF / ODF Plus claims are programmatic status indicators, not direct real-time service quality measurements.

## Implementation risks

- District name joins may be noisy when matching SBM-G names to existing district slugs.
- The public resource pages do not fully expose schema details in search snippets, so importer work should begin with sample payload inspection.
- Coverage may be very high or saturated in many districts, which reduces chart variety unless complemented with trend or block/GP drilldown.
- Because the source is rural-only, mixed or highly urban districts need a guardrail copy path instead of blanket district claims.

## Privacy and legal concerns

- The OGD resource is aggregated administrative data and appears low-risk from a privacy standpoint.
- Avoid displaying beneficiary-level or household-level identifiers even if deeper portal exports expose them.
- Preserve source attribution and license references in any derived API/UI surface.

## Split implementation tasks

1. Data model
   - Add a `sanitationCoverageSnapshot` model keyed by state slug, district slug, snapshot date, and source.
   - Store rural coverage percentage, rural households in scope, toilet/IHHL count, and source metadata.
2. Scraper / import / API
   - Pull the district resource or catalog export from OGD, normalize district aliases, and expose `/api/data/sanitation`.
   - Add stale-data handling for districts with missing or delayed updates.
3. UI surface
   - Add a rural sanitation card under `gram-panchayat`, `health`, or a dedicated sanitation/support module surface.
   - Label it clearly as rural-only and show freshness, coverage percentage, and trend direction.
4. Tests
   - Cover district alias normalization, rural-only labeling, missing freshness timestamps, saturated 100% coverage states, and empty local-DB fallback behavior.
5. Rollout / backfill
   - Pilot Karnataka first, validate district joins, then expand nationally.
   - Consider optional block/GP drilldowns only after district-level ingestion is stable.

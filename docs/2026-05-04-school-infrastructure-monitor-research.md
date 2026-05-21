# District School Infrastructure Monitor research

## Feature name and user value

**Feature:** District School Infrastructure Monitor

**Why it matters:** Citizens, parents, journalists, and local volunteers could see whether a district's schools have basic facilities such as toilets, drinking water, electricity, ramps, computers, and internet access without hunting through annual education PDFs. This fits the existing `schools` module and gives users a concrete way to compare school-access basics against public claims.

## Source URLs

- UDISE+ reporting portal: [https://udiseplus.gov.in/udisereport/](https://udiseplus.gov.in/udisereport/)
- UDISE+ 2023-24 official report PDF: [https://dashboard.udiseplus.gov.in/report-new-v.6-demo2025/static/media/UDISE%2B2023_24_Booklet_existing.309eabf9e4889db93bcb.pdf](https://dashboard.udiseplus.gov.in/report-new-v.6-demo2025/static/media/UDISE%2B2023_24_Booklet_existing.309eabf9e4889db93bcb.pdf)
- Example district-level OGD dataset: [https://www.data.gov.in/resource/number-schools-availability-infrastructure-and-facilities-school-management-and-1253](https://www.data.gov.in/resource/number-schools-availability-infrastructure-and-facilities-school-management-and-1253)

## Licensing and access notes

- The district-level OGD resources are published on data.gov.in under the Government of India's open-data framework. Search results for these UDISE+ resources explicitly show release under **NDSAP / Government Open Data** terms.
- The UDISE+ reporting portal is official, but its report module is login-gated and appears intended for school and block/district MIS users. That makes it a poor first-choice runtime source for public scraping.
- Practical access pattern:
  - prefer open data.gov.in district CSV/ZIP resources where available
  - use official UDISE+ annual PDFs as reference/verification
  - avoid building a scraper that depends on authenticated report pages

## Update frequency

- UDISE+ is fundamentally an **annual** education dataset keyed to academic years.
- The 2023-24 official report was available publicly in 2026 search results, but the district-level OGD entries surfaced here were published/updated around late 2021 to early 2022 and still point to older academic years.
- Recommendation: treat V1 as **annual snapshot data**, not live data.

## District and state granularity

- District granularity is available in the OGD resources; search results show fields including `District_Code` and `District_Name`.
- State granularity is available in both the OGD rows and the UDISE+ annual report.
- School-level and block-level data may exist inside UDISE+ workflows, but the public/open ingestion path confirmed in this run is district-oriented OGD plus state/national report summaries.

## Available data fields

Confirmed from the OGD metadata/search results:

- `Academic_Year`
- `State_Code`
- `State_Name`
- `District_Code`
- `District_Name`

Strongly indicated by the resource family and title:

- school management
- school category
- counts of schools by infrastructure/facility availability

Likely user-facing indicators for a first pass:

- schools with girls' toilets
- schools with drinking water
- schools with electricity
- schools with ramps / CWSN accessibility
- schools with computers
- schools with internet
- school counts split by management/category where helpful

## Data quality concerns

- OGD district resources discovered in this run look **old and fragmented** by district and year, not like one clean current national table.
- Public UDISE+ reporting appears to have moved toward newer annual PDFs and authenticated report flows, so the freshest district data may not be uniformly exposed as easy public CSV.
- The 2023-24 report notes methodology changes after NEP 2020 and explicitly warns that some indicators are not strictly comparable with older years.
- Responsibility for submitted data rests with school / cluster / block / district / state nodal officers, so data quality is official but not audit-clean.
- District naming and state reorganization aliasing will need normalization before backfill.

## Implementation risks

- Highest risk: locating a stable, programmatic, public district-level source for the latest academic year.
- OGD may require district-by-district harvesting and may not cover all current districts cleanly.
- UDISE+ PDFs are authoritative but awkward for structured district ingestion.
- Some districts in ForThePeople use modern slugs while older UDISE/OGD assets may use legacy district names or pre-bifurcation boundaries.
- Because this is annual data, freshness messaging must avoid implying real-time monitoring.

## Privacy and legal concerns

- The proposed feature should stay at district aggregate level only.
- Avoid ingesting student-wise or school-contact personally identifiable information, even if exposed elsewhere in UDISE workflows.
- Annual aggregate infrastructure counts are low-risk public-interest data, but any authenticated scraping path should be avoided unless the terms clearly permit it.

## Split implementation tasks

1. **Data model**
   - Add an annual district school-infrastructure snapshot model keyed by `stateSlug`, `districtSlug`, `academicYear`, and source version.
   - Store facility counts plus optional percentages and source metadata.

2. **Scraper / import / API**
   - Prototype a district-level importer from data.gov.in UDISE+ CSV/ZIP assets.
   - Add district-name alias mapping and academic-year normalization.
   - Expose a `/api/data/schools` enrichment/fallback path that can return annual infra metrics even when live DB data is thin.

3. **UI surface**
   - Start inside the existing `schools` page with a compact “Infrastructure basics” card.
   - Show annual snapshot labels, source note, academic year, and a low-noise facility checklist/bar chart.

4. **Tests**
   - Parser tests for district/resource-name normalization.
   - API fallback tests for empty DB and stale annual snapshots.
   - UI tests for annual freshness wording and missing-field handling.

5. **Rollout / backfill**
   - Pilot with Karnataka districts already live in the app.
   - Backfill state by state only after confirming coverage and alias quality.
   - Keep unsupported districts in a graceful “annual school infrastructure data not mapped yet” state.

## Recommendation

This is a good backlog item for the `schools` surface, but it should be framed as an **annual district infrastructure snapshot**, not a live monitor. The open-data path looks useful enough for a pilot, but not clean enough yet to promise all-India completeness without an aliasing and coverage audit first.

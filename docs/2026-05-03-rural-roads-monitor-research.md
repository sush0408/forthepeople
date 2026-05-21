# District Rural Roads Monitor Research

Date: 2026-05-03

## Feature name and user value

**Feature:** District Rural Roads Monitor

**User value:** Let citizens see how much PMGSY rural-road work has been
sanctioned, completed, still pending, and spent in their district. This gives
district pages a concrete infrastructure progress lens without inventing road
quality claims or using non-official sources.

## Source URLs

- OMMAS Rural Dashboard table view:
  [https://omms.nic.in/dbweb/Home/TableView](https://omms.nic.in/dbweb/Home/TableView)
- PMGSY National GIS / GRRIS:
  [https://pmgsy-grris.nic.in/home.aspx](https://pmgsy-grris.nic.in/home.aspx)
- PMGSY Rural Facilities Dataset FAQ:
  [https://www.omms.nic.in/Home/PMGSYRuralDataset/](https://www.omms.nic.in/Home/PMGSYRuralDataset/)
- PIB note on PMGSY open GIS / habitation data:
  [https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1885504](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1885504)
- Example OGD district snapshot resource:
  [https://www.data.gov.in/resource/district-wise-details-road-length-completed-under-pmgsy-pradhan-mantri-gram-sadak-yojana](https://www.data.gov.in/resource/district-wise-details-road-length-completed-under-pmgsy-pradhan-mantri-gram-sadak-yojana)

## Licensing and access notes

- The PMGSY Rural Facilities FAQ says the facilities dataset is released under
  the **Government Open Data License - India (GODL)**.
- `data.gov.in` states published datasets/resources are licensed under GODL.
- The live OMMAS dashboard appears public and downloadable as PDF/Excel from
  the UI, but I did **not** find a documented public API in the source review.
- GRRIS is public for viewing; the PIB note says some GIS layers were opened in
  the public domain, but the exact downloadable layer set should be verified
  during implementation.

## Update frequency

- **OMMAS dashboard:** rolling MIS/dashboard data with a public “Data generated
  as on” timestamp visible in the table view. Exact SLA is not documented, so
  treat it as near-live / regularly refreshed rather than a guaranteed hourly
  feed.
- **OGD district snapshots:** irregular and question-driven. Useful for
  backfill/examples, not for fresh live district monitoring.
- **PMGSY Rural Facilities dataset:** static/open-data style release, suitable
  as supporting context rather than freshness-critical monitoring.

## District and state granularity

- OMMAS table view supports **state** and **district** selectors directly.
- GRRIS visualizes PMGSY roads and associated geography at public map level.
- OGD snapshots are often **state-specific district tables**, not a single
  pan-India district feed.
- This feature is viable for district dashboards, but national backfill will
  need per-state extraction or dashboard scraping rather than one clean India
  CSV.

## Available data fields

Observed/publicly documented fields from the OMMAS table view and related PMGSY
materials:

- state / district
- scheme (`PMGSY-I`, `PMGSY-II`, `PMGSY-III`, `RCPLWEA`)
- sanctioned number of roads
- sanctioned road length
- adjusted road length
- number of long span bridges (LSBs)
- sanctioned cost
- actual cost
- completed number of roads
- completed road length
- balance number of roads
- balance road length
- unawarded number of roads
- unawarded road length
- expenditure till date

Potential supporting fields from the facilities/GIS side:

- block
- habitation
- facility category / subcategory
- latitude / longitude
- file upload date

## Data quality concerns

- District naming may not align cleanly with the app’s state/district slug set.
- “Net sanctioned” and “adjusted road length” have scheme-specific definitions;
  UI copy must explain them instead of implying plain road-km totals.
- GRRIS explicitly warns that displayed boundaries may not be official/legal.
- OGD resources are fragmented by state and parliamentary question, so they are
  not reliable as a sole production feed.
- Facilities data was collected for PMGSY planning, not for uniform
  cross-state benchmarking; the FAQ warns definitions and accuracy can vary.
- The public dashboard may change HTML/export patterns without notice because a
  stable API is not documented.

## Implementation risks

- Scraping risk: OMMAS looks like a server-rendered dashboard with export
  actions; extraction may require form-post emulation or HTML-table parsing.
- Coverage risk: some states/districts may have missing or lagging entries.
- Schema risk: district-road metrics are scheme-specific, so storing only one
  aggregate may hide useful distinctions.
- UX risk: road-km and expenditure numbers can look “live” even when the last
  update is unclear. Freshness copy must stay explicit.
- Mapping risk: district matching will need a normalization layer similar to
  the map/GeoJSON alias work already tracked.

## Privacy and legal concerns

- Aggregate district PMGSY progress data is low privacy risk.
- Avoid scraping or exposing any person-level complaint, contractor-contact, or
  staff-identifying fields if they appear in deeper PMGSY views.
- Boundary layers should carry a disclaimer when sourced from GRRIS because the
  source itself says displayed boundaries may not be official/legal.

## Split implementation tasks

1. **Data model**
   - Add a `DistrictRoadProgress` table keyed by district + scheme + snapshot
     time.
   - Store sanctioned/completed/balance/unawarded counts, lengths, LSBs,
     sanctioned cost, actual cost, expenditure, source URL, and fetched time.
   - Add freshness/status helpers so UI can distinguish missing vs stale data.

2. **Scraper / import / API**
   - Prototype a state+district OMMAS table scraper/export fetcher.
   - Build district slug normalization for PMGSY district names.
   - Persist snapshots and expose `/api/data/roads` with graceful empty/local DB
     fallbacks.
   - Use OGD state snapshots only for parser tests / historical examples, not as
     the primary freshness path.

3. **UI surface**
   - Add a Roads / Rural Connectivity module or infrastructure sub-panel on
     district pages.
   - Show completed vs balance km, sanctioned vs actual spend, scheme tabs, and
     clear freshness/source copy.
   - Avoid “road quality” claims unless the source explicitly provides them.

4. **Tests**
   - Parser tests for OMMAS table extraction and district-name normalization.
   - API fallback tests for empty DB / scraper failure.
   - UI state tests for stale timestamps, missing schemes, and partially
     populated district data.

5. **Rollout / backfill**
   - Pilot with Karnataka because current district coverage and PMGSY interest
     overlap.
   - Backfill one or two states first to validate district matching.
   - Expand state-by-state once scraper stability and naming aliases are proven.

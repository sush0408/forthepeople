# District Court Case Backlog Monitor Research

## Feature name and user value

- Feature: District Court Case Backlog Monitor
- User value: citizens can see district-level case pendency, filing, and disposal pressure from the official judiciary data surface without manually drilling through the NJDG dashboard.

## Source URLs

- NJDG district and subordinate courts dashboard: https://njdg.ecourts.gov.in/
- Department of Justice NJDG overview: https://doj.gov.in/the-national-judicial-data-grid-njdg/
- NIC NJDG overview: https://www.nic.gov.in/?p=4891
- e-Committee NJDG explainer and district/taluka scope: https://ecommitteesci.gov.in/service/national-judicial-data-grid/
- NJDG district courts manual landing page: https://ecommitteesci.gov.in/publication/district-courts-of-india-national-judicial-data-grid-njdg-dc/

## Licensing and access notes

- The dashboard and explainer pages are public and accessible without login.
- The surfaced data appears intended for public viewing and policy transparency, but the sources reviewed do not clearly publish an open-data license equivalent to OGL or NDSAP terms on the landing pages above.
- Implementation should treat this as publicly viewable government data with citation requirements, not as a blanket unrestricted bulk-download license.
- Before building any scraper, verify whether the district/taluka dashboard exposes a stable documented endpoint or whether only HTML/dashboard fetches are available.

## Update frequency

- Official NJDG explainer pages describe the statistics as updated daily.
- The Department of Justice overview says the underlying court data is updated on a near real-time basis by connected district and taluka courts.
- Product framing should therefore show freshness as a snapshot timestamp plus “official dashboard updates daily / near real time” copy rather than promising minute-level precision.

## District and state granularity

- Official materials explicitly say pendency data is available at national, state, district, and individual court level.
- The district and taluka courts surface is the relevant granularity for ForThePeople.
- District coverage appears nationwide where courts are computerized, but district naming and taluka rollups may not map 1:1 to the app’s district slug set.

## Available data fields

- Total pending cases
- Civil pending cases
- Criminal pending cases
- Institution counts
- Disposal counts
- Age buckets for pending cases
- Category or case-type breakdowns
- Delay-reason or alert-style aggregates on some views
- Court-complex / establishment rollups below district level
- Potential filters by period, jurisdiction, and court type depending on dashboard view

## Data quality concerns

- District names may follow judiciary naming that does not exactly match state administrative naming used elsewhere in the app.
- Some districts may effectively aggregate taluka or establishment data differently across states.
- Dashboard counters can change throughout the day; cached snapshots need explicit timestamps.
- Public pages may change query parameters, DOM structure, or internal network calls without versioning.
- Counts are operational justice-system metrics, not citizen-service guarantees; explanation copy must avoid overclaiming meaning.

## Implementation risks

- Scraping risk is medium to high unless there is a stable documented endpoint behind the dashboard.
- Anti-bot protections or dynamic dashboard requests may make automated collection brittle.
- District alias mapping will need a state-aware normalization table.
- A nationwide backfill could be expensive if the dashboard requires drill-down per district or court establishment.
- The feature needs careful caching so the app does not hammer judiciary infrastructure.

## Privacy and legal concerns

- The proposed feature should stay at aggregate district metrics only.
- Do not ingest party names, case details, or any personally identifying case-level records.
- UI copy should make clear that the feature summarizes public court backlog aggregates and is not legal advice.
- If scraping proves necessary, rate limits and robots/terms should be reviewed before rollout.

## Split implementation tasks

1. Data model
   Add district court backlog snapshots keyed by state, district, snapshot date, jurisdiction bucket, and source metadata.
2. Scraper/import/API
   Verify whether NJDG exposes stable district-level JSON or tabular endpoints; otherwise prototype a conservative dashboard extractor and expose `/api/data/courts-backlog`.
3. UI surface
   Add a justice or courts backlog card with pending totals, civil/criminal split, filing vs disposal movement, age buckets, freshness, and source link.
4. Tests
   Cover district alias joins, stale snapshots, missing split buckets, invalid numeric parsing, empty-local fallbacks, and source-shape regressions.
5. Rollout/backfill
   Pilot one state first, confirm extraction stability and alias quality, then backfill more states only after fetch volume and dashboard fragility are understood.

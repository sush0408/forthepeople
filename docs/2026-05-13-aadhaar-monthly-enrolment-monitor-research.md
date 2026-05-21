# Aadhaar Monthly Enrolment Monitor Research

## Feature name and user value

- Feature: District Aadhaar Monthly Enrolment Monitor
- User value: citizens can see whether Aadhaar enrolment and update activity is moving in their district, which helps the platform surface digital-access pressure in the citizen-services path without exposing any individual record.

## Source URLs

- OGD resource: https://www.data.gov.in/resource/aadhaar-monthly-enrolment-data
- OGD catalog: https://tn.data.gov.in/catalog/aadhaar-enrolment-and-update-data
- UIDAI dashboard: https://uidai.gov.in/aadhaar_dashboard/
- Government Open Data License - India: https://www.data.gov.in/Godl

## Licensing and access notes

- The OGD resource is published by UIDAI through the Open Government Data platform and is released under NDSAP / Government Open Data License - India.
- The OGD platform footer explicitly says published datasets are licensed under the Government Open Data License - India.
- The search snippet for the resource says there is no resource API; implementation should therefore assume file download or catalog scraping rather than a stable JSON API.
- Attribution should stay visible in the UI and data pipeline metadata because GODL requires attribution and non-endorsement discipline.

## Update frequency

- The resource is monthly.
- The OGD resource page shows `Published On: 16/05/2025` and `Updated On: 26/02/2026`.
- Product copy should frame this as a monthly operational snapshot, not a live coverage number.

## District and state granularity

- The resource includes `State`, `District`, and `Pincode`.
- District coverage appears nationwide because the catalog describes age-group-wise and pin-code-wise monthly Aadhaar enrolment and update data across India.
- Pincode-level rows may not map cleanly to district slugs if postal boundaries cross administrative expectations, so the first product surface should stay at district level.

## Available data fields

- Date / month
- State
- District
- Pincode
- Age-group columns beginning with `Age_0_5`
- Aggregate enrolment / update activity implied by the catalog scope
- Potential split between enrolment and update resources because the catalog also exposes separate demographic-update resources

## Data quality concerns

- Enrolment or update counts do not equal unique residents; the same person can appear in update activity multiple times across months.
- Counts may reflect service-point activity rather than a clean district-residence denominator.
- District naming may follow operational spellings that differ from the app's canonical district slugs.
- Pincode rows can create duplicate-looking district aggregates if multiple service points exist in one district.
- The resource metadata is fresh, but field-level schema needs profiling before assuming stable column names across files.

## Implementation risks

- No documented API means ingestion likely depends on file download or portal automation.
- A district rollup requires careful aggregation across pincode rows and possibly across multiple related Aadhaar resources.
- The feature can be misread as "Aadhaar coverage" unless copy clearly says "monthly enrolment / update activity".
- District-to-state joins must be strict because postal and enrolment-center data can be noisy.

## Privacy and legal concerns

- Keep the feature strictly aggregate.
- Do not expose pincode rows publicly in the first rollout if the counts are tiny or easy to misread as household-level activity.
- Avoid any framing that implies an individual's Aadhaar status, identity, or eligibility.
- Respect GODL attribution requirements and keep source links visible.

## Split implementation tasks

1. Data model
   Add monthly Aadhaar activity snapshots keyed by state, district, month, metric type, and source metadata; keep pincode-level staging internal only.
2. Scraper/import/API
   Download the OGD file, profile the exact columns, aggregate pincode rows to district totals, and expose `/api/data/aadhaar-activity` with freshness metadata.
3. UI surface
   Add a citizen-services or digital-access card showing monthly enrolment / update totals, month-over-month movement, and explicit "activity, not coverage" copy.
4. Tests
   Cover district alias joins, repeated pincode aggregation, stale-month handling, malformed numeric columns, and empty-local fallbacks.
5. Rollout/backfill
   Pilot one monthly file first, confirm schema stability and interpretation, then backfill additional months only after the aggregate story reads clearly.

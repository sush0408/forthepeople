# PM-KISAN Beneficiary Monitor Research

Date: 2026-05-08

## Feature name and user value

Feature: District PM-KISAN Beneficiary Monitor

User value:
- Citizens can see how many farmers in a district are receiving PM-KISAN support without digging through state portals, OGD mirrors, or parliamentary annexures.
- The feature can explain payment scale, coverage trend, and beneficiary-verification friction without exposing any individual farmer record.

## Source URLs

- PM-KISAN OGD catalog: [https://ap.data.gov.in/catalog/pm-kisan-scheme](https://ap.data.gov.in/catalog/pm-kisan-scheme)
- Karnataka district-wise beneficiary dataset example: [https://karnataka.data.gov.in/resource/districtwise-number-beneficiaries-under-pm-kisan](https://karnataka.data.gov.in/resource/districtwise-number-beneficiaries-under-pm-kisan)
- Village and gender-wise district dataset example: [https://www.data.gov.in/resource/village-and-gender-wise-beneficiaries-count-chennai-district-tamil-nadu-under-pm-kisan-14](https://www.data.gov.in/resource/village-and-gender-wise-beneficiaries-count-chennai-district-tamil-nadu-under-pm-kisan-14)
- PIB implementation note with state-wise seeded, beneficiary, and pending-eKYC annexures: [https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1941402](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1941402)

## Licensing and access notes

- OGD PM-KISAN resources are published on `data.gov.in` / state OGD mirrors under the Government Open Data License - India according to the dataset pages.
- Access is public and unauthenticated.
- Some OGD entries say the data is directly hosted on the source server and that API/preview support is unavailable, so ingestion may need file downloads rather than stable JSON APIs.

## Update frequency

- The generic district-wise Karnataka resource is marked `Annual`.
- The village and gender-wise district resources are marked `Quarterly`.
- The broader PM-KISAN catalog page was updated on 2026-04-29.
- PIB annexure pages are point-in-time parliamentary or ministry disclosures, not a reliable machine-updated feed.

## District and state granularity

- District granularity is available in district-wise beneficiary datasets on OGD.
- Finer village-level rows appear for some districts through the village and gender-wise PM-KISAN resources.
- State-level coverage, seeded-land-detail totals, beneficiary counts by installment, and pending eKYC totals are available from PIB annexures.
- Nationally uniform district coverage is not guaranteed from a single endpoint; availability appears fragmented across OGD resources and state mirrors.

## Available data fields

Confirmed or strongly indicated by the source pages:
- district name
- beneficiary count
- installment or period / financial year
- village name for some resources
- gender split for village-level resources
- state name

Likely implementation fields after normalization:
- `source_url`
- `snapshot_date`
- `state_slug`
- `district_slug`
- `district_name_raw`
- `installment_label`
- `financial_year`
- `beneficiary_count`
- `gender`
- `village_name`
- `granularity`

## Data quality concerns

- Coverage is fragmented: some sources are annual district snapshots, some are quarterly village/gender snapshots, and some are parliamentary answers frozen to one date.
- OGD metadata suggests many resources are mirrored without stable APIs, so transport shape may differ by source.
- District naming will likely drift across state mirrors, PM-KISAN source exports, and ForThePeople district slugs.
- Parliamentary answer datasets can become stale quickly and should not be presented as live payment status.
- Beneficiary counts can change because of eKYC completion, Aadhaar seeding, validation, and land-detail corrections; trend lines need honest caveats.

## Implementation risks

- National rollout is likely blocked by uneven district-level availability from a single canonical feed.
- Some resources may only exist as per-district files, which increases scraper/index overhead.
- Joining village/gender files back to app districts will need state-aware alias mapping and duplicate-name handling.
- Users may interpret beneficiary totals as farmer-population coverage; the UI will need explicit scope labels.

## Privacy and legal concerns

- Use only aggregate district or village totals; do not ingest or expose any individual beneficiary identifiers.
- Village-level gender counts are still aggregate, but very low-count slices should be reviewed before prominent display.
- Stay within OGD / source terms and avoid scraping authenticated PM-KISAN workflows or personal-status lookup surfaces.

## Split implementation tasks

1. Data model
- Add PM-KISAN aggregate snapshot tables keyed by state, district, granularity, installment/period, and snapshot date.
- Keep raw source labels alongside normalized slugs for auditability.

2. Scraper / import / API
- Start with one state-level district dataset plus one district-level village/gender dataset.
- Build a normalizer that can ingest OGD downloads even when preview/API endpoints are missing.
- Expose a read-only `/api/data/pm-kisan` surface with freshness, granularity, and source metadata.

3. UI surface
- Add an agriculture-support card showing beneficiary count, period, and freshness.
- If village/gender detail exists, show it behind a clearly labeled breakdown rather than pretending it exists everywhere.
- Add explanatory copy that PM-KISAN covers eligible landholding farmer families, not all residents or all cultivators.

4. Tests
- Cover district alias joins, mixed granularity handling, missing installment labels, stale snapshots, and low-count village breakdown suppression.

5. Rollout / backfill
- Pilot a single state with reliable district files first.
- Backfill only after proving stable ingestion shape, district normalization, and honest UI copy.

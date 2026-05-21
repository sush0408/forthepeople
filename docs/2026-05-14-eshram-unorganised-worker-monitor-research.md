# District eShram Unorganised Worker Monitor

## Feature name and user value

- Feature: District eShram Unorganised Worker Monitor
- User value: citizens can see how many unorganised workers are registered in eShram by district, plus basic demographic composition signals, without navigating the labour portal or pretending this is a full labour-force denominator.

## Source URLs

- OGD dataset: [District-wise Demographic Data of Unorganised Workers registered on eShram as on Previous Day](https://www.data.gov.in/resource/district-wise-demographic-data-unorganised-workers-registered-eshram-previous-day)
- eShram objectives: [Objectives of eShram Portal](https://eshram.gov.in/e-shram-objectives)
- eShram overview: [About eShram Portal](https://eshram.gov.in/e-shram-portal?change_theme=1)
- OGD platform license reference: [Government Open Data License - India](https://www.data.gov.in/resource/district-wise-demographic-data-unorganised-workers-registered-eshram-previous-day)

## Licensing and access notes

- The OGD catalog page states the dataset is released under the Government Open Data License - India.
- The dataset is public and does not appear to require authentication on the catalog page.
- eShram product pages are public and useful for user-facing methodology copy, but the app should treat the OGD resource as the primary data source.

## Update frequency

- The dataset title and catalog text indicate refresh "as on Previous Day" / "till last previous day", so this is effectively daily.
- The catalog page I checked shows `Updated On 28/04/2026`.
- Expect occasional lag or quiet backfills; the UI should surface the actual snapshot date rather than promise strict daily freshness.

## District and state granularity

- District-level rows are explicitly advertised by the dataset title.
- State context is available via state code / state fields.
- This is suitable for district dashboards.
- It is not a village-, ward-, or constituency-level source.

## Available data fields

- The catalog snippet explicitly lists fields including `gender`, `age`, `differentlyAbledStatus`, `educationQualification`, and `currentStateCode`.
- Based on the dataset title/catalog and eShram portal description, it is reasonable to expect district identifiers plus registration-count-style aggregates in the downloadable payload.
- Inference from source context: the CSV/API likely includes district/state labels or codes, demographic bucket labels, and aggregate counts rather than person-level records.
- Before implementation, validate the exact field headers in the downloadable resource and lock the importer to those headers instead of guessing.

## Data quality concerns

- The catalog explicitly notes: "The data is based on self declaration."
- Registration totals are not labour-force totals. They reflect portal uptake, outreach, and eligibility, not the full number of unorganised workers in a district.
- Coverage will vary sharply across states and districts depending on local enrolment drives and assisted-registration access.
- District naming may not match the app's canonical slugs, so alias mapping will be required.
- The source may revise previous-day totals retroactively, so imports should be idempotent and snapshot-based.

## Implementation risks

- The exact OGD payload shape still needs verification in code before schema design is finalized.
- If the resource is exposed only through a paginated API, importer runtime and rate limits may need batching.
- Because the data is aggregate-by-bucket, joining multiple demographic cuts without double-counting will need careful UI rules.
- The feature can mislead users if it is framed as worker population coverage instead of registration activity.

## Privacy and legal concerns

- The public resource appears aggregate and district-level, which is compatible with the app's public-data posture.
- Do not surface any person-level identifiers even if they appear elsewhere in the ecosystem; this feature should stay aggregate-only.
- Avoid low-count drill-downs that could make small demographic buckets feel personally attributable.

## Split implementation tasks

1. Data model
   Add district eShram snapshot tables keyed by state, district, snapshot date, demographic dimension, bucket label, and count, with source metadata and import checksum columns.
2. Scraper/import/API
   Fetch the OGD resource, normalize district/state aliases, store snapshot rows idempotently, and expose `/api/data/eshram-workers` with freshness and methodology metadata.
3. UI surface
   Add a labour / livelihoods card showing total registered workers, selected demographic splits, and explicit copy that this is registration activity, not total unorganised-worker population.
4. Tests
   Cover district alias joins, malformed bucket labels, duplicate snapshot imports, stale dates, and empty-local fallback behavior.
5. Rollout/backfill
   Pilot one current snapshot first, verify payload stability and interpretability, then backfill only after alias quality and demographic-bucket handling are stable.

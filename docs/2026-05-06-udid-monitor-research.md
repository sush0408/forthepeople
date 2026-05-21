# District UDID Coverage Monitor Research

## Feature name and user value

- Feature: District UDID Coverage Monitor
- User value: citizens, disability-rights volunteers, and local reporters can see where Unique Disability ID (UDID) enrollment is concentrated or lagging without needing beneficiary-level access. This gives the app a district-level accessibility and inclusion signal that is public, aggregate, and tied to a live government program.

## Source URLs

- OGD resource: [District wise, Disability wise, Age group wise, Gender wise Unique Disability ID (UDID) data as on 11.06.2024](https://www.data.gov.in/resource/district-wise-disability-wise-age-group-wise-gender-wise-unique-disability-id-udid-data)
- OGD catalog: [Unique Disability ID (UDID)](https://jk.data.gov.in/catalog/unique-disability-id-udid)
- Program background: [DEPwD - Unique Disability ID (UDID)](https://depwd.gov.in/unique-disability-id-udid/)
- License: [Government Open Data License - India](https://www.data.gov.in/Godl)

## Licensing and access notes

- The OGD resource is published on `data.gov.in` and the portal states that published content is licensed under the Government Open Data License - India.
- Access appears public and download-oriented through the OGD platform.
- The crawler-visible resource page does not expose a full schema inline, so some field expectations below are inferred from the resource title and the UDID catalog description.

## Update frequency

- The dataset page shows `Published On: 11/09/2023` and `Updated On: 11/06/2024`.
- The resource title itself is snapshot-based: `as on 11.06.2024`.
- Practical interpretation: treat this as an irregular snapshot feed, not a guaranteed daily or weekly API.

## District/state granularity

- District-level rows are explicitly indicated in the resource title.
- The dataset should be state- and district-addressable.
- The DEPwD UDID program page says the system tracks progress across village, block, district, state, and national levels, but the public OGD resource here is the district-facing aggregate.

## Available data fields

- Confirmed from the title:
  - district
  - disability category
  - age group
  - gender
  - UDID count/status snapshot
- Likely accompanying join fields:
  - state or UT
  - snapshot date or extract date
  - row identifiers / serial number
- Important note: the exact column names should be verified from the downloadable file before implementation because the crawler-visible page does not list them line by line.

## Data quality concerns

- District names may follow ministry spellings that do not exactly match the app’s state config slugs.
- Snapshot timing is irregular, so stale districts could look like low-coverage districts unless freshness is labeled clearly.
- Counts are administrative enrollment outputs, not prevalence estimates; users could misread low UDID counts as low disability incidence.
- Some districts may have missing splits for age, gender, or disability type if the export suppresses sparse categories or uses inconsistent labels.

## Implementation risks

- Alias normalization risk between OGD district labels and the app’s district config is the main join problem.
- Because the visible page is thin on schema details, the first engineering step should be downloading and profiling the actual file before locking a Prisma schema.
- If the resource is refreshed manually rather than via a stable API, the scraper/import path may need a file-download workflow instead of a normal JSON poller.
- The UI needs careful explanatory copy so users understand this is UDID issuance/coverage activity, not a population disability estimate.

## Privacy and legal concerns

- The candidate is safer than beneficiary search because it is aggregate public data, not person-level records.
- Still, the combination of district + disability type + age group + gender can create sensitive small-cell interpretations in smaller districts.
- The app should avoid exposing overly granular breakdowns when counts are very low, or at minimum label them as official aggregates and avoid any individual-level inference.
- Attribution back to the ministry/OGD source should be retained to satisfy license and interpretation expectations.

## Split implementation tasks

1. Data model
- Add annual or snapshot-based UDID aggregate rows keyed by state, district, disability category, age group, gender, and snapshot date.
- Store source URL, source label, and freshness metadata separately from numeric fields.

2. Scraper/import/API
- Prototype file download from the OGD resource, inspect actual columns, normalize district aliases, and expose `/api/data/udid` or fold it into an accessibility/social-welfare module.
- Add stale-snapshot guards so the API can return honest freshness labels when the source is old.

3. UI surface
- Add a district card such as `Disability ID coverage snapshot` with total issued counts and optional split tabs for gender, age band, and disability type.
- Include a clear note that this is UDID enrollment/issuance activity, not disability prevalence.

4. Tests
- Cover district alias joins, stale snapshot labeling, missing split buckets, low-count rendering safeguards, and empty-local fallback behavior.

5. Rollout/backfill
- Start with one import run and a schema audit, then backfill all available districts once alias matching is stable.
- Roll out behind a low-noise card first before adding comparative charts or rankings.

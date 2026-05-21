# District PM SVANidhi Beneficiary Monitor Research

## Feature name and user value

- Feature: Karnataka district PM SVANidhi beneficiary monitor
- User value: lets users see where street-vendor credit uptake is strongest or weakest across Karnataka districts without exposing any vendor-level identity or loan record.

## Source URLs

- OGD resource: [District-wise Number of Beneficiaries under PM SVANidhi scheme in Karnataka as on 27-01-2025](https://www.data.gov.in/resource/district-wise-number-beneficiaries-under-pm-svanidhi-scheme-karnataka-27-01-2025)
- Karnataka OGD mirror for the same resource: [karnataka.data.gov.in resource page](https://karnataka.data.gov.in/resource/district-wise-number-beneficiaries-under-pm-svanidhi-scheme-karnataka-27-01-2025)
- Scheme context / national topline: [MoHUA Mission Dashboard](https://dashboard.mohua.gov.in/)
- Privacy / operational context: [PM SVANidhi portal privacy policy](https://www.disclaimerpms.mohua.gov.in/)

## Licensing and access notes

- The OGD resource is published on data.gov.in and marked as released under the National Data Sharing and Accessibility Policy / Government Open Data License - India.
- Access is public and free.
- The resource page says a direct API is not available, so ingestion likely needs CSV download or catalog scraping rather than a stable JSON endpoint.

## Update frequency

- The Karnataka district beneficiary resource is labeled `Granularity: Quarterly`.
- The note says the numbers come from Rajya Sabha Session 267, Unstarred Question 55, answered on February 3, 2025, with data as of January 27, 2025.
- Practical cadence risk: this looks more like an answer-backed snapshot than a continuously refreshed operational feed, so the product should present it as a dated snapshot, not a live tracker.

## District and state granularity

- State granularity: Karnataka only in the identified district table.
- District granularity: yes, district rows are explicitly present.
- National / cross-state granularity: not from this resource alone.

## Available data fields

- `Sl. No.`
- `District`
- `Number of Beneficiaries`

## Data quality concerns

- District naming may follow parliamentary-answer spellings rather than the app's canonical district config, so alias mapping will be required.
- The dataset appears to be a single dated snapshot, not a time series.
- No sanction/disbursal split, loan tranche split, gender split, or ULB split is exposed here.
- Because it is Karnataka-only, empty states outside Karnataka must stay hidden or clearly labeled unsupported.
- Parliamentary-answer extracts can be corrected or superseded later without stable schema/version guarantees.

## Implementation risks

- The lack of a stable API means importer reliability depends on scraping or downloading a small CSV/ZIP artifact.
- Joining parliamentary district names to current app district slugs may create false negatives for renamed or split districts.
- Users may infer this is "all street vendors" rather than "beneficiaries under one scheme"; the UI needs explicit framing.
- Without a denominator such as estimated vendor count, ranking districts by raw beneficiaries alone can over-reward population size.

## Privacy and legal concerns

- The researched dataset is aggregate district-level data, so it is low privacy risk on its own.
- The official PM SVANidhi portal handles sensitive personal and financial data; ForThePeople should not ingest or expose any beneficiary-level portal data.
- UI copy should avoid implying loan eligibility, approval prediction, or identity lookup.

## Split implementation tasks

1. Data model
   Add `pmSvanidhiSnapshot` storage keyed by `stateSlug`, `districtSlug`, `snapshotDate`, `sourceUrl`, and `sourceLabel`, with a numeric `beneficiaryCount`.
2. Scraper / import / API
   Build a Karnataka-only importer for the OGD CSV/ZIP resource, normalize district aliases, store a dated snapshot, and expose `/api/data/pm-svanidhi`.
3. UI surface
   Add an urban livelihoods / street-vendor credit card on Karnataka district pages with beneficiary count, statewide rank, source note, and explicit "snapshot as of" freshness copy.
4. Tests
   Cover district alias joins, duplicate-row rejection, missing beneficiary counts, stale snapshot copy, and non-Karnataka empty fallback behavior.
5. Rollout / backfill
   Start as Karnataka-only, backfill the January 27, 2025 snapshot, and expand only if additional state or national district tables with comparable schema are found.

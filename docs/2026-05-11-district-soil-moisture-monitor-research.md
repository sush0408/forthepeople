# District Soil Moisture Monitor Research

## Feature name and user value

- Feature: District Soil Moisture Monitor
- User value: gives farm and water users a district-level dryness/wetness baseline that can explain crop stress, irrigation pressure, and weak rainfall outcomes without inventing any taluk or farm-level precision the source does not provide.

## Source URLs

- OGD catalog: https://www.data.gov.in/catalog/daily-data-soil-moisture
- Example state resource page with field list: https://www.data.gov.in/resource/soil-moisture-sikkim-2020
- Example larger state resource page: https://www.data.gov.in/resource/soil-moisture-gujarat-2018
- Reference surface named by the resource: https://indiawris.gov.in/wris/#/soilMoisture
- License page referenced by OGD: https://www.data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf

## Licensing and access notes

- The OGD catalog states the dataset is released under the National Data Sharing and Accessibility Policy / Government Open Data License - India.
- Access appears public via catalog/resource pages and downloadable ZIP/CSV resources.
- The catalog exposes a `Catalog API` entry, but the public API detail page is not useful without an API key/login flow, so an importer should be built around stable file/resource downloads first.

## Update frequency

- The resource pages describe the data as daily granularity.
- The catalog metadata is stale: the catalog page shows `Published On: 31/12/2021` and `Updated On: 31/12/2021`, while example state resource pages show updates on `27/01/2022`.
- Implementation should treat this as "daily-shaped historical data with uncertain current refresh cadence" until a live fetch confirms ongoing publication.

## District and state granularity

- Granularity is district-level within a state.
- Resource pages are state-scoped examples, so rollout likely needs one file per state and then a normalized national union in storage.
- No taluk, block, village, or polygon-level measurements are described in the source pages.

## Available data fields

From the example state resource pages:

- `Date`
- `State Name`
- `DistrictName`
- `Average Soilmoisture Level (at 15cm)`
- `Average SoilMoisture Volume (at 15cm)`

From the catalog description:

- district-level soil moisture volume
- soil moisture level
- aggregate level
- aggregate volume

Inference: the catalog suggests more aggregate fields may exist in some resource variants, but the public field list visible on sampled resource pages clearly confirms only the date/state/district plus 15cm level and volume columns.

## Data quality concerns

- Catalog freshness is unclear; stale portal metadata raises risk that "daily" publication may not currently be daily.
- District naming may not match ForThePeople static district config exactly and will need alias normalization.
- The visible public field list appears limited to 15cm averages, so deeper-soil interpretation should not be implied in UI copy.
- State-wise resource fragmentation means missing states or inconsistent historical windows are likely.
- Units/semantics are not described well on the catalog page, so labels should stay conservative until importer sampling verifies ranges and meaning.

## Implementation risks

- Scraping may require catalog-resource discovery by state/year rather than one clean national API.
- Some states may have historical files only, which creates uneven coverage and stale-state UX requirements.
- If the file naming pattern changes or resources disappear, importer stability could degrade quickly.
- District alias joins are likely non-trivial because the data is organized by state resources rather than a single LGD-coded feed.

## Privacy and legal concerns

- The source is aggregate district-level environmental data with no obvious personal data.
- Main legal risk is attribution and license compliance; keep source attribution, timestamps, and dataset links visible in API/UI metadata.
- Avoid overstating precision. This is modeled/aggregated district data, not a parcel-level advisory for individual farms.

## Split implementation tasks

1. Data model
   - Add `SoilMoistureSnapshot` keyed by `stateSlug`, `districtSlug`, `observedOn`, and source metadata.
   - Store `soilMoistureLevel15cm`, `soilMoistureVolume15cm`, source URL, and import batch timestamp.
2. Scraper/import/API
   - Build a state-resource discovery/importer that fetches the public CSV/ZIP assets, normalizes district aliases, and records missing-state coverage explicitly.
   - Expose `/api/data/soil-moisture` with freshness, coverage, and fallback metadata.
3. UI surface
   - Add a district soil moisture card to the farm or water module with current level/volume, trend if enough history exists, and a clear "district average" label.
   - Pair it with rainfall/crop context only when timestamps are comparable.
4. Tests
   - Cover alias joins, missing dates, duplicate district/day rows, invalid numeric parsing, stale snapshots, and local-empty fallback behavior.
5. Rollout/backfill
   - Pilot one or two states with known resource pages first.
   - After importer stability is proven, backfill additional states and ship a coverage map that clearly marks unavailable states.

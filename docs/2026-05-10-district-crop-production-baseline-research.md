# District Crop Production Baseline Research

Date: 2026-05-10

## Feature name and user value

Feature: District Crop Production Baseline

User value:
- Citizens can see which crops dominate a district by season and year instead of relying on anecdotal claims.
- District pages can add long-horizon agricultural context alongside the existing daily mandi-price module.
- Reporters and contributors get a grounded baseline for questions like crop concentration, output shifts, and area-versus-production changes.

## Source URLs

- OGD catalog: [District-wise, season-wise crop production statistics](https://www.data.gov.in/catalog/district-wise-season-wise-crop-production-statistics-0)
- OGD terms of use: [Terms Of Use](https://www.data.gov.in/terms-of-use)
- OGD license reference: [Government Open Data License - India](https://www.data.gov.in/Godl)

## Licensing and access notes

- The OGD catalog page lists the dataset as released under NDSAP and says content on `data.gov.in` is licensed under the Government Open Data License - India.
- The terms page says portal data should not be treated as a legal statement and should be verified with the concerned department before action.
- Access appears public from the catalog page via zip download/catalog API metadata, with no login requirement for browsing the dataset page itself.

## Update frequency

- The catalog page shows `Published On: 24/05/2013` and `Updated On: 06/07/2021`.
- Practical implication: treat this as a low-frequency historical baseline, not a live operational feed.

## District/state granularity

- District-level rows across India.
- The source description explicitly says the data is district-wise, crop-wise, season-wise, and year-wise.
- State context is implicitly present because districts must be grouped under states for joins and navigation.

## Available data fields

From the catalog description, the dependable fields are:
- district name
- state name or state grouping
- crop name
- season
- year
- area under crop in hectares
- production in tonnes

Inference:
- Yield is not listed as a field on the source page, so any yield metric should be derived in-app from production divided by area and clearly marked as derived.

## Data quality concerns

- Source freshness is weak; the catalog page was last updated on 2021-07-06.
- District names will likely need alias normalization against current ForThePeople slugs and post-2021 district splits/renames.
- Historic crop records may use inconsistent crop labels, season labels, or legacy district/state names.
- The catalog page description does not expose schema details inline, so importer work should first profile the actual download before committing to a final table shape.
- Because this is historical baseline data, users could misread it as current crop conditions unless freshness and year labels are explicit.

## Implementation risks

- Join risk: current district slugs may not match historic DES naming.
- Scope risk: the raw file may be large enough that import and dedupe need batching rather than one-shot seeding.
- Presentation risk: area and production are meaningful, but not all districts grow the same crop set every season, so comparisons need careful defaults.
- UX risk: mixing long-horizon annual production baselines with daily mandi prices can create false expectations unless the surfaces clearly distinguish baseline vs live market data.

## Privacy and legal concerns

- Low privacy risk: this is aggregate district-level agricultural production data.
- Legal/compliance note: preserve source attribution and avoid framing the data as legal or operational advice, consistent with the OGD terms page.

## Split implementation tasks

1. Data model
- Add a district crop production snapshot table keyed by state slug, district slug, crop, season, and year.
- Store area hectares, production tonnes, source URL, source dataset id, and import timestamp.
- Keep a nullable derived yield field only if computed during import; otherwise compute at read time.

2. Scraper/import/API
- Download/profile the OGD export first and document the real column names before writing the importer.
- Normalize district and state aliases against current ForThePeople config.
- Expose `/api/data/crop-production-baseline` with explicit `year`, `season`, and freshness metadata.

3. UI surface
- Add a district agriculture-baseline card or subpanel in `farm`/`crops` showing top crops by area and production.
- Separate baseline copy from daily mandi price copy so users do not confuse historic output with current prices.
- Include year and season chips on every view.

4. Tests
- Cover alias joins, renamed districts, blank crop labels, zero-area rows, derived-yield safeguards, and stale-year messaging.
- Add API fallback tests for local-empty DB states.

5. Rollout/backfill
- Pilot one state first to validate district joins and row volume.
- Backfill nationally only after importer profiling confirms stable schema and acceptable ingest time.

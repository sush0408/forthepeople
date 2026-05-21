# 2026-05-03: District Road Safety Monitor research

## Summary

A **District Road Safety Monitor** fits the ForThePeople surface well because it
adds a concrete public-safety dataset that citizens understand immediately:
road crashes, fatalities, blackspots, enforcement, and response gaps.

## Candidate public/free sources

1. **Ministry of Road Transport & Highways (MoRTH) annual road accident tables**
   - Best source for official all-India accident and fatality counts.
   - Usually published as annual report tables and state/district breakdowns.
   - Good for stable yearly trends, not live incidents.
2. **Open Government Data Platform (data.gov.in) transport / accident resources**
   - Useful as the ingestion entrypoint when MoRTH tables are mirrored into OGD
     resources or CSV/XLS attachments.
   - Best for structured pulls instead of PDF-only extraction.
3. **State police / traffic police open dashboards**
   - Not reliable enough for an all-India first version, but valuable later for
     pilot districts where monthly enforcement or violation data is public.
4. **National Highways Authority / state PWD blackspot disclosures**
   - Useful for a later “hazard map” or “known dangerous stretches” add-on.

## Recommended V1 scope

Start with a **yearly district road-safety card**, not a real-time incident
tracker.

Suggested metrics:

- Total road accidents in the district
- Total fatalities
- Total injuries
- Fatality rate per 100 accidents
- Year-over-year change
- State-vs-district comparison

Suggested citizen-facing outputs:

- A headline safety scorecard on `police` or a dedicated future `road-safety`
  module
- A simple trend chart for 3-5 years
- One short explainer: “Are crashes rising or falling here?”
- A fallback note when only state-level data is available

## Why this is a good backlog feature

- Strong public interest and clear civic value
- Works with low-frequency official data; no need to fake “live” precision
- Pairs naturally with existing `transport`, `police`, and map surfaces
- Can degrade gracefully to yearly snapshots when a local DB is empty

## Data model sketch

Possible table:

`DistrictRoadSafetyStat`

- `id`
- `stateSlug`
- `districtSlug`
- `year`
- `accidents`
- `fatalities`
- `injuries`
- `sourceName`
- `sourceUrl`
- `ingestedAt`

Derived helpers:

- fatality rate
- accident trend direction
- worst year / best year in available history

## Risks

- District coverage may be inconsistent across years or source formats.
- Some releases may be PDF-only, which increases extraction effort.
- “Road safety” can be mistaken for live emergency alerts; product copy must
  say this is an annual or periodic official dataset, not live crash reporting.

## Recommendation

Add this to backlog as a **post-groundwater / post-AQI public-data expansion**
candidate. Prefer a Karnataka-first pilot if district tables are easiest there,
then generalize once ingestion patterns are stable.

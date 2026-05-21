# 2026-04-27: Groundwater Monitor Research

## Candidate feature

**District Groundwater Monitor**

A public-data feature for the `water`, `farm`, and `alerts` surfaces that tracks:

- groundwater depth bands (`0-2m`, `2-5m`, `5-10m`, deeper) where district data exists
- seasonal change (`pre-monsoon` vs `post-monsoon`) where CGWB releases support it
- groundwater stress / extraction context from annual resource-assessment publications
- a plain-language civic note explaining whether a district appears stable, stressed, or data-limited

## Why it fits ForThePeople

- It extends an existing high-intent civic path: `water` and `farm`.
- It is public-interest infrastructure data, not speculative or synthetic scoring.
- It has value in local-empty-DB scenarios because static source-linked fallback summaries are possible without inventing live measurements.
- It pairs well with existing rainfall and dam/reservoir storytelling: rainfall explains recharge, dams explain surface storage, groundwater explains hidden water security.

## Source viability

### 1. CGWB groundwater monitoring

The Central Ground Water Board says it monitors groundwater through a national network of about **25,000 monitoring stations**, with recurring seasonal measurements and some higher-frequency telemetry through DWLR installations. The page also exposes historical water-level downloads stretching back to the 1990s.

Source:

- [CGWB Ground Water Level Monitoring](https://www.cgwb.gov.in/en/ground-water-level-monitoring)

### 2. CGWB resource assessment

CGWB's **National Compilation on Dynamic Ground Water Resources of India, 2024** provides annual resource-assessment context such as recharge, extractable resource, and extraction pressure. This looks more suitable for annual context cards than for a "live" widget.

Sources:

- [CGWB National Compilation on Dynamic Ground Water Resources of India, 2024](https://cgwb.gov.in/en/national-compilation-dynamic-ground-water-resources-india-2024)
- [CGWB Ground Water Resource Assessment](https://cgwb.gov.in/en/ground-water-resource-assessment-0)

### 3. OGD derivatives

The Open Government Data platform contains district-wise groundwater tables in some cases, but the currently surfaced examples appear fragmented and not clearly available as one stable all-India API. That suggests OGD is better as a supplement or spot-source, not the core ingestion contract for an all-India MVP.

Source:

- [OGD example: district-wise groundwater level details](https://www.data.gov.in/resource/district-wise-details-ground-water-level-measured-water-level-data-collected-central)

## Practical product shape

### MVP

Ship this as a **Groundwater Status card** inside `water` first, not as a new full module.

Suggested fields:

- latest source month/season
- district/state label
- number of wells sampled, if published
- dominant depth band
- seasonal direction: `improved`, `worsened`, or `mixed`
- resource context note: `safe`, `watch`, `stressed`, or `data limited`
- source links

### Phase 2

Expand into a dedicated groundwater page with:

- multi-year seasonal trend chart
- comparison versus state median where data coverage allows
- recharge/extraction explainer from CGWB assessment tables
- district-to-block drilldown when stable joins exist

## Data-shape constraints

- **Do not market this as live telemetry** for all districts. The official sources support recurring monitoring and historical downloads, but not uniform real-time district coverage.
- **District coverage will be uneven.** Some data may arrive as monitoring-well tables, some as district summaries, and some only via state/basin publications.
- **Assessment granularity may not match district boundaries.** Annual groundwater resource assessment is often closer to block / assessment-unit logic than a clean district dashboard shape.
- **Telemetry data may be gated.** CGWB references WIMS for authorized users, so public implementation should assume downloadable public bulletins/files first.

## Recommended implementation path

1. Start with Karnataka + pilot states where district naming already exists in app config.
2. Build a source-normalization script that maps CGWB district labels to app district slugs.
3. Store only published measurements and assessment labels; never interpolate missing well data.
4. Reuse the current freshness banner pattern so stale groundwater updates degrade gracefully.
5. Add explicit "source season" copy because groundwater data cadence is slower than weather/crop feeds.

## Backlog recommendation

Add to sprint backlog as:

`Groundwater Status card for water module (pilot states first)`

## Sources used

- [CGWB Ground Water Level Monitoring](https://www.cgwb.gov.in/en/ground-water-level-monitoring)
- [CGWB National Compilation on Dynamic Ground Water Resources of India, 2024](https://cgwb.gov.in/en/national-compilation-dynamic-ground-water-resources-india-2024)
- [CGWB Ground Water Resource Assessment](https://cgwb.gov.in/en/ground-water-resource-assessment-0)
- [OGD district-wise groundwater level example](https://www.data.gov.in/resource/district-wise-details-ground-water-level-measured-water-level-data-collected-central)

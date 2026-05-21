# 2026-04-25: District Rainfall Monitor feature research

## Proposed feature

Add a **District Rainfall Monitor** panel that sits between the existing
`weather` and `water` modules:

- show daily / weekly / monthly rainfall totals for the current district
- compare actual rainfall against district normals
- flag `deficit`, `normal`, and `excess` periods
- surface short civic explanations such as crop stress risk, reservoir recharge
  context, and drinking-water pressure signals

## Why this fits ForThePeople.in

- The repo already has district dashboards plus `weather`, `water`, `farm`, and
  `crops` modules, so rainfall is a direct cross-module input rather than a
  standalone novelty feature.
- Rainfall anomalies are understandable to citizens and useful to farmers,
  urban residents, and local reporters.
- The data is available from free public Indian sources with district granularity.

## Public / free data sources checked

### 1. Live / near-live rainfall

Source: Open Government Data Platform India, `Daily District-wise Rainfall Data`

- Published on **September 29, 2022**
- Updated on **December 31, 2025**
- Owned by the relevant ministry department and licensed under the
  **Government Open Data License - India**

Why it matters:

- gives us a free district-level daily rainfall feed already published on
  `data.gov.in`
- the OGD route is easier to operationalize than scraping presentation-only HTML

Reference:
- [Daily District-wise Rainfall Data](https://www.data.gov.in/resource/daily-district-wise-rainfall-data)

### 2. Baseline rainfall normals

Source: Open Government Data Platform India,
`District Rainfall Normal (in mm) Monthly, Seasonal And Annual : Data Period 1951-2000`

- Published on **May 31, 2013**
- Updated on **February 13, 2014**
- Fields include `STATE/UT`, `DISTRICT`, and monthly columns
- Released under **NDSAP**
- Contributor listed as **India Meteorological Department (IMD)**

Why it matters:

- gives a district baseline so we can say "April rainfall is 38% below normal"
  instead of showing raw totals only
- enables anomaly badges and seasonal context without inventing thresholds

Reference:
- [District Rainfall Normal dataset](https://www.data.gov.in/resource/district-rainfall-normal-mm-monthly-seasonal-and-annual-data-period-1951-2000)

### 3. Official verification surface

Source: India Meteorological Department `Rainfall Information`

As of **April 25, 2026**, the IMD rainfall page exposes:

- all-India district rainfall views
- daily / weekly / monthly / cumulative ranges
- district-wise rainfall distribution and monitoring links

Why it matters:

- useful for spot-verification during ingestion QA
- supports legal/comms posture because the platform can point to the official
  IMD presentation layer even if ingestion is performed from OGD datasets

Reference:
- [IMD Rainfall Information](https://mausam.imd.gov.in/responsive/rainfallinformation.php)

## Recommended implementation shape

### Phase 1

Ship a district rainfall summary card inside the existing `weather` module:

- `today / last 7 days / month-to-date rainfall`
- rainfall anomaly versus district normal
- badge: `Deficit`, `Near Normal`, `Excess`
- source banner linking to OGD + IMD

### Phase 2

Expand into a dedicated rainfall insights block:

- 30-day sparkline
- monsoon-to-date cumulative view
- water module hook: rainfall vs dam-storage direction
- farm module hook: rainfall deficit note for sowing / irrigation pressure

## Data model sketch

Possible new table:

```prisma
model DistrictRainfallSnapshot {
  id              String   @id @default(cuid())
  districtId      String
  observedOn      DateTime
  period          String   // daily | weekly | monthly | cumulative
  rainfallMm      Float
  normalRainfallMm Float?
  departurePct    Float?
  sourceName      String
  sourceUrl       String?
  retrievedAt     DateTime @default(now())
}
```

## Main integration risks

1. District naming will need slug aliases, similar to the map-request and
   geojson work already tracked in `LIVE-STATE.md`.
2. The normals dataset is older, so copy should say **normal baseline** rather
   than imply a current climate baseline.
3. OGD resource/API ergonomics need one small spike before promising cron
   ingestion.

## Recommendation

This is worth adding to the sprint tracker as a **high-fit, low-cost Phase 2
feature** because it improves three existing modules at once: weather, water,
and farm.

# 2026-04-26 — District Air Quality Monitor research

## Summary

The best next feature candidate from a free public dataset is a **District Air
Quality Monitor** that plugs into the existing overview, weather, alerts, and
health surfaces.

Why it fits:

- It is citizen-meaningful every day, not just seasonally.
- It complements the current weather and alerts modules without requiring a new
  paid data provider.
- It can launch incrementally: first as a compact card and alert ribbon, then
  as a fuller module with trends and station details.

## Public data sources

### 1. CPCB / OGD "Sameer (National Air Quality Index)"

Official source:
[Sameer (National Air Quality Index) catalog](https://ap.data.gov.in/catalog/sameer-national-air-quality-index)

What it provides:

- National Air Quality Index updates from the Central Pollution Control Board.
- Station-level pollutant monitoring context.
- Open-government distribution under NDSAP metadata on the OGD catalog.

Why it matters for FTP:

- Gives a free, official source for near-real-time AQI status.
- Supports a compact citizen-facing summary: AQI score, category, health
  message, and nearest available station.

### 2. OGD "Historical Daily Ambient Air Quality Data"

Official source:
[Historical Daily Ambient Air Quality Data](https://www.data.gov.in/catalog/historical-daily-ambient-air-quality-data)

What it provides:

- Historical daily ambient air-quality readings across monitoring stations.
- Enough depth for trends, "better/worse than last week", and rolling charts.

Why it matters for FTP:

- Lets the app move beyond a one-number AQI badge into trendlines and recurring
  pollution-pattern reporting.
- Good fit for city districts already live on the platform, especially Delhi,
  Mumbai, Kolkata, Chennai, Hyderabad, and Bengaluru Urban.

### 3. CPCB AQI program context

Official source:
[CPCB National Air Quality Index](https://cpcb.nic.in/national-air-quality-index/)

Why this page matters:

- Confirms the official AQI program and public bulletin framing.
- Useful for health-category labels, disclaimer language, and user education
  copy.

## Recommended product shape

### Phase 1

Add a compact `Air Quality` card inside:

- district overview
- weather page
- alerts page when AQI is poor or severe

Card contents:

- current AQI number
- CPCB category label
- simple health guidance
- last updated time
- nearest reporting station name

### Phase 2

Promote to a full module with:

- 7-day trend chart
- dominant pollutant
- station list and freshness
- "today vs last week" comparison
- district-level explainers for respiratory risk and outdoor activity

## Integration notes

- District coverage will vary. Rural districts may need a "nearest monitored
  station" fallback rather than pretending district-native coverage exists.
- AQI should be clearly marked as station-based and not a perfect district-wide
  measurement.
- This should reuse the existing `DataSourceBanner` and stale-data patterns.
- Alert thresholds can feed the existing alerts stack when AQI crosses severe
  bands.

## Recommendation

Add this to the sprint tracker as a **high-fit Phase 2 feature**.

The smallest useful implementation is:

1. ingest CPCB/OGD AQI for live urban districts,
2. render a compact overview/weather card,
3. add poor/severe AQI alert copy,
4. defer the full trend module until source reliability is proven.

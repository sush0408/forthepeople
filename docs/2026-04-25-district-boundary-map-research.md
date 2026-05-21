# District Boundary Map Data Research

## Recommendation

Use local, normalized GeoJSON files for runtime rendering and treat Data{Meet} as the main open boundary source for state and district maps. Keep Survey of India and state open-data portals as verification sources where redistribution terms or format conversion make direct app use slower.

## Public Sources Reviewed

1. Data{Meet} Community Maps publishes district boundaries sourced from public government/ECI material. The district dataset is available as shapefiles and documented with caveats about pre-delimitation boundaries, shifts, and missing/incorrect names in some regions. License noted by the project page: Creative Commons Attribution 2.5 India.
2. Data{Meet} Indian Village Boundaries publishes GeoJSON in WGS84/EPSG:4326 with ODbL licensing and explicit caveats that some geometry/attribute errors remain. It is useful for future village/taluk drill-down, not just district maps.
3. `guneetnarula/indian-district-boundaries` provides India district TopoJSON under MIT, derived with thanks to Data{Meet}; useful as an app-friendly visualization source, but names follow Registrar General of India and may need local aliases.
4. `udit-001/india-maps-data` provides state-wise district GeoJSON and TopoJSON links, including Telangana and Ladakh. The repository states it curates data from public internet sources and carries no explicit license, so use it only as a normalization reference unless licensing is clarified.
5. Survey of India provides official Digital Vector Data including administrative boundaries, but the portal/package flow is less convenient for direct automated redistribution than already-open community datasets.

## Current Repo State

`public/geo` already contains 34 per-state district GeoJSON files. Missing app route coverage is mainly:

- `telangana-districts.json`
- `ladakh-districts.json`
- slug alias mismatch for Dadra & Nagar Haveli and Daman & Diu (`dadra-nagar-haveli` app slug vs `dadra-nagar-haveli-daman-diu-districts.json`)

The state page map now uses inactive district polygons as district-request controls. Active polygons still navigate to the district dashboard.

## Next Sprint Items

1. Normalize Telangana and Ladakh GeoJSON into `public/geo` with explicit attribution metadata.
2. Add a state-slug to boundary-file manifest so merged/renamed UTs can reuse the correct local file.
3. Add geometry/name audits comparing GeoJSON `slug` values against `INDIA_STATES` district slugs before rendering.
4. Add source attribution display per boundary file instead of one generic DataMeet footer.


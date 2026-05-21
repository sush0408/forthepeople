# District Public Health Facilities Monitor

## Feature name and user value

- Feature: District Public Health Facilities Monitor
- User value: citizens can see whether a district has enough public health infrastructure and whether monthly service-delivery signals are improving or slipping without hunting through HMIS tables or annual PDFs.

## Source URLs

- https://www.data.gov.in/catalog/district-wise-availability-health-centres-india
- https://www.data.gov.in/catalog/item-wise-hmis-report-all-states-and-districts-across-months
- https://www.data.gov.in/resource/health-indicator-wise-monthly-datasets-sub-district-level-hmis
- https://www.data.gov.in/catalog/hospital-directory-national-health-portal
- https://www.mohfw.gov.in/?q=press-info%2F7675
- https://www.mohfw.gov.in/sites/default/files/Health%20Dynamics%20of%20India%20%28Infrastructure%20%26%20Human%20Resources%29%202022-23_RE%20%281%29.pdf

## Licensing and access notes

- The `data.gov.in` catalogs are published under the Government Open Data License - India / NDSAP and expose public catalog/API/download access.
- The MoHFW press release and Health Dynamics report are public government documents; they are usable as source references and cross-check material.
- Access is open, but some catalog pages are awkward to scrape and may require using the catalog/API download endpoints rather than HTML pages.

## Update frequency

- `Item-wise HMIS report of all States and Districts Across the Months`: updated on February 14, 2025 on OGD; effectively a recurring monthly district dataset.
- `Health indicator-wise monthly datasets at sub district level from HMIS`: updated on February 12, 2025; useful for future taluk/sub-district expansion.
- `District-Wise Availability Of Health Centres In India`: updated on August 20, 2019; useful as a baseline structure but stale for live facility counts.
- `Hospital Directory (National Health Portal)`: updated on January 12, 2018; likely too stale for operational counts, but still useful for facility metadata experiments.
- `Health Dynamics of India (Infrastructure & Human Resources) 2022-23`: released by MoHFW on September 9, 2024; annual infrastructure/manpower reference.

## District and state granularity

- District-level: yes, across HMIS and Health Dynamics / Rural Health Statistics style sources.
- State-level: yes, all listed sources support at least state grouping.
- Sub-district: partially available through the HMIS sub-district resource, but not guaranteed to map cleanly to the app's taluk model in every state.

## Available data fields

- District health-centre availability catalog: district, state, counts of Sub-Centres, PHCs, CHCs, Sub-Divisional Hospitals, and District Hospitals.
- HMIS district item-wise dataset: district, parameter name, type, month columns, and indicator values across public-health service categories.
- HMIS sub-district dataset: sub-district/facility-oriented monthly indicator values for deeper drill-down later.
- Hospital directory: hospital name, category, system of medicine, location, PIN code, contact fields, website, and specializations.
- Health Dynamics report / press release: district-level facility counts plus annual manpower and infrastructure context.

## Data quality concerns

- The cleanest district-count dataset on OGD is stale; it cannot be treated as current live infrastructure without an annual cross-check.
- HMIS indicator files are wide, category-heavy, and can mix utilization indicators with infrastructure proxies, so metric selection matters.
- District names and spellings will likely drift across HMIS, Health Dynamics, and app district slugs.
- Some HMIS notes warn about provisional figures, reporting completeness, and mixed public/private or rural/urban rollups.
- Hospital directory freshness is weak enough that it should not drive primary counts.

## Implementation risks

- Parsing the HMIS monthly dataset into a stable district metric model will require indicator selection and mapping, not just row import.
- District alias normalization will be necessary before joining HMIS rows to existing state/district config.
- The stale 2018/2019 facility catalogs may mislead users if shown without year/source labeling.
- A combined feature may need two freshness tracks: annual infrastructure baseline and monthly service-delivery trend.

## Privacy and legal concerns

- These are public aggregate government datasets, so privacy risk is low if the app stays at district or facility-institution level.
- Do not surface personal contact details unless they are clearly institutional and necessary for user value.
- Avoid framing annual or lagged facility counts as real-time availability.

## Split implementation tasks

1. Data model
   - Add a district health-facilities snapshot model keyed by district, source, reporting period, and metric family.
   - Separate annual infrastructure counts from monthly HMIS indicator series.
2. Scraper / import / API
   - Prototype OGD ingestion for district facility counts and district item-wise HMIS monthly data.
   - Add district-name alias normalization and a `/api/data/health-facilities` response that carries source year/month explicitly.
3. UI surface
   - Add a `health` or `schools`-style district module card for facility footprint, reporting trend, and source freshness.
   - Present annual baseline and monthly trend as distinct blocks to avoid fake real-time interpretation.
4. Tests
   - Cover district alias mapping, stale-year labeling, empty HMIS months, malformed wide-row parsing, and fallback API states.
5. Rollout / backfill
   - Pilot Karnataka first, verify district-name joins and a handful of HMIS indicators, then backfill other states once metric selection is stable.

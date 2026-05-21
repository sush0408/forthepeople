# District MGNREGA Employment & Payments Monitor Research

## Feature name and user value

- Feature: District MGNREGA Employment & Payments Monitor
- User value: show district-level rural employment demand, work provided, persondays, expenditure, and payment throughput in one public dashboard so citizens can track whether guaranteed-work delivery is moving without forcing them through the full MIS workflow.

## Source URLs

- OGD dataset: [District-wise MGNREGA Data at a Glance](https://www.data.gov.in/resource/district-wise-mgnrega-data-glance)
- OGD catalog: [MGNREGA catalog](https://www.data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega)
- District normalization reference: [LGD - Districts](https://www.data.gov.in/resource/local-government-directory-lgd-districts)
- Official program portal: [NREGA / MoRD MIS](https://nrega.dord.gov.in/)

## Licensing and access notes

- The OGD dataset page says the content is licensed under the [Government Open Data License - India](https://www.data.gov.in/godl) and the catalog is released under NDSAP.
- The OGD dataset is public and downloadable, but the search snippet notes that an API is not currently exposed for this resource, so ingestion likely starts with file download/import rather than direct API pulls.
- The LGD districts dataset is also on OGD under the same portal licensing model and can be used for normalization/reference joins.
- The NREGA MIS portal is public for browsing, but licensing is less explicit there than on OGD, so ForThePeople should prefer OGD as the primary import surface and use the MIS only for verification or gap analysis.

## Update frequency

- The OGD search result for the district-wise MGNREGA resource marks the granularity as `Daily`.
- The resource page showed `Updated On 04/05/2026` when checked on May 7, 2026.
- LGD districts showed `Updated On 06/05/2026` when checked on May 7, 2026.

## District/state granularity

- The core MGNREGA resource is explicitly district-wise, with `state_name` and `district_name` fields in the result summary.
- This fits ForThePeople’s district dashboards directly.
- Some districts in ForThePeople’s config may still need alias reconciliation against LGD or OGD spellings before joining.

## Available data fields

- The search result summary for the district-wise resource lists at least:
  `SNo.`, `state_name`, `district_name`, `Total No. of JobCards issued`, `Total No. of Workers`.
- Dataset keywords and summary text also indicate coverage around `Jobcard`, `Asset`, and `FTO`, which suggests the extract is broad enough to support household/worker counts and some transaction or output-oriented metrics.
- Based on the resource framing, the likely high-value MVP metrics are:
  job cards issued,
  workers,
  households demanding work,
  households provided work,
  persondays,
  expenditure,
  FTO/payment-related aggregates,
  and asset/work counts where present in the extract.
- Exact field names still need one real file download before schema lock.

## Data quality concerns

- District naming drift is likely: legacy spellings, renamed districts, merged/split districts, and variations between OGD, LGD, and ForThePeople config will need alias tables.
- Daily aggregates can be operationally noisy because late uploads, backlog clearances, or payment batch processing may create sudden jumps that are not real on-the-ground daily changes.
- Metrics like work demand, work provided, and payments have policy meaning; mislabeling them could mislead users about legal compliance vs. administrative throughput.
- Historical coverage and field completeness may vary across states and years.
- OGD summary metadata is thinner than a full data dictionary, so implementation should not assume every field is nationally complete until sample files are profiled.

## Implementation risks

- No public resource API is surfaced on the OGD page, so imports may require scheduled file download and parsing rather than incremental API syncs.
- Alias joins against newly created or renamed districts could silently misroute data if LGD normalization is not enforced.
- MGNREGA is rural; urban districts or mixed urban-heavy districts may need careful copy so users understand why reported activity can be low or absent.
- If payment/FTO metrics are included, they may require separate explanatory UI because operational payment pipeline fields are not self-explanatory to non-specialist users.
- Local dev may frequently run with empty DB state, so fallback copy must stay honest and not imply missing demand equals zero demand.

## Privacy and legal concerns

- Do not ingest or display worker-level job card, muster roll, or personally identifiable records.
- Restrict the feature to district-level aggregates only.
- Where official public surfaces expose household or worker detail pages, treat those as out of scope for ForThePeople’s public UI.
- Aggregate presentation under OGD/NDSAP is low-risk, but the product should still avoid combining fields in ways that enable indirect identification in very small districts or narrow sub-breakdowns.

## Split implementation tasks

1. Data model
   Add district MGNREGA snapshot tables keyed by state slug, district slug, financial year, snapshot date, metric family, and source metadata.
2. Scraper/import/API
   Build an importer for the OGD district extract, normalize district names through LGD/alias mapping, and expose `/api/data/mgnrega` with freshness and fallback metadata.
3. UI surface
   Add a rural livelihoods/public works card with demand vs provided work, persondays, expenditure, payment status, and source-date labeling.
4. Tests
   Cover alias joins, malformed numeric parsing, daily freshness copy, rural-only interpretation, and empty-local fallback behavior.
5. Rollout/backfill
   Pilot one state, validate joins and semantics, then backfill nationally once the schema and copy are stable.

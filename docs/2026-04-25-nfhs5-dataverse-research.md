# NFHS-5 District Enrichment Research

Date: 2026-04-25

## Candidate feature

Integrate district-level NFHS-5 indicators into the Population module so the
 current placeholder cards for household amenities, internet/bank access, and
 child-marriage indicators become real data-backed charts and callouts.

## Free/public source

- Primary candidate: Harvard Dataverse mirror referenced in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/MODULE-POPULATION.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/MODULE-POPULATION.md)
- Dataset: `doi:10.7910/DVN/42WNZF`
- Licence: `CC-BY 4.0`
- Cost: free
- Risk: lower than scraping the reorganized IIPS site because it provides a
  stable downloadable mirror and explicit reuse terms

## Why this is worth integrating

- The Population module already ships placeholder NFHS rows for active
  districts, so there is a visible product gap today.
- The dataset is additive to the current schema and lines up with an existing
  documented Phase 2 backlog item.
- It improves a citizen-facing module with measurable value and no paid vendor
  dependency.

## Proposed scope

1. Map NFHS-5 district indicators to the existing `DemographicProfile` model
   instead of creating another parallel store.
2. Backfill the currently active districts first, then expand to all seeded
   Karnataka districts.
3. Surface data-age/source cards the same way Population v2 already does for
   Census and MPI.
4. Mark indicators that are sample-based or non-comparable to Census values.

## Suggested implementation slices

1. Build an importer script that normalizes district names and writes NFHS rows.
2. Add source metadata constants and chart mappings for the first 6-8 high-value
   indicators.
3. Add admin audit coverage for NFHS completeness so missing rows stay visible.

## Constraints

- District naming will need a normalization pass because NFHS naming may not
  match the current slug seed exactly.
- The module must keep clear source separation from Census 2011 and MPI data to
  avoid misleading comparisons.
- Vijayanagara-style post-bifurcation districts will likely need explicit
  exclusions or notes.

## Recommendation

Take this as the next public-data integration feature after the current
maintenance sweep. It has a documented need, a free/licensed source, and a
clear path to shipping incrementally without product-risky scraping.

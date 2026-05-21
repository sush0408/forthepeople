# ForThePeople.in — Live State

_Living document. Append new sections; don't rewrite history._

---

## 2026-05-11: Locale-safe support routing + empty-state standardization + soil moisture research

- Fixed a focused batch of **6 concrete issues** in the locale/support shell and shared routing helpers:
  `withLocalePath` incorrectly prefixed hash-only links such as `#support`,
  `withLocalePath` incorrectly prefixed query-only links such as `?tab=faq`,
  `withLocalePath` could corrupt special/external hrefs like `mailto:` and protocol-relative URLs when passed through locale-aware link wrappers,
  localized district metadata helpers inserted a stray slash before query/hash suffixes (for example `/?tab=water`),
  localized absolute URL builders produced double slashes when `NEXT_PUBLIC_SITE_URL` or a caller-supplied base URL ended with `/`,
  and contributor-count banner copy could surface misleading refresh text for non-finite or negative totals instead of falling back to an honest temporary state.
- Picked **3 actionable tracker items and completed them** in this pass:
  locale-safe support/internal link handling,
  canonical URL normalization for locale metadata helpers,
  and shared empty-state shell standardization away from the old dashed alert/emoji treatment.
- Added **3 UI/UX improvements** that reduce cognitive load:
  district empty states now use the existing rounded bordered card style with lucide icons instead of dashed alert boxes and large emoji,
  support-page section headers and help-item affordances now use a consistent icon language instead of mixed emoji/glyph arrows,
  and shared contributor fallback copy now distinguishes bad count payloads from real zero-supporter states instead of risking confusing totals.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/site-metadata.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/site-metadata.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts).
- Research logged for a public-data **District Soil Moisture Monitor** candidate using the OGD soil-moisture catalog and state resource pages from the National Water Informatics Centre / India-WRIS surface. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-11-district-soil-moisture-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-11-district-soil-moisture-monitor-research.md).

### Research backlog split

- Feature candidate: District Soil Moisture Monitor
- Value: users can understand district-level dryness/wetness pressure in the farm or water surface without pretending the source offers taluk or parcel precision.
- Task split:
  1. Data model: add district soil-moisture snapshots keyed by state, district, observed date, and source metadata.
  2. Scraper/import/API: discover public state resource files, normalize district aliases, and expose `/api/data/soil-moisture` with freshness/coverage metadata.
  3. UI surface: add a district-average soil-moisture card with level, volume, and explicit "district average" copy in farm or water modules.
  4. Tests: cover alias joins, invalid numeric parsing, duplicate day rows, stale snapshots, and local-empty fallback behavior.
  5. Rollout/backfill: pilot a small state set first, then expand only after file discovery and coverage gaps are understood.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `error: cannot open '.git/FETCH_HEAD': Operation not permitted`,
  and the configured `origin` is still `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because local dev startup is still blocked in this sandbox:
  `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:3000`.
- Remaining risk: empty-state cards are now visually consistent, but their body copy is still English-only on localized routes; that should be folded into the broader i18n work already in progress rather than patched ad hoc per module.

## 2026-05-10: Homepage locale continuity + request coverage honesty + crop baseline research

- Fixed a focused batch of **8 concrete issues** in the active homepage request/stats/preview surface:
  the request coverage bar fabricated a non-zero fill even if active coverage were ever `0 / 780`,
  localized request routes still fell back to English for the `most requested count` helper line because the dictionary key was missing,
  localized request routes still fell back to English for state options with pending district counts because the dictionary key was missing,
  localized request routes still fell back to English for fully covered state option labels because the dictionary key was missing,
  homepage stats cards hardcoded English labels on localized routes,
  homepage stats status copy hardcoded English fallback/live messaging on localized routes,
  homepage live-preview status/title/link/empty-state copy hardcoded English on localized routes,
  and the homepage live-preview card headers still used noisy emoji markers instead of the existing icon language, which increased scanning noise on the primary surface.
- Picked **3 actionable tracker items and completed them** in this pass:
  homepage locale continuity for request copy gaps,
  homepage locale continuity for stats/live-preview shell copy,
  and honest zero-progress rendering for district launch coverage.
- Added **3 UI/UX improvements** that reduce cognitive load:
  homepage preview cards now use a consistent lucide icon treatment instead of mixed emoji markers,
  homepage stats and preview sections now keep shell copy localized on active Hindi/Kannada routes instead of mixing English status text into the page,
  and the request coverage bar no longer implies launch progress that does not exist.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts).
- Research logged for a public-data **District Crop Production Baseline** candidate using the OGD crop production catalog from the Directorate of Economics and Statistics. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-10-district-crop-production-baseline-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-10-district-crop-production-baseline-research.md).

### Research backlog split

- Feature candidate: District Crop Production Baseline
- Value: users can compare district crop mix, area, and production by season/year so the agriculture surface has long-horizon context alongside daily mandi prices.
- Task split:
  1. Data model: add district crop production snapshots keyed by state, district, crop, season, and year with source metadata.
  2. Scraper/import/API: profile the OGD export, normalize aliases, and expose `/api/data/crop-production-baseline`.
  3. UI surface: add a baseline crop mix/output card in the farm/crops surface with explicit year and season labels.
  4. Tests: cover alias joins, zero-area rows, derived-yield safeguards, stale-year copy, and local-empty fallback behavior.
  5. Rollout/backfill: pilot one state first, then backfill nationally after importer profiling confirms stable schema.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `error: cannot open '.git/FETCH_HEAD': Operation not permitted`,
  and the configured `origin` is still `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because no local dev server was started in this sandboxed run, so the homepage locale/icon changes were validated by component code paths and tests only.
- Remaining risk: the homepage shell is now locale-aware, but preview row metadata such as district names and weather condition strings still come from live records and static config, so any future fully localized data-label strategy will need source-level localized aliases rather than shell translation alone.

---

## 2026-05-09: Homepage preview route honesty + request-name normalization + PM SVANidhi research

- Fixed a focused batch of **8 concrete issues** in the homepage preview/request/stats surface:
  district-request state lookup failed when API/localized records differed only by casing,
  district-request district lookup had the same casing fragility,
  top-request leaderboard parsing preserved internal whitespace variants and could miss downstream district localization joins,
  homepage preview crop-card footer links always drilled into the first active district instead of the district actually surfaced by the crop rows,
  homepage preview dam-card footer links had the same wrong-district routing bug,
  homepage preview news-card footer links had the same wrong-district routing bug,
  dam preview labels could show invalid negative or >100 percentages even though the visual bar was clamped,
  and degraded homepage-stats API responses with a non-empty district table did not mark themselves as fallback, so the homepage copy looked like live data during partial DB failure.
- Picked **3 actionable tracker items and completed them** in this pass:
  homepage preview drilldown routing honesty,
  request/leaderboard normalization hardening,
  and honest degraded homepage-stats messaging.
- Added **4 UI/UX improvements** that reduce cognitive load:
  homepage preview crop/dam/news cards now route to the district users just saw instead of a different default district,
  homepage preview fallback copy now distinguishes a local `no-active-districts-in-db` state from a transient live-feed reconnect state,
  weather rows now fall back to readable title-cased district labels instead of raw hyphenated slugs,
  and dam percentage text now matches the clamped visual bar so users do not see contradictory numbers and graphics.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts).
- Research logged for a public-data **Karnataka District PM SVANidhi Beneficiary Monitor** candidate using OGD parliamentary-answer extracts plus MoHUA scheme context. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-09-pm-svanidhi-karnataka-beneficiary-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-09-pm-svanidhi-karnataka-beneficiary-monitor-research.md).

### Research backlog split

- Feature candidate: Karnataka District PM SVANidhi Beneficiary Monitor
- Value: users can inspect district-level street-vendor credit uptake in Karnataka without exposing any vendor-level personal or financial record.
- Task split:
  1. Data model: add PM SVANidhi aggregate snapshots keyed by state, district, snapshot date, and source metadata.
  2. Scraper/import/API: ingest the public OGD Karnataka district extract, normalize district aliases, and expose `/api/data/pm-svanidhi`.
  3. UI surface: add a Karnataka-only urban livelihoods / street-vendor credit card with beneficiary count, rank, and dated-snapshot copy.
  4. Tests: cover alias joins, duplicate rows, missing counts, stale snapshots, and non-Karnataka empty fallback behavior.
  5. Rollout/backfill: ship a Karnataka pilot from the January 27, 2025 snapshot and only expand after comparable district tables exist elsewhere.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `error: cannot open '.git/FETCH_HEAD': Operation not permitted`,
  and the configured `origin` is still `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because no local dev server was started in this sandboxed run, so the homepage preview routing/copy changes were validated by code path and tests only.
- Remaining risk: homepage preview card footers now follow the surfaced district rows, but the cards still expose only one drilldown CTA per module; if users need per-row navigation later, that should become explicit row-level links rather than reusing a single footer.

---

## 2026-05-08: District-request localization + submission hardening + JJM research

- Fixed a focused batch of **7 concrete issues** in the homepage/request/map slice:
  the shared district-request submission parser treated malformed or empty POST payloads as success,
  the district-request POST route only edge-trimmed names and could create duplicate rows from internal whitespace variants,
  DB-backed top-request ranking had nondeterministic tie ordering,
  memory-fallback top-request ranking had the same nondeterministic tie ordering,
  homepage request state options stayed English-only on localized routes,
  homepage request district options plus success/leaderboard interpolations stayed English-only on localized routes,
  and map request tooltips/toasts continued to show English district names even when static local names already existed in config.
- Picked **3 actionable tracker items and completed them** in this pass:
  strict malformed-response handling for district-request submissions,
  deterministic request leaderboard ordering,
  and localized proper-name continuity for homepage request and map request surfaces.
- Added **4 UI/UX improvements** that reduce cognitive load:
  localized routes now show bilingual state option labels instead of forcing users to translate English-only proper names,
  localized routes now show bilingual district option labels in the request picker,
  success and leaderboard copy now reuse localized district/state labels instead of mixing English proper names into Hindi/Kannada shell copy,
  and map request tooltips/toasts now use localized district labels where static config already has them.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts).
- Research logged for a public-data **District Jal Jeevan Mission Tap-Water Coverage Monitor** candidate using the public JJM dashboard plus OGD district extracts. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-08-jal-jeevan-mission-tap-water-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-08-jal-jeevan-mission-tap-water-monitor-research.md).

### Research backlog split

- Feature candidate: District Jal Jeevan Mission Tap-Water Coverage Monitor
- Value: citizens can inspect district-level rural tap-water connection coverage with honest freshness instead of navigating multiple dashboards.
- Task split:
  1. Data model: add district JJM coverage snapshots keyed by state, district, source, and snapshot date.
  2. Scraper/import/API: start from one stable OGD district export plus dashboard freshness metadata, then expose `/api/data/jjm`.
  3. UI surface: add a rural water-access coverage card with numerator, denominator, percentage, and freshness copy.
  4. Tests: cover district alias joins, denominator changes, stale snapshots, zero-household rows, and local-empty fallback behavior.
  5. Rollout/backfill: pilot Karnataka first, then add more states only after cross-state join quality is proven.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `cannot open '.git/FETCH_HEAD': Operation not permitted`,
  and the configured `origin` is still `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because local Next dev cannot bind a port in this sandbox:
  `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:3000`.
- Remaining risk: localized proper names now render in the homepage request and map request surfaces, but API-backed request records still persist only canonical English state/district names, so any future fully localized district leaderboard or analytics view will need an explicit presentation-layer localization step rather than reading raw names directly.

## 2026-05-08: Homepage freshness honesty + request-state scanning + PM-KISAN research

- Fixed a focused batch of **6 concrete issues** in the homepage and district-request surface:
  homepage stats freshness only considered crop and weather timestamps and ignored newer dam updates,
  homepage stats freshness also ignored newer district news updates,
  homepage stat counters could keep a stale non-zero animated value after the backing total dropped to zero or changed direction,
  aggregate homepage news preview rows still surfaced untrimmed blank titles/sources because the cross-district card path skipped normalization,
  map request submissions treated any HTTP 200 response as success even when the payload explicitly returned `success: false`,
  and district-request fallback submissions did not clear the cached leaderboard, so a DB-fallback request could stay hidden behind stale top-request results.
- Picked **3 actionable tracker items and completed them** in this pass:
  homepage freshness aggregation across all active preview feeds,
  honest district-request response handling across homepage and map request paths,
  and request-form scanning improvements for states with pending district coverage.
- Added **3 UI/UX improvements** that reduce cognitive load:
  the homepage request state picker now sorts states with pending districts first instead of making users scan fully-covered states first,
  state options now show whether districts are still pending or already fully live,
  and the request form now disables state/district pickers during submission while showing the current public request count for the most-requested district.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/data-freshness.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/data-freshness.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-freshness.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-freshness.test.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts).
- Research logged for a public-data **District PM-KISAN Beneficiary Monitor** candidate using OGD PM-KISAN resources plus PIB annexures. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-08-pm-kisan-beneficiary-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-08-pm-kisan-beneficiary-monitor-research.md).

### Research backlog split

- Feature candidate: District PM-KISAN Beneficiary Monitor
- Value: citizens can see district beneficiary counts, payment-period context, and verification friction without exposing any individual farmer record.
- Task split:
  1. Data model: add PM-KISAN aggregate snapshots keyed by state, district, granularity, installment/period, and snapshot date.
  2. Scraper/import/API: start with one stable district dataset plus one village/gender dataset, normalize district aliases, and expose `/api/data/pm-kisan` with freshness metadata.
  3. UI surface: add an agriculture-support card with beneficiary totals, period labels, and optional village/gender breakdowns only where the source actually provides them.
  4. Tests: cover mixed granularity, stale snapshots, alias joins, missing installment labels, and low-count breakdown suppression.
  5. Rollout/backfill: pilot a single state first, then scale only after transport shape and district joins are stable.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `Could not resolve host: github.com`,
  and the current `origin` still points to `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because local dev still cannot bind a port in this sandbox:
  `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:3000`.
- Remaining risk: the request form is now more honest and easier to scan, but district and state labels still come from static config names, so localized routes will continue to show many proper names in English until local-name option labels are threaded through the selection UI.

## 2026-05-07: Homepage preview fallback hardening + MGNREGA research

- Fixed a focused batch of **8 concrete issues** in the homepage stats/preview slice:
  homepage preview weather rows dropped valid `0°C` readings because zero was treated as empty,
  malformed weather condition strings could leak untrimmed labels into the shell,
  malformed dam names could render blank preview rows,
  invalid dam storage percentages could render unsafe `NaN` values into labels and bars,
  malformed crop commodity/price rows could render blank labels or `NaN` prices,
  malformed news titles/sources could surface empty metadata strings,
  invalid health scores could render `NaN` badges in preview consumers,
  and homepage preview API failures or empty-local-active-district states returned a blank surface instead of a static-config fallback that preserves navigation.
- Picked **3 actionable tracker items and completed them** in this pass:
  homepage local-empty-DB fallback continuity,
  malformed homepage preview row normalization,
  and homepage live-preview cognitive-load reduction.
- Added **3 UI/UX improvements** that reduce cognitive load:
  the homepage live-data strip now says explicitly when it is showing static district coverage instead of live feeds,
  the weather preview card now shows only the first four districts plus a clear overflow hint instead of turning into a tall noisy list,
  and the homepage stats footer now switches to honest fallback copy when the live stats request fails instead of always claiming fresh sync cadence.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-fallbacks.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-fallbacks.test.ts).
- Research logged for a public-data **District MGNREGA Employment & Payments Monitor** candidate using OGD MGNREGA aggregates plus LGD district normalization. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-07-mgnrega-employment-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-07-mgnrega-employment-monitor-research.md).

### Research backlog split

- Feature candidate: District MGNREGA Employment & Payments Monitor
- Value: citizens can see demand, work provided, persondays, payment throughput, and asset creation at district level without exposing worker-level records or forcing users into the full MIS portal.
- Task split:
  1. Data model: add district MGNREGA snapshot tables keyed by state, district, financial year, report date, and metric family with explicit source metadata.
  2. Scraper/import/API: ingest the district-wise OGD extract, normalize names against LGD/ForThePeople district aliases, and expose an honest `/api/data/mgnrega` surface with freshness and coverage metadata.
  3. UI surface: add a rural livelihoods/public works card with demand-vs-provided work, persondays, expenditure, and payment status labels that clearly distinguish aggregate performance from entitlement guarantees.
  4. Tests: cover alias joins, daily snapshot freshness, zero-demand districts, malformed numeric fields, and empty-local fallback behavior.
  5. Rollout/backfill: pilot a single-state import first, validate joins and metric semantics, then backfill nationally only after the schema is stable.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  the requested upstream is `https://github.com/jayanthmb14/forthepeople`, but the current `origin` is `https://github.com/sush0408/forthepeople`,
  and direct fetch still fails here because `git fetch https://github.com/jayanthmb14/forthepeople.git main` cannot resolve `github.com`.
- Browser verification was **not** completed in this pass because local dev startup is blocked in this sandbox:
  `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:3000`,
  so the next frontend-capable run should visually confirm the new homepage fallback/status copy in the in-app browser once a bindable local port is available.
- Remaining risk: homepage preview fallbacks now preserve navigation and avoid blank cards, but they intentionally do not fabricate live values, so the cards can still look sparse until real district feeds or seeded local data are available.

## 2026-05-06: District-request parser hardening + localized state maps + UDID research

- Fixed a focused batch of **10 concrete issues** in the shared homepage/request/map slice:
  the homepage district-request submit path assumed every POST failure returned valid JSON and could surface a raw parse error,
  request hints treated whitespace-only state names as valid selections,
  request hints could interpolate untrimmed state labels into user-visible copy,
  top-request parsing accepted blank request ids,
  top-request parsing accepted blank state names,
  top-request parsing accepted blank district names,
  top-request parsing accepted invalid counts like `NaN` or negative numbers,
  the state-map shell still hardcoded English loading/explainer copy,
  the generic state map still hardcoded English loading/failure/tooltip/toast/legend copy,
  and the Karnataka map still hardcoded English tooltip/toast/legend copy.
- Picked **3 actionable tracker items and completed them** in this pass:
  district-request parser hardening for malformed local/fallback payloads,
  localized request/map shell continuity for active dictionaries,
  and clearer map loading/request feedback for the district exploration surface.
- Added **4 UI/UX improvements** that reduce cognitive load:
  map cards now explain both actions up front (`explore` vs `request`) instead of a generic click prompt,
  generic state maps now show a loading state instead of rendering a blank hole while GeoJSON fetches,
  request toasts on both map variants now auto-dismiss instead of lingering over the map indefinitely,
  and map request/status messaging now uses the active locale instead of mixing English shell copy into localized routes.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-map.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-map.test.ts).
- Research logged for a public-data **District UDID Coverage Monitor** candidate using OGD and DEPwD sources. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-06-udid-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-06-udid-monitor-research.md).

### Research backlog split

- Feature candidate: District UDID Coverage Monitor
- Value: citizens can inspect public disability-ID issuance coverage by district without exposing beneficiary-level data or forcing logins into the official workflow.
- Task split:
  1. Data model: add district UDID aggregate snapshots keyed by state, district, disability type, age group, gender, and snapshot date.
  2. Scraper/import/API: download/profile the OGD extract, normalize district aliases, and expose a `udid` data surface with honest freshness metadata.
  3. UI surface: add a district accessibility/welfare card with totals, safe breakdowns, and explicit copy that this is issuance activity rather than disability prevalence.
  4. Tests: cover stale snapshots, alias joins, low-count handling, missing split buckets, and empty-local fallback behavior.
  5. Rollout/backfill: pilot a single import run, validate joins, then expand to national backfill once the schema is stable.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `Could not resolve host: github.com`.
- Browser verification was **not** completed in this pass. No local dev server or in-app browser session was started after the request/map UI changes, so the next frontend run should visually confirm localized map hints, loading copy, and auto-dismissing request toasts on both Karnataka and generic state maps.
- Remaining risk: map/request shell copy is now localized, but state and district option labels still come from static config names, so non-English routes will continue to show many proper names in English until district-local names are threaded through the config.

## 2026-05-05: Cross-state district identity hardening + homepage preview clarity + rural housing research

- Fixed a focused batch of **8 concrete issues** across shared compare/search/homepage behavior:
  compare selections encoded only the district slug so duplicate slugs across states could resolve to the wrong district,
  compare dropdown row keys also collided for duplicate slugs,
  header search result keys collided for duplicate district slugs across states,
  homepage drilldown search result keys collided for duplicate district slugs across states,
  homepage active-district card keys collided for duplicate district slugs across states,
  homepage preview district ordering depended on an unstated database order,
  homepage preview news timestamps could render negative `m ago` values for future-skewed timestamps,
  and homepage dam bars could emit invalid negative widths when bad data produced sub-zero percentages.
- Picked **3 actionable tracker items and completed them** in this pass:
  cross-state district identity hardening for shared selectors/search,
  homepage preview empty-state/card-context clarity,
  and district-level rural housing feature research for the public-data backlog.
- Added **4 UI/UX improvements** that reduce cognitive load:
  compare selectors now show `District, State` so duplicate slugs are distinguishable,
  homepage crop/dam/news preview rows now include district context instead of unlabeled values,
  homepage preview empty states now use module-specific copy instead of a generic `No data available`,
  and homepage weather icons now classify conditions case-insensitively so obvious weather states do not silently degrade.
- Added focused helper coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-selection.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-selection.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-selection.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-selection.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts).
- Research logged for a public-data **District Rural Housing Progress Monitor** candidate using PMAY-G official public dashboard/reporting surfaces plus the OGD catalog. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-05-rural-housing-progress-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-05-rural-housing-progress-monitor-research.md).

### Research backlog split

- Feature candidate: District Rural Housing Progress Monitor
- Value: citizens can inspect PMAY-G rural housing progress, sanctions, completions, and funds at district level without falling into beneficiary-search flows.
- Task split:
  1. Data model: add rural-housing snapshots keyed by state, district, phase, report date, and source metadata.
  2. Scraper/import/API: ingest PMAY-G report views, normalize district aliases, and expose `/api/data/rural-housing`.
  3. UI surface: add a rural-only housing progress card with sanctioned/completed/funds metrics plus source and freshness labels.
  4. Tests: cover phase normalization, district alias joins, rural-only copy, missing report dates, and local-empty fallback behavior.
  5. Rollout/backfill: pilot one state first, then expand only after district-join and cadence validation.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `Could not resolve host: github.com`.
- Browser verification was **not** completed in this pass. No local dev server or in-app browser session was started after the compare/homepage changes, so the next frontend run should visually confirm the compare selector labels and homepage preview row context/empty states.
- Remaining risk: the compare page now accepts state-scoped selections, but any external links still using the older slug-only `a=<district>&b=<district>` query shape will fall back to the default state pair until they are updated to the new `state::district` encoding.

## 2026-05-04: State-aware district data plumbing + honest API statuses + sanitation research

- Fixed a focused batch of **8 concrete issues** in the shared district data path:
  unified module-cache keys ignored `state`,
  React Query district-cache keys ignored `state`,
  unified district lookup resolved by district slug alone even when a state slug was supplied,
  duplicate district slugs like `mandya` could therefore collide across states in both server and client caches,
  unknown districts came back as `200` success payloads instead of a real `404`,
  unknown modules came back as `200` success payloads instead of a real `400`,
  homepage stats rendered missing freshness as `Live`,
  and homepage freshness used a bespoke formatter that could drift from the app's shared missing/invalid/future timestamp behavior.
- Picked **3 actionable tracker items and completed them** in this pass:
  state-aware district cache/query scoping,
  honest unified API status handling for bad district/module requests,
  and homepage/overview empty-state clarity for local-empty-data conditions.
- Added **4 UI/UX improvements** that reduce cognitive load:
  homepage stats now show shared freshness copy like `Awaiting first sync` instead of fake-live wording,
  compact overview empty states now show both title and body instead of body-only copy,
  overview budget empty states now use budget-specific messaging instead of the generic fallback,
  and the standalone empty-state footer no longer promises a speculative `Within 1 week` ETA.
- Added focused shared-helper coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-data.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-data.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-data.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-data.test.ts),
  and reused the existing shared freshness coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts).
- Research logged for a public-data **District Rural Sanitation Coverage Monitor** candidate using SBM-G OGD resources. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-rural-sanitation-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-rural-sanitation-monitor-research.md).

### Research backlog split

- Feature candidate: District Rural Sanitation Coverage Monitor
- Value: citizens can inspect rural toilet-coverage progress and district sanitation reporting without leaving the app for ministry dashboards.
- Task split:
  1. Data model: add district sanitation snapshots with rural-coverage metrics, snapshot dates, and source metadata.
  2. Scraper/import/API: ingest the SBM-G OGD district resource, normalize district aliases, and expose `/api/data/sanitation`.
  3. UI surface: add a clearly rural-only sanitation card with coverage, freshness, and trend labeling.
  4. Tests: cover alias joins, rural-only copy, stale timestamps, saturated coverage, and empty local fallback behavior.
  5. Rollout/backfill: pilot Karnataka first, then expand nationally after join validation.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  `node --experimental-strip-types --test tests/*.test.ts`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `Could not resolve host: github.com`.
- Browser verification was **not** run in this pass. No local dev server was started after the shared hook/API/homepage copy changes, so the next frontend run should visually confirm the homepage stats freshness card and overview compact empty states.
- Remaining risk: the unified API now scopes cache/query behavior by `state`, but legacy cache invalidation helpers elsewhere in the repo still use district-only cache keys. That is safe for untouched routes today, but any future expansion of state-aware module invalidation should migrate those invalidators to the same shared helper.

## 2026-05-04: District-request resilience + localized homepage request card + public-health facilities research

- Fixed a focused batch of **7 concrete issues** across the homepage request flow and shared search chrome:
  district-request cache invalidation silently no-oping on `ttl=0`,
  district-request GET handling trusting any JSON shape and breaking into misleading empty states,
  homepage district-request POST submission bypassing the shared trimmed payload helper,
  homepage district-request success state trapping the card after one submission,
  homepage district-request error copy staying visible while users changed selections,
  header search treating whitespace-only input as a real query and showing false no-results states,
  and the homepage district-request shell staying English-only on localized routes.
- Picked **3 actionable tracker items and completed them** in this pass:
  homepage district-request submission resilience,
  shared header-search query gating,
  and localized homepage request-shell copy for active dictionaries.
- Marked one stale tracker risk as no longer correct:
  the earlier note about localized `/contribute` and `/feedback` metadata being uneven is outdated in the current tree because those locale-aware canonical helpers are already present.
- Added **4 UI/UX improvements** that reduce cognitive load:
  the localized homepage request card now uses Hindi/Kannada copy where dictionaries exist,
  successful district requests now offer a direct “request another” path instead of locking the form,
  state/district changes clear stale submission errors immediately,
  and whitespace-only search preserves the quick-links state instead of showing a fake empty result.
- Added focused helper coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/chrome.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/chrome.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts).
- Research logged for a public-data **District Public Health Facilities Monitor** candidate using OGD HMIS + Health Dynamics / Rural Health Statistics sources. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-public-health-facilities-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-public-health-facilities-monitor-research.md).

### Research backlog split

- Feature candidate: District Public Health Facilities Monitor
- Value: district citizens can compare baseline public-health facility footprint with monthly service-delivery signals instead of relying on statewide press statements.
- Task split:
  1. Data model: add annual infrastructure snapshots plus monthly HMIS district indicator series with explicit source-period labeling.
  2. Scraper/import/API: ingest OGD district health-centre counts + HMIS item-wise district data, normalize district aliases, and expose `/api/data/health-facilities`.
  3. UI surface: add a facility-footprint + reporting-trend card inside a health-facing district surface with separate annual/monthly freshness labels.
  4. Tests: cover district alias joins, stale-year copy, malformed HMIS row parsing, empty-month fallbacks, and API fallback behavior.
  5. Rollout/backfill: pilot Karnataka first, validate metric selection, then expand state-by-state.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test`,
  full `npm test`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Browser verification was **not** completed in this pass. No in-app browser capability surfaced through tool discovery in this session, and no local dev-server/browser run was started after the homepage/search changes, so the next frontend run should visually sanity-check the localized homepage request card and header search overlay.
- Upstream sync is currently blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `Could not resolve host: github.com`, and the existing `origin` remote points to `https://github.com/sush0408/forthepeople`.
- Remaining risk: the request card shell is now localized for active dictionaries, but state and district option labels still come from static config names, so non-English routes will continue to show many district names in English until district-local names are threaded into select options.

## 2026-05-04: Locale metadata continuity + district-request mobile clarity + school infrastructure research

- Fixed a focused batch of **9 concrete issues** across shared metadata and district routing:
  localized `/contribute` pages missing locale-aware canonical metadata,
  localized `/feedback` pages missing locale-aware canonical metadata,
  localized `/contributors` pages missing locale-aware canonical metadata,
  district dashboard canonicals hardcoding `/en/...`,
  district dashboard Open Graph URLs hardcoding `/en/...`,
  district dashboard JSON-LD organization URLs hardcoding `/en/...`,
  district dashboard breadcrumb JSON-LD home URLs dropping locale,
  district dashboard breadcrumb JSON-LD state URLs hardcoding `/en/...`,
  and district contributor pages missing locale-aware canonical/Open Graph URLs.
- Picked **3 actionable tracker items and completed them** in this pass:
  remaining localized contribute/feedback metadata continuity, district-level canonical cleanup, and district-request mobile scanning/empty-state clarity.
- Added **3 UI/UX improvements** that reduce cognitive load:
  the homepage district-request panel now explains the request flow before input,
  the same panel now has a clearer no-demand empty state instead of showing nothing,
  and the feedback contact fields now wrap responsively instead of forcing a cramped two-column mobile layout.
- Added nested locale-aware URL helpers and regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/site-metadata.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/site-metadata.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/site-metadata.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/site-metadata.test.ts).
- Research logged for a public-data **District School Infrastructure Monitor** candidate using UDISE+ and data.gov.in. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-school-infrastructure-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-school-infrastructure-monitor-research.md).

### Research backlog split

- Feature candidate: District School Infrastructure Monitor
- Value: district citizens can see whether schools have basic facilities such as toilets, drinking water, electricity, ramps, computers, and internet without digging through annual education reports.
- Task split:
  1. Data model: add annual district school-infrastructure snapshots keyed by district, academic year, and source metadata.
  2. Scraper/import/API: prototype data.gov.in UDISE+ ingestion, add district alias normalization, and extend the `schools` API fallback path.
  3. UI surface: add an annual “Infrastructure basics” card inside the `schools` module with source + academic-year labeling.
  4. Tests: cover parser aliasing, annual freshness copy, empty/fallback API states, and missing-field rendering.
  5. Rollout/backfill: pilot Karnataka first, then expand only after validating district coverage and legacy-name mapping.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `node --experimental-strip-types --test`,
  targeted `npx eslint`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Browser verification was **not** completed in this pass. No local dev-server browser run was performed after the metadata and mobile-layout changes, so the next frontend run should visually sanity-check the homepage district-request card plus `/[locale]/feedback` on a narrow viewport.
- Remaining risk: root non-localized `contribute` and `feedback` shells still use English copy by design. Route metadata and locale continuity are fixed here, but full dictionary-backed translation for those body surfaces remains separate work.

## 2026-04-27: Locale routing completion + support flow cleanup + groundwater research

- Fixed a focused batch of **14 concrete locale and navigation issues** across
  public/legal/support/admin surfaces:
  missing `locale` state on the admin security page back-link, not-found page
  exits dropping language context, about-page hero/CTA/data-source links
  dropping language context, privacy and disclaimer cross-links breaking locale
  continuity, feedback success returning users to hardcoded English home,
  support page contributor/back links hardcoded to English, contributor banner
  and wall leaderboard links hardcoded to English, support checkout success
  returning users to `/en` instead of the active locale, the features footer
  feedback CTA bypassing locale, the support admin preview link hardcoding
  `/en/support`, the root contribute page back-link ignoring locale, and the
  admin security page type-check failure caused by an undefined `locale`
  reference.
- Picked **3 sprint-tracker items and completed them**:
  remaining locale-aware marketing/legal/support links, support-flow locale
  continuity after payment/success states, and the Node ESM warning cleanup for
  the test runner.
- Added **5 visible UX improvements**:
  locale-sticky recovery paths on 404 pages, locale-sticky about/disclaimer/
  privacy CTAs, locale-sticky support + contributor discovery links, locale-
  sticky feedback/payment success exits, and locale-aware admin preview links
  for the support page editor.
- Added a reusable locale-aware internal link component plus regression tests:
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/components/common/LocaleLink.tsx`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/components/common/LocaleLink.tsx)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts).
- Promoted the repo to explicit ESM in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/package.json`](/Users/youthocrat/Desktop/HumanX/forthepeople/package.json),
  which removed the recurring `MODULE_TYPELESS_PACKAGE_JSON` test warning in
  this run's validation.
- Research logged for a public-data **District Groundwater Monitor** candidate
  using CGWB + OGD sources. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-27-groundwater-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-27-groundwater-monitor-research.md).

### Findings folded back into tracker

- Focused validation passed cleanly after the locale sweep:
  `npm test`, targeted `eslint`, and
  `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Browser verification was **not** completed in this run. No in-app browser
  pass was performed after the routing changes, so the next UI-focused run
  should sanity-check the support/about/legal flows visually.
- Remaining risk: these root marketing/legal pages now preserve locale in their
  internal navigation, but their body copy is still predominantly English-only.
  Routing is fixed; full translation coverage remains separate work.

## 2026-04-26: Locale-safe chrome pass + AQI feature research

- Fixed a concentrated batch of **20 navigation and shared-state issues** in
  the app chrome:
  footer/legal/support links dropping locale, feature-vote CTAs hardcoded to
  `/en/features`, support CTAs from tender/contributor/home surfaces breaking
  language continuity, and freshness banners rendering misleading text for
  missing/invalid/future timestamps.
- Picked **3 sprint-tracker items and solved them**:
  localized chrome routing, support/vote CTA consistency, and shared freshness
  hardening.
- Added **5 UI improvements** in the same pass:
  locale-sticky footer nav, locale-sticky sidebar/mobile nav CTAs, locale-safe
  home/tender/contributor support links, clearer feature-vote routing, and
  better freshness states (`Awaiting first sync`, `Freshness unavailable`,
  stable relative ages).
- Added reusable helpers plus regression tests for the new routing/freshness
  edge cases:
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/locale-routing.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/locale-routing.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/data-freshness.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/data-freshness.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-routing.test.ts).
- Test automation now covers **14 passing tests** with the new edge cases
  included.
- Research logged for a public-data **District Air Quality Monitor** candidate
  using CPCB + OGD sources. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-26-air-quality-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-26-air-quality-monitor-research.md)
  and tracker entry in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/SPRINT-TRACKER.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/SPRINT-TRACKER.md).

### Findings folded back into tracker

- Node's direct test runner exposed a path-alias portability issue in the new
  helper. Fixed by switching the helper import to a relative path.
- `npm run build` still blocks locally because Prisma needs a configured
  `datasource.url` for `prisma db push`. This is an environment issue, not a
  regression from the code changes in this pass.
- `MODULE_TYPELESS_PACKAGE_JSON` warnings still appear during `npm test`.
  Low-priority follow-up: decide whether the repo should opt into `"type":
  "module"`.

## 2026-04-25: Infra/contributors/admin stability pass + rainfall research

- Fixed a focused batch of **11 concrete issues** in the active UI/admin slice:
  infrastructure page render-purity errors, unstable contributor filter
  pagination, admin pages using raw `<a>` links for internal navigation, the
  global error-page apostrophe lint break, the manual supporter expiry
  autofill effect, and the missing repo-level `npm test` script.
- Picked **3 items from the current tracker/work surface and solved them**:
  infra tracker stability, contributor directory stability, and admin/supporter
  workflow cleanup.
- Added **5 UI improvements** in the same pass:
  contributor sponsorship coverage progress bar, contributor filter summary
  card, cleaner contributor pagination reset behavior, stable infrastructure
  freshness banner timing, and safer manual-supporter auto-expiry defaults.
- Added a reusable helper plus edge-case automation for supporter visibility
  expiry windows:
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/supporter-expiry.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/supporter-expiry.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/supporter-expiry.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/supporter-expiry.test.ts).
- Test automation now runs with `npm test` using Node's built-in TypeScript
  stripping. Current automated suite: **10 passing tests**.
- New feature research logged for a **District Rainfall Monitor** that can plug
  into the existing weather/water/farm modules using public IMD + OGD sources.
  See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-25-rainfall-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-25-rainfall-monitor-research.md).

### Findings folded back into tracker

- `npm test` was missing entirely despite existing `.test.ts` files. Fixed in
  `package.json`.
- Node emits `MODULE_TYPELESS_PACKAGE_JSON` warnings during tests. Not blocking,
  but worth a later decision: add `"type": "module"` or keep the warning.
- Full-repo lint still has unresolved errors in untouched admin pages such as
  `AnnouncementTab`, `recover/page.tsx`, and `AlertsAndLogs.tsx`. These were
  intentionally left out of this run to avoid mixing unrelated edits into the
  active district/i18n worktree.

## 2026-04-25: Tender UI maintenance + test pass

- Fixed a clustered batch of tender UI issues surfaced by lint/runtime checks:
  render-purity problems in tender cards/timeline, broken JSX entities on
  tender education pages, incorrect `corrigendum/corrigenda` copy, and one
  `prefer-const` seed bug.
- Added 5 UI refinements in the same area: urgency pills on tender cards,
  richer timeline summary pills, eligibility quick stats, apply-guide metrics,
  and transparency summary cards.
- Added regression tests for tender date/timeline edge cases in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/tenders-ui.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/tenders-ui.test.ts).
- Test findings folded back into code:
  empty/invalid timeline data now falls back safely, and same-day tender
  publish dates no longer render misleading negative/zero-ish age text.
- Research logged for the Population backlog: district-level NFHS-5 enrichment
  via Harvard Dataverse mirror. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-25-nfhs5-dataverse-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-04-25-nfhs5-dataverse-research.md).

## Tooling added 2026-04-20

- **CodeRabbit**: Installed on jayanthmb14/forthepeople repo only (not all repos). Pro tier auto-enabled (free for public repos regardless of license). Permissions: read + write on single repo for PR review comments. Action: next PR opened on main will trigger automated review comments within ~2 min of push.

---

## 2026-04-20: Database migration + Tenders module launch

### Database migration (completed)
- **NEW Neon**: ep-bitter-sea-a1n9ttad (PG 17, Launch $19/mo, AWS ap-southeast-1 Singapore, forthepeople1547@gmail.com)
- **Migrated from**: OLD Neon ep-broad-wildflower-a14s55kg on old Gmail
- **Method**: GitHub Codespace + pg_dump/pg_restore with PG 17 client tools
- **Row counts verified**: District=152, InfraProject=397, NewsItem=446, Supporter=61 (exact OLD↔NEW match)

### Upstash migration (completed)
- **NEW**: allowing-kid-70988.upstash.io (Mumbai, Pay-as-you-go, forthepeople1547@gmail.com)
- **OLD**: skilled-marten-75302.upstash.io — kept for 7-day rollback safety, decommission 2026-04-27

### Vercel
- Project still on zurvoapps-projects team (old Gmail) — migration deferred
- Env vars updated on all 3 environments — pointing to NEW Neon + NEW Upstash

### Sentry
- Fully configured: client/server/edge configs + DSN + AUTH_TOKEN on .env + Vercel
- Organization: forthepeople.in, single project: javascript-nextjs

### Tenders module (Module 30 — launched 2026-04-20)
- **Scope**: Karnataka pilot — Bengaluru, Mandya, Mysuru
- **14 Prisma models**: Tender, TenderAuthority, TenderCorrigendum, TenderAward, TenderBidder, TenderContract, TenderDocument, TenderCategory, TenderRedFlag, TenderAISummary, TenderSavedByUser, TenderScraperConfig, TenderScraperRun, TenderEducationContent
- **Data sources**: KPPP, CPPP, defproc, eprocurebel, IREPS, HAL eProc (GeM deferred due to Cloudflare Turnstile + IT Act §43 risk)
- **Red flag detection**: SQL-deterministic (never LLM) — single bidder, <21-day window, price hit rate >98%, repeat winner, re-tendered, restrictive turnover, direct nomination
- **Lint**: scripts/lint-tender-copy.sh blocks inflammatory language
- **Disclaimers**: TenderDisclaimer component on every page

### Banner
- Built but DISABLED via static fallback (enabled: false) — migration complete, no user-facing announcement needed
- Admin-controlled banner module TO BUILD — planned as new admin tab, modal-first-visit pattern, user clicks OK → site opens
- Current code can be re-used when admin module is built

### Deferred to future work
- **Neon password rotation**: Low risk (only in private chat logs), do on weekend
- **Vercel ownership migration**: ~2026-04-27, 20-min task
- **OLD Neon + OLD Upstash decommission**: 2026-04-27 (7-day rollback safety net)
- **SiteAnnouncement + missing Tender tables on NEW Neon**: Need `prisma db push` from Codespace
- **Admin banner module build**: New module under admin panel, replaces the disabled static banner

---

## 2026-04-20: Tenders module fixes (post-audit)

Phase 1 audit identified 12 issues. Fixed 10 in this session, deferred 2.

### Fixed

1. **All invented email addresses replaced** with contextual `mailto:support@forthepeople.in?subject=...` links. 6 `takedown@` references removed (1 scraper UA string, 1 component, 4 doc-file mentions). Scraper User-Agent now uses `https://forthepeople.in/contact` instead (bots can't click mailto).
2. **Sidebar reorganised by civic priority**: 7 tiers (Civic Duty → Maps & Data), numeric `priority` field replaces dead `group` enum. All 3 nav components (Sidebar, MobileSidebar, MobileTabNav) now derive categories from a single `getTieredModules()` helper — no more hardcoded slug arrays.
3. **Tenders visible on all districts with DB-driven lock state**: `District.tendersActive Boolean @default(false)`. Non-activated districts see a lock + sponsor-CTA card instead of the misleading empty-dashboard. Sidebar entry stays universal for discoverability.
4. **Per-state disclaimer route** at `/tenders/disclaimer`: reuses `TenderEducationContent` with new `docType` + `stateSlug` columns. 7 universal clauses (GFR 2017, GODL-India, RTI §4, DPDP 2023, Advocates Act §33, takedown, licence) + 2 Karnataka-specific (KTPPA 1999, portal list). Fixes the previously-broken `<Link href="/tenders/disclaimer">`.
5. **Tenders overview snippet** on every district home: matches LeadersSnippet/InfraSnippet pattern, status badge cycles LIVE/STALE/LOCKED/NO_DATA, shows live count, closing-48h callout, next-deadline strip, and time-ago.
6. **Deadline urgency indicator** on tender cards + detail hero: green border >7d, yellow 2–7d, red pulsing <48h, grey/dimmed past. Client-side from `bidSubmissionEnd`.
7. **Structured plain-English bullets** on detail page: `TenderAISummary.plainBullets Json?` with `{ what, whoCanApply, deadline }`. New 4th prompt in enrichment cron at grade-6 reading level, max 25 words/bullet. "Summary being prepared" fallback when absent.
8. **Save & Alert** on detail page now opens a mailto pre-filled with tender context (title, source URL, ID). Replaces the fake `alert()`. TODO flagged for real DPDP-compliant email collection in v2.
9. **Apply Guide / Transparency / How It Works** buttons verified live on prod — no dead buttons. Also fixed `/api/tenders/how-it-works` to filter by `docType='explainer'` so disclaimer rows don't leak into the explainer page.
10. **Activation runbook** at `docs/TENDERS-ACTIVATION.md` — SQL flip + seed pattern + state-specific gotchas.

### Deferred (not blocking Phase 2 push)

- **Scraper cron registration** (Issue #11): KPPP portal CAPTCHA / rate-limit blocker remains. Not wiring to `vercel.json` crons until the engine is proven stable from a Railway / domestic-IP environment.
- **"Crime Statistics" module** from Phase 1 Tier 4 list: module doesn't exist in codebase, silently dropped. Split `police` module remains single.

### Schema changes (additive, no data loss)

Land on Vercel's next deploy via `vercel.json` build command (`npx prisma db push`):

- `District.tendersActive Boolean @default(false)` — issue #3
- `TenderEducationContent.docType String @default("explainer")` — issue #4
- `TenderEducationContent.stateSlug String?` — issue #4
- `TenderAISummary.plainBullets Json?` — issue #7

### New files

- `src/components/district/TenderSnippet.tsx`
- `src/components/tenders/TenderLockedState.tsx`
- `src/app/api/tenders/[district]/access/route.ts`
- `src/app/api/tenders/[state]/disclaimer/route.ts`
- `src/app/api/tenders/live-districts/route.ts`
- `src/app/[locale]/[state]/[district]/tenders/disclaimer/page.tsx`
- `prisma/seed-tender-legal.ts`
- `scripts/activate-tenders-districts.ts`
- `docs/TENDERS-ACTIVATION.md`

### Enabled districts for tenders (after activation script runs)

`bengaluru-urban`, `mandya`, `mysuru` (all other districts render lock state).

### Post-push manual actions required

1. Wait for Vercel build to complete (adds the 4 schema columns via `prisma db push`).
2. Run `npx tsx scripts/activate-tenders-districts.ts` against production DB → flips `tendersActive=true` for the 3 KA pilot districts.
3. Run `npx tsx prisma/seed-tender-legal.ts` against production DB → seeds 9 disclaimer clauses.
4. (Optional) Run enrichment cron to populate `plainBullets` on the 12 stub tenders.

---

## 2026-04-25: District boundary map request flow

- Added inactive district polygon requests on Karnataka and generic state maps. Active districts still navigate to dashboards; inactive districts now POST to `/api/district-request` and show a map toast.
- Added local in-memory district-request fallback when Prisma/Postgres is unavailable, so local dev map requests do not hard-fail.
- Added `src/lib/map/district-map.ts` plus `tests/district-map.test.ts` for map action, GeoJSON path, and request payload helpers.
- Researched public/open boundary sources and documented Data{Meet}, Survey of India, MIT-derived district boundaries, and coverage gaps in `docs/2026-04-25-district-boundary-map-research.md`.

## 2026-05-03: Locale metadata cleanup + district-request UX hardening + rural roads research

- Fixed a focused batch of **8 concrete issues** on the shared legal/support and
  homepage request surfaces:
  localized about/support/privacy/disclaimer routes re-exporting English-only
  metadata, localized state pages hardcoding English canonical/Open Graph URLs,
  legal-page back navigation dropping locale context, district-request success
  state treating failed API responses as successful submissions, district
  request district-select remaining enabled with no valid choices in fully
  covered states, district request UI giving no explanation when a state had no
  requestable districts left, and district request failures having no visible
  inline recovery message.
- Picked **3 tracker items and completed them** in this pass:
  locale-aware metadata continuity for shared pages, locale-safe legal exit
  paths, and homepage district-request empty/error-state clarity.
- Added **3 UI/UX improvements** that reduce cognitive load:
  locale-sticky legal back links, a clearer “No pending districts” request-form
  state with explanatory helper copy, and an inline retry-oriented error banner
  when district-request submission fails.
- Added focused helpers and regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/site-metadata.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/site-metadata.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-request.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/site-metadata.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/site-metadata.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts).
- Research logged for a public-data **District Rural Roads Monitor** candidate
  using PMGSY / OMMAS / GRRIS sources. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-03-rural-roads-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-03-rural-roads-monitor-research.md).

### Research backlog split

- Feature candidate: District Rural Roads Monitor
- Value: district citizens can see sanctioned vs completed PMGSY road length,
  balance works, and public expenditure without relying on political claims.
- Task split:
  1. Data model: add district+scheme snapshot storage for sanctioned/completed/
     balance/unawarded road metrics, LSB counts, and spend.
  2. Scraper/import/API: prototype OMMAS table extraction, district-name alias
     mapping, and `/api/data/roads` fallbacks.
  3. UI surface: add a roads / rural-connectivity module or infrastructure
     sub-panel with scheme tabs, freshness, and source notes.
  4. Tests: parser coverage, API fallback coverage, stale/missing timestamp
     states, and district alias normalization.
  5. Rollout/backfill: pilot in Karnataka, then expand state-by-state once the
     scraper and naming map prove stable.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`, focused `node --experimental-strip-types --test`
  suites, and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Browser verification was **not** completed in this pass. No in-app browser
  run was performed after the homepage request-state changes, so the next
  frontend run should visually sanity-check the district-request card and
  localized legal/support routes.
- Remaining risk: localized `/contribute` and `/feedback` metadata are still
  uneven because their localized routes do not yet define the same locale-aware
  canonical handling as the legal/support pages fixed here.

## 2026-05-03: Chrome reliability pass + support locale fixes + road-safety research

- Fixed a focused batch of **10 concrete issues** in shared shell/support
  surfaces:
  the contributors API route exporting a non-route constant and failing `tsc`,
  support defaults hardcoding `/en/feedback`, support help-item internal links
  bypassing locale-aware routing, support-page contributor leaderboard links
  bypassing locale-aware routing, the support-page back-link hardcoding English,
  contributor count failures being misreported as “0 supporters”, the header
  search hotkey firing while typing in editable fields, district search matching
  failing on trimmed/local-script queries in the header, district search
  matching failing on trimmed/local-script queries on the homepage, and home
  disclaimer/support CTAs dropping locale context.
- Picked **3 sprint-tracker items and completed them** in this maintenance
  slice:
  contributor API typecheck stability, support/help locale continuity, and
  district-search reliability in shared chrome.
- Added **6 visible UX improvements**:
  lucide-based support/disclaimer/footer actions in the shared shell, a more
  legible mobile drawer/header brand treatment, a proper mobile “More” tab
  icon, a less misleading contributor banner state when counts are unavailable,
  lucide icons inside header search results and quick links, and a cleaner map
  fallback/support CTA on the homepage.
- Added shared helper coverage for chrome behavior in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/chrome.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/chrome.ts)
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts).
- Research logged for a public-data **District Road Safety Monitor** candidate
  using MoRTH + OGD transport datasets. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-03-road-safety-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-03-road-safety-monitor-research.md).

### Findings folded back into tracker

- Focused validation passed:
  `npm test`, targeted `npx eslint`, and
  `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- The new helper test initially exposed a Node test-runner path-alias issue in
  `src/lib/chrome.ts`. Fixed in the same run by switching that helper import to
  a relative path.
- Browser verification was **not** completed in this run. No in-app browser
  pass was performed after the shell/support changes, so the next UI-focused
  run should visually sanity-check the support page, header search overlay, and
  mobile navigation surfaces.
- Remaining risk: support-page “other ways to help” cards still use content
  emojis because that area is content-managed; the shared shell is now icon
  consistent, but the content block remains stylistically mixed by design.
- Current GeoJSON coverage: 34 local per-state district files. Remaining cleanup: Telangana, Ladakh, and Dadra & Nagar Haveli/Daman & Diu slug aliasing.

## 2026-05-04: State-aware tender routing/cache repair + homepage search clarity + NCS jobs research

- Fixed a focused batch of **10 concrete issues** in the active homepage and district tender surfaces:
  tender access route resolving active districts by slug alone across states,
  tender stats route resolving districts by slug alone,
  tender stats route checking `tendersActive` by district name alone,
  tender list route resolving/filtering tenders without state scoping,
  tender detail route resolving/filtering tenders without state scoping,
  tender transparency route resolving/filtering tenders without state scoping,
  tender overview/apply-guide/transparency/detail React Query keys colliding across duplicate district slugs,
  overview snippet query keys for leaders/population/infrastructure still colliding across states,
  homepage active-district preview cards matching preview payloads by district slug alone,
  and homepage drilldown search treating whitespace-only input as a real search state.
- Picked **3 actionable tracker items and completed them** in this pass:
  state-aware tender API lookup/filtering,
  state-aware tender client cache scoping on active district pages,
  and homepage district-search/preview correctness for duplicate slugs and empty queries.
- Added **3 UI/UX improvements** that reduce cognitive load:
  homepage drilldown search now shows a clear no-match state instead of silently dropping results,
  live weather preview rows now show district names instead of raw slugs,
  and the tenders module now offers a one-click `Clear filters` recovery path when users filter into an empty result set.
- Added focused helper coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/tenders/ui.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/tenders/ui.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/tenders-ui.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/tenders-ui.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts).
- Research logged for a public-data-adjacent **District Jobs & Career Center Monitor** candidate using National Career Service public surfaces. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-national-career-service-jobs-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-04-national-career-service-jobs-research.md).

### Research backlog split

- Feature candidate: District Jobs & Career Center Monitor
- Value: citizens can inspect district job openings and nearby public career centers without hunting across multiple government pages.
- Task split:
  1. Data model: add district job snapshots plus career-center directory rows with freshness/source metadata.
  2. Scraper/import/API: start with career centers, verify whether NCS exposes stable network endpoints, then expose `/api/data/jobs` and `/api/data/career-centers`.
  3. UI surface: add an `Opportunities` card with live roles, freshness, and career-center contacts.
  4. Tests: cover district alias joins, stale directory copy, empty local fallbacks, and duplicate posting dedupe.
  5. Rollout/backfill: pilot directory data first, then decide whether live job ingestion is legally/technically safe enough.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  `node --experimental-strip-types --test tests/*.test.ts`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `Could not resolve host: github.com`.
- Browser verification was **not** completed in this pass. No local Next dev server was started after the tender/homepage changes, so the next UI-focused run should verify the homepage drilldown overlay plus a duplicated-slug district tender route in the in-app browser.
- Remaining risk: tender APIs are now state-aware when the caller provides `state`, but any older callers outside the touched district tender surfaces that still omit the query param can continue to hit the district-slug fallback path until the remaining tender entry points are migrated.

## 2026-05-13: Local-empty API honesty + route normalization + court backlog research

- Fixed a focused batch of **8 concrete issues** in the shared unified-data and homepage preview surface:
  homepage stats could return and cache a misleading `0 activeDistricts / 0 data points` shell on a local-empty database instead of falling back to static district config,
  homepage stats fallback decisions were duplicated in the route instead of using one shared guard for the local-empty case,
  the unified `/api/data/[module]` route treated whitespace-padded `district`, `state`, `module`, and `taluk` params as distinct values and could miss valid districts,
  unified-data cache keys fragmented across mixed-case or whitespace-padded route params,
  unified-data React Query keys fragmented across mixed-case or whitespace-padded route params,
  the unified water route returned a hard `District not found` result for known statically configured districts when the local DB was empty,
  homepage preview labels preserved doubled internal whitespace and could render noisier card text than the source warranted,
  and compare selection parsing accepted malformed `state::district::extra` values instead of rejecting them cleanly.
- Picked **3 actionable tracker items and completed them** in this pass:
  homepage local-empty stats honesty,
  water-module graceful fallback for known districts,
  and shared route/query normalization for preview and compare helpers.
- Added **3 UI/UX improvements** that reduce cognitive load:
  the homepage stats shell now stays honest in empty-local environments instead of implying the platform has zero active districts,
  known district water pages can render the existing empty-state card path instead of surfacing a red 404-style dead end when local data is missing,
  and homepage preview item labels now collapse accidental doubled spacing so repeated names dedupe and scan more cleanly.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/data-fallbacks.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/data-fallbacks.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-data.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-data.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/homepage-preview.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-selection.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/src/lib/district-selection.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-fallbacks.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-fallbacks.test.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-data.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-data.test.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/homepage-preview.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-selection.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-selection.test.ts).
- Research logged for a public-data **District Court Case Backlog Monitor** candidate using NJDG official judiciary sources. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-13-district-court-case-backlog-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-13-district-court-case-backlog-monitor-research.md).

### Research backlog split

- Feature candidate: District Court Case Backlog Monitor
- Value: citizens can inspect district-level pending, instituted, and disposed case pressure with explicit freshness instead of navigating the judiciary dashboard manually.
- Task split:
  1. Data model: add district court backlog snapshots keyed by state, district, snapshot date, jurisdiction split, and source metadata.
  2. Scraper/import/API: verify whether NJDG exposes stable district-level JSON or tables, then expose `/api/data/courts-backlog` with freshness and source notes.
  3. UI surface: add a justice/courts backlog card with pending totals, civil/criminal split, filing-vs-disposal movement, and age buckets.
  4. Tests: cover district alias joins, stale snapshots, empty-local fallbacks, missing split buckets, and source-shape regressions.
  5. Rollout/backfill: pilot one state first, then expand only after alias quality and fetch stability are proven.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test tests/district-data.test.ts tests/data-fallbacks.test.ts tests/homepage-preview.test.ts tests/district-selection.test.ts`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `error: cannot open '.git/FETCH_HEAD': Operation not permitted`,
  and the configured `origin` is still `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because local Next dev still cannot bind a port in this sandbox:
  `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:3000`.
- Remaining risk: route normalization now protects slug-shaped params, but any legacy callers still sending human-readable district names instead of canonical slugs will continue to miss these shared helpers until those entry points are normalized explicitly.

## 2026-05-13: Localized shell copy pass + empty-state translation + Aadhaar enrolment research

- Fixed a focused batch of **8 concrete issues** in the shared locale-shell and district empty-state surface:
  localized 404 pages still hardcoded an English title,
  localized 404 pages still hardcoded an English body message,
  localized 404 pages still hardcoded English CTA labels,
  footer disclaimer links still hardcoded English labels even on localized routes,
  footer feedback trigger text still hardcoded English,
  homepage drilldown disclaimer strip still hardcoded English disclaimer and author-prefix copy,
  contributor banner CTA and status copy could stay English-only on localized support routes,
  and district empty-state cards still rendered English-only body copy and footnote text on localized routes.
- Picked **3 actionable tracker items and completed them** in this pass:
  localized shared shell copy continuity for 404/footer/disclaimer surfaces,
  district empty-state copy localization away from English-only helper text,
  and district-request lookup hardening so local-script state and district names resolve against the same helper path as canonical English names.
- Added **4 UI/UX improvements** that reduce cognitive load:
  localized 404 screens now keep recovery actions in the same language as the rest of the route,
  footer and homepage disclaimer affordances now read consistently on Hindi/Kannada surfaces instead of mixing English legal/navigation labels into the shell,
  contributor banners on localized support routes now keep the leaderboard CTA and unavailable/loading states readable without language switching,
  and empty district module cards now show localized explainer copy rather than abrupt English fallback text.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/district-request.test.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/chrome-utils.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/i18n-copy.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/i18n-copy.test.ts).
- Research logged for a public-data **District Aadhaar Monthly Enrolment Monitor** candidate using UIDAI's OGD monthly resource plus the public Aadhaar dashboard. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-13-aadhaar-monthly-enrolment-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-13-aadhaar-monthly-enrolment-monitor-research.md).

### Research backlog split

- Feature candidate: District Aadhaar Monthly Enrolment Monitor
- Value: citizens can inspect district-level Aadhaar enrolment/update activity as a digital-access signal without pretending the source is a live identity-coverage denominator.
- Task split:
  1. Data model: add monthly Aadhaar activity snapshots keyed by state, district, month, metric type, and source metadata.
  2. Scraper/import/API: download the OGD file, aggregate pincode rows to district totals, and expose `/api/data/aadhaar-activity` with freshness metadata.
  3. UI surface: add a citizen-services / digital-access card with monthly enrolment-update totals, movement, and explicit "activity, not coverage" copy.
  4. Tests: cover alias joins, repeated pincode aggregation, malformed numeric columns, stale months, and empty-local fallbacks.
  5. Rollout/backfill: pilot one monthly file first, then backfill additional months only after schema stability and interpretation are confirmed.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test tests/district-request.test.ts tests/chrome-utils.test.ts tests/i18n-copy.test.ts`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `error: cannot open '.git/FETCH_HEAD': Operation not permitted`,
  and the configured `origin` is still `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because local Next dev still cannot bind a port in this sandbox:
  `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:3000`.
- Remaining risk: empty-state shell copy is now localized for the active dictionaries, but larger support-page content blocks and feedback modal internals still include substantial English-only body copy outside this maintenance slice.

## 2026-05-14: Localized no-data cards + fallback normalization + eShram worker research

- Fixed a focused batch of **6 concrete issues** in the district no-data and fallback surface:
  localized routes still rendered English-only `NoDataCard` titles,
  localized routes still rendered English-only `NoDataCard` body copy,
  localized routes still rendered English-only no-data footnote text,
  alert no-data states could misleadingly claim there were no active alerts when the feed was simply not connected,
  power no-data cards exposed a raw outage URL as inert text instead of a clear official-portal action,
  and `getWaterModuleFallback` failed to normalize state/district slug casing and whitespace before static-config lookup, which could misclassify known districts as missing.
- Picked **3 actionable tracker items and completed them** in this pass:
  localized district no-data copy continuity,
  honest alert-empty-state wording for feed-not-connected scenarios,
  and static water fallback normalization for local slug variants.
- Added **3 UI/UX improvements** that reduce cognitive load:
  district no-data cards now use shorter localized copy instead of long English paragraphs on Hindi/Kannada routes,
  the power empty state now gives a clear official outage-portal link instead of forcing manual URL copying,
  and the no-data card visual hierarchy now matches the rounded bordered card style more closely instead of reading like a warning banner.
- Added focused regression coverage in
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-fallbacks.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/data-fallbacks.test.ts),
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/i18n-copy.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/i18n-copy.test.ts),
  and
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/tests/no-data-card.test.ts`](/Users/youthocrat/Desktop/HumanX/forthepeople/tests/no-data-card.test.ts).
- Research logged for a public-data **District eShram Unorganised Worker Monitor** candidate using the OGD eShram district dataset plus official portal context. See
  [`/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-14-eshram-unorganised-worker-monitor-research.md`](/Users/youthocrat/Desktop/HumanX/forthepeople/docs/2026-05-14-eshram-unorganised-worker-monitor-research.md).

### Research backlog split

- Feature candidate: District eShram Unorganised Worker Monitor
- Value: citizens can inspect district-level eShram registrations and demographic mix while keeping clear that the metric reflects portal registration, not the full informal workforce.
- Task split:
  1. Data model: add district eShram snapshot rows keyed by state, district, snapshot date, demographic dimension, bucket, and source metadata.
  2. Scraper/import/API: ingest the OGD resource, normalize district aliases, and expose `/api/data/eshram-workers` with freshness and methodology notes.
  3. UI surface: add a livelihoods / labour card with total registrations, demographic splits, and explicit "registrations, not workforce total" copy.
  4. Tests: cover alias joins, malformed bucket labels, duplicate imports, stale snapshots, and empty-local fallback behavior.
  5. Rollout/backfill: pilot one current snapshot first, then backfill only after schema and interpretation are stable.

### Findings folded back into tracker

- Focused validation passed cleanly:
  targeted `npx eslint`,
  focused `node --experimental-strip-types --test tests/data-fallbacks.test.ts tests/i18n-copy.test.ts tests/no-data-card.test.ts`,
  and `npx tsc --noEmit --pretty false --allowImportingTsExtensions`.
- Upstream sync remains blocked by environment:
  `git fetch https://github.com/jayanthmb14/forthepeople.git main` failed with `error: cannot open '.git/FETCH_HEAD': Operation not permitted`,
  and the configured `origin` is still `https://github.com/sush0408/forthepeople`.
- Browser verification was **not** completed in this pass because local Next dev still cannot bind a port in this sandbox:
  `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:3000`.
- Remaining risk: localized no-data cards now cover the active district module pages, but other large localized body-copy surfaces in support/admin flows are still partly English and should be handled in later passes rather than mixed into this slice.

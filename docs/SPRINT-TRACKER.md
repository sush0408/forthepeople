# ForThePeople.in Sprint Tracker

_Last updated: 2026-04-27_

## Selected this run

| Item | Type | Status | Notes |
|---|---|---|---|
| Remaining localized marketing/legal/support links | Bugfix + UI | Done | Root about/privacy/disclaimer/not-found/support/contribute/feedback surfaces now keep the active locale instead of bouncing users into English-only paths. |
| Support flow locale continuity | Bugfix + UI | Done | Contributor discovery, payment success, and admin support preview flows now stay inside the active locale. |
| Node test-runner ESM warning cleanup | Tooling + Test | Done | Explicit package ESM mode removed the recurring `MODULE_TYPELESS_PACKAGE_JSON` warning during `npm test`. |

## Fixed this run

### Bugs resolved

1. Admin security page referenced an undefined `locale` value and failed type-checking.
2. Not-found page "Go Home" action dropped the active locale.
3. Not-found page "About" action dropped the active locale.
4. About page back-link dropped the active locale.
5. About page district data-sources CTA hardcoded English routing.
6. About page contribute/report-error links dropped the active locale.
7. Privacy page cross-links to disclaimer/about dropped the active locale.
8. Disclaimer page cross-links to contribute/privacy/about dropped the active locale.
9. Feedback success screen hardcoded `/en` instead of preserving locale.
10. Support page contributor leaderboard CTA hardcoded `/en/contributors`.
11. Support page back-link hardcoded `/en`.
12. Contributor banner and contributor wall leaderboard links hardcoded English routes.
13. Support checkout success flow redirected to `/en` or `/en/.../contributors` instead of the active locale.
14. Support page admin preview link hardcoded `/en/support`.

### UI improvements shipped

1. 404 recovery actions now keep users inside their chosen locale.
2. About, privacy, and disclaimer pages now preserve locale across key next-step CTAs.
3. Support and contributor discovery flows no longer context-switch users back to English.
4. Payment and feedback success screens now return users to the matching localized home/district path.
5. Support-page admin preview now opens the correct localized public page for review.

## Feature research backlog

| Feature | Status | Source | Notes |
|---|---|---|---|
| District Groundwater Monitor | Researched | CGWB + data.gov.in | Best next fit for water/farm surfaces; likely starts as a groundwater status card rather than a fully live all-India module. See `docs/2026-04-27-groundwater-monitor-research.md`. |

## Findings from validation

- `npm test` passes with 14 tests and no longer emits `MODULE_TYPELESS_PACKAGE_JSON` warnings.
- Focused ESLint passed on the touched locale/support/admin files.
- `npx tsc --noEmit --pretty false --allowImportingTsExtensions` passed after fixing the admin security locale reference.
- No browser verification was performed in this run; locale-preserving support/about/legal flows still need a visual sanity pass.

## Next candidates

- Visually verify support/about/privacy/disclaimer/not-found flows in the in-app browser.
- Expand English-only body copy into dictionary-backed translation coverage on root marketing/legal pages.
- Prototype the groundwater card inside `water` before committing to a full module page.

import assert from "node:assert/strict";
import test from "node:test";

import {
  getHomepagePreviewFallback,
  getHomepageStatsFallback,
  getWaterModuleFallback,
  hasStaticWaterFallbackDistrict,
  shouldUseHomepageStatsFallback,
} from "../src/lib/data-fallbacks.ts";
import { getTotalActiveDistrictCount } from "../src/lib/constants/districts.ts";

test("homepage fallback uses static active district count instead of zero", () => {
  const fallback = getHomepageStatsFallback();

  assert.equal(fallback.activeDistricts, getTotalActiveDistrictCount());
  assert.ok(fallback.activeDistricts > 0);
  assert.equal(fallback.fallback, "static-district-config");
});

test("water fallback preserves response shape when local database is unavailable", () => {
  const now = new Date("2026-04-25T12:30:00.000Z");
  const fallback = getWaterModuleFallback(" Karnataka ", " Mandya ", now);

  assert.deepEqual(fallback.data, { dams: [], canals: [] });
  assert.equal(fallback.meta.module, "water");
  assert.equal(fallback.meta.district, "mandya");
  assert.equal(fallback.meta.lastUpdated, null);
  assert.equal(fallback.meta.reason, "database-unavailable");
  assert.equal(fallback.meta.districtName, "Mandya");
});

test("homepage preview fallback keeps active district navigation available without live feeds", () => {
  const fallback = getHomepagePreviewFallback("no-active-districts-in-db");

  assert.equal(fallback.fallback, "static-district-config");
  assert.equal(fallback.reason, "no-active-districts-in-db");
  assert.equal(fallback.topCrops.length, 0);
  assert.equal(fallback.latestNews.length, 0);
  assert.equal(fallback.latestDams.length, 0);
  assert.equal(fallback.districtPreviews.length, getTotalActiveDistrictCount());
  assert.equal(fallback.districtPreviews[0]?.weather, null);
});

test("shouldUseHomepageStatsFallback only trips for empty local-db style stats", () => {
  assert.equal(shouldUseHomepageStatsFallback(0, 0), true);
  assert.equal(shouldUseHomepageStatsFallback(0, 8), false);
  assert.equal(shouldUseHomepageStatsFallback(4, 0), false);
});

test("hasStaticWaterFallbackDistrict only allows known state-scoped districts", () => {
  assert.equal(hasStaticWaterFallbackDistrict("karnataka", "mandya"), true);
  assert.equal(hasStaticWaterFallbackDistrict("karnataka", "not-a-real-district"), false);
  assert.equal(hasStaticWaterFallbackDistrict("", "mandya"), false);
});

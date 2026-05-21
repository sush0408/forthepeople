import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDistrictDataCacheKey,
  buildDistrictDataQueryKey,
  getDistrictDataErrorStatus,
  normalizeDistrictDataRouteParam,
} from "../src/lib/district-data.ts";

test("buildDistrictDataCacheKey scopes unified module cache entries by state and taluk", () => {
  assert.equal(
    buildDistrictDataCacheKey("karnataka", "mandya", "overview"),
    "ftp:karnataka:mandya:overview",
  );
  assert.equal(
    buildDistrictDataCacheKey("maharashtra", "mandya", "overview"),
    "ftp:maharashtra:mandya:overview",
  );
  assert.equal(
    buildDistrictDataCacheKey(" Karnataka ", " Mandya ", " Taluks ", " Mandya "),
    "ftp:karnataka:mandya:taluks:mandya",
  );
});

test("buildDistrictDataQueryKey keeps react-query entries distinct across states", () => {
  assert.deepEqual(
    buildDistrictDataQueryKey("karnataka", "mandya", "water"),
    ["district", "karnataka", "mandya", "water", ""],
  );
  assert.deepEqual(
    buildDistrictDataQueryKey(" Karnataka ", " Mandya ", " Water ", " Pandavapura "),
    ["district", "karnataka", "mandya", "water", "pandavapura"],
  );
  assert.notDeepEqual(
    buildDistrictDataQueryKey("karnataka", "mandya", "water"),
    buildDistrictDataQueryKey("maharashtra", "mandya", "water"),
  );
});

test("getDistrictDataErrorStatus maps known API meta errors to honest HTTP statuses", () => {
  assert.equal(getDistrictDataErrorStatus(undefined), 200);
  assert.equal(getDistrictDataErrorStatus("District not found"), 404);
  assert.equal(getDistrictDataErrorStatus("Unknown module: budget-v2"), 400);
});

test("normalizeDistrictDataRouteParam trims and lowercases incoming route params", () => {
  assert.equal(normalizeDistrictDataRouteParam(" Karnataka "), "karnataka");
  assert.equal(normalizeDistrictDataRouteParam(" Water "), "water");
  assert.equal(normalizeDistrictDataRouteParam(null), "");
});

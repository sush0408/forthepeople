import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStateDistrictKey,
  parseStateDistrictKey,
} from "../src/lib/district-selection.ts";

test("buildStateDistrictKey scopes duplicate district slugs by state", () => {
  assert.equal(buildStateDistrictKey("Karnataka", "Mandya"), "karnataka::mandya");
  assert.notEqual(
    buildStateDistrictKey("karnataka", "mandya"),
    buildStateDistrictKey("odisha", "mandya"),
  );
});

test("parseStateDistrictKey reads valid compare-selection params and rejects partial values", () => {
  assert.deepEqual(parseStateDistrictKey("karnataka::mandya"), {
    stateSlug: "karnataka",
    districtSlug: "mandya",
  });
  assert.equal(parseStateDistrictKey("mandya"), null);
  assert.equal(parseStateDistrictKey("karnataka::"), null);
  assert.equal(parseStateDistrictKey("karnataka::mandya::extra"), null);
});

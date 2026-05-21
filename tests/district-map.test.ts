import test from "node:test";
import assert from "node:assert/strict";
import { districtGeoJsonPath, districtMapAction, districtRequestPayload } from "../src/lib/map/district-map.ts";

test("districtMapAction keeps active districts navigable and inactive districts requestable", () => {
  assert.equal(districtMapAction(true), "explore");
  assert.equal(districtMapAction(false), "request");
});

test("districtGeoJsonPath builds the state district boundary path", () => {
  assert.equal(districtGeoJsonPath("karnataka"), "/geo/karnataka-districts.json");
  assert.equal(districtGeoJsonPath("west-bengal"), "/geo/west-bengal-districts.json");
});

test("districtRequestPayload trims state and district names for API submission", () => {
  assert.deepEqual(districtRequestPayload(" Karnataka ", " Hassan "), {
    stateName: "Karnataka",
    districtName: "Hassan",
  });

  assert.deepEqual(districtRequestPayload(" Uttar   Pradesh ", " Gautam   Buddha  Nagar "), {
    stateName: "Uttar Pradesh",
    districtName: "Gautam Buddha Nagar",
  });
});

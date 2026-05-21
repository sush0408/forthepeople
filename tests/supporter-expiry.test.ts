import assert from "node:assert/strict";
import test from "node:test";

import { suggestedExpiryDate, suggestedExpiryDays } from "../src/lib/supporter-expiry.ts";

test("suggestedExpiryDays uses the intended tier thresholds", () => {
  assert.equal(suggestedExpiryDays(0), null);
  assert.equal(suggestedExpiryDays(99), 90);
  assert.equal(suggestedExpiryDays(999), 90);
  assert.equal(suggestedExpiryDays(1000), 180);
  assert.equal(suggestedExpiryDays(9999), 180);
  assert.equal(suggestedExpiryDays(10000), 365);
});

test("suggestedExpiryDate returns deterministic ISO dates for edge thresholds", () => {
  const now = new Date("2026-04-25T00:00:00.000Z");

  assert.equal(suggestedExpiryDate(99, now), "2026-07-24");
  assert.equal(suggestedExpiryDate(1000, now), "2026-10-22");
  assert.equal(suggestedExpiryDate(10000, now), "2027-04-25");
});

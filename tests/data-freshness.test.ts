import assert from "node:assert/strict";
import test from "node:test";

import { formatRelativeFreshness, latestFreshnessIso } from "../src/lib/data-freshness.ts";

test("formatRelativeFreshness handles missing, invalid, and future timestamps", () => {
  assert.equal(formatRelativeFreshness(null), "Awaiting first sync");
  assert.equal(formatRelativeFreshness("not-a-date"), "Freshness unavailable");
  assert.equal(
    formatRelativeFreshness("2026-05-08T12:01:00.000Z", Date.parse("2026-05-08T12:00:00.000Z")),
    "just now",
  );
});

test("latestFreshnessIso returns the newest valid timestamp across feeds", () => {
  assert.equal(
    latestFreshnessIso([
      "2026-05-08T09:00:00.000Z",
      new Date("2026-05-08T10:30:00.000Z"),
      "not-a-date",
      null,
      "2026-05-08T10:00:00.000Z",
    ]),
    "2026-05-08T10:30:00.000Z",
  );
  assert.equal(latestFreshnessIso([undefined, "bad"]), null);
});

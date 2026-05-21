import test from "node:test";
import assert from "node:assert/strict";

import {
  buildHomepagePreviewDistrictKey,
  buildHomepagePreviewItemKey,
  clampPercentage,
  dedupeLatestPreviewItems,
  formatHomepagePreviewDistrictName,
  findHomepageDistrictPreview,
  formatHomepagePreviewAge,
  getHomepagePreviewRouteTarget,
  normalizePreviewLabel,
  normalizePreviewTimestamp,
  roundPreviewMetric,
} from "../src/lib/homepage-preview.ts";

test("homepage preview keys distinguish duplicate district slugs across states", () => {
  assert.notEqual(
    buildHomepagePreviewDistrictKey("karnataka", "mandya"),
    buildHomepagePreviewDistrictKey("odisha", "mandya"),
  );
});

test("findHomepageDistrictPreview matches preview rows by state and district", () => {
  const previews = [
    { slug: "mandya", stateSlug: "odisha", name: "Mandya (Odisha)" },
    { slug: "mandya", stateSlug: "karnataka", name: "Mandya" },
  ];

  assert.equal(
    findHomepageDistrictPreview(previews, "karnataka", "mandya")?.name,
    "Mandya",
  );
});

test("homepage preview item keys stay distinct across districts that share row labels", () => {
  assert.notEqual(
    buildHomepagePreviewItemKey("karnataka", "mandya", "Krishnaraja Sagar"),
    buildHomepagePreviewItemKey("odisha", "mandya", "Krishnaraja Sagar"),
  );
  assert.equal(
    buildHomepagePreviewItemKey("karnataka", "mandya", "Krishnaraja   Sagar"),
    buildHomepagePreviewItemKey("karnataka", "mandya", "Krishnaraja Sagar"),
  );
});

test("formatHomepagePreviewAge clamps future timestamps instead of rendering negative ages", () => {
  assert.equal(
    formatHomepagePreviewAge("2026-05-05T12:01:00.000Z", Date.parse("2026-05-05T12:00:00.000Z")),
    "0m ago",
  );
  assert.equal(
    formatHomepagePreviewAge("not-a-date"),
    "Freshness unavailable",
  );
});

test("clampPercentage keeps preview bars inside the valid 0-100 range", () => {
  assert.equal(clampPercentage(-12), 0);
  assert.equal(clampPercentage(36), 36);
  assert.equal(clampPercentage(142), 100);
});

test("homepage preview route targets follow the surfaced district when rows are available", () => {
  assert.deepEqual(
    getHomepagePreviewRouteTarget(
      [{ stateSlug: "odisha", districtSlug: "mandya" }],
      "karnataka",
      "mysuru",
    ),
    { stateSlug: "odisha", districtSlug: "mandya" },
  );
  assert.deepEqual(
    getHomepagePreviewRouteTarget(
      [{ stateSlug: " ", districtSlug: " " }],
      "karnataka",
      "mysuru",
    ),
    { stateSlug: "karnataka", districtSlug: "mysuru" },
  );
});

test("roundPreviewMetric preserves zero values and rejects invalid numbers", () => {
  assert.equal(roundPreviewMetric(0), 0);
  assert.equal(roundPreviewMetric(31.6), 32);
  assert.equal(roundPreviewMetric(Number.NaN), null);
  assert.equal(roundPreviewMetric(undefined), null);
});

test("normalizePreviewLabel trims labels and rejects blanks", () => {
  assert.equal(normalizePreviewLabel("  Cauvery  "), "Cauvery");
  assert.equal(normalizePreviewLabel("  Krishnaraja   Sagar  "), "Krishnaraja Sagar");
  assert.equal(normalizePreviewLabel("   "), null);
  assert.equal(normalizePreviewLabel(null), null);
});

test("formatHomepagePreviewDistrictName falls back to a readable slug label", () => {
  assert.equal(formatHomepagePreviewDistrictName("Mandya", "mandya"), "Mandya");
  assert.equal(formatHomepagePreviewDistrictName("", "gautam-buddha-nagar"), "Gautam Buddha Nagar");
});

test("normalizePreviewTimestamp preserves valid dates and rejects invalid ones", () => {
  assert.equal(
    normalizePreviewTimestamp("2026-05-08T10:00:00.000Z"),
    "2026-05-08T10:00:00.000Z",
  );
  assert.equal(normalizePreviewTimestamp("not-a-date"), null);
});

test("dedupeLatestPreviewItems skips blank labels and collapses case-insensitive duplicates", () => {
  const items = [
    { name: "  " },
    { name: "Kabini" },
    { name: "Kabini  " },
    { name: "kabini" },
    { name: "KRS" },
  ];

  assert.deepEqual(
    dedupeLatestPreviewItems(items, (item) => item.name, 3),
    [{ name: "Kabini" }, { name: "KRS" }],
  );
});

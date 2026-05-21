import test from "node:test";
import assert from "node:assert/strict";
import {
  getContributorBannerCopy,
  hasMeaningfulSearchQuery,
  isInternalHref,
  localeAwareHref,
  matchesDistrictSearch,
  normalizeSearchQuery,
} from "../src/lib/chrome.ts";

test("normalizeSearchQuery trims and lowercases user input", () => {
  assert.equal(normalizeSearchQuery("  MandYa "), "mandya");
});

test("matchesDistrictSearch supports English and local-script district names", () => {
  assert.equal(matchesDistrictSearch("mand", "Mandya", "ಮಂಡ್ಯ"), true);
  assert.equal(matchesDistrictSearch("ಮಂಡ", "Mandya", "ಮಂಡ್ಯ"), true);
  assert.equal(matchesDistrictSearch("  ಮಂಡ  ", "Mandya", "ಮಂಡ್ಯ"), true);
  assert.equal(matchesDistrictSearch("xy", "Mandya", "ಮಂಡ್ಯ"), false);
});

test("hasMeaningfulSearchQuery ignores whitespace-only input", () => {
  assert.equal(hasMeaningfulSearchQuery("  "), false);
  assert.equal(hasMeaningfulSearchQuery(" m "), false);
  assert.equal(hasMeaningfulSearchQuery(" ma "), true);
});

test("getContributorBannerCopy distinguishes loading, empty, populated, and failed states", () => {
  assert.equal(getContributorBannerCopy(null, false), "Loading contributor count…");
  assert.equal(
    getContributorBannerCopy(0, false),
    "No public supporters are visible yet. Be the first to back India's data revolution.",
  );
  assert.equal(
    getContributorBannerCopy(12, false),
    "12 people already backing India's data revolution",
  );
  assert.equal(
    getContributorBannerCopy(0, true),
    "Contributor count is temporarily unavailable. The leaderboard is still available.",
  );
  assert.equal(
    getContributorBannerCopy(Number.NaN, false),
    "Contributor count is refreshing. The leaderboard is still available.",
  );
  assert.equal(
    getContributorBannerCopy(-1, false),
    "Contributor count is refreshing. The leaderboard is still available.",
  );
});

test("localeAwareHref only prefixes internal routes", () => {
  assert.equal(isInternalHref("/feedback"), true);
  assert.equal(isInternalHref("https://example.com"), false);
  assert.equal(localeAwareHref("hi", "/feedback"), "/hi/feedback");
  assert.equal(localeAwareHref("hi", "https://example.com"), "https://example.com");
});

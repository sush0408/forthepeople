import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { translateDictionaryValue } from "../src/i18n/translate.ts";

function loadDictionary(locale: "hi" | "kn") {
  return JSON.parse(
    readFileSync(new URL(`../src/dictionaries/${locale}.json`, import.meta.url), "utf8"),
  ) as Record<string, unknown>;
}

test("localized empty-state copy falls back to translated module labels", () => {
  const hi = loadDictionary("hi");
  const kn = loadDictionary("kn");

  assert.equal(
    translateDictionaryValue(hi, "emptyState.message", "", { module: "मौसम" }),
    "मौसम के लिए आधिकारिक जिला डेटा अभी जोड़ा जा रहा है।",
  );
  assert.equal(
    translateDictionaryValue(kn, "emptyState.availableSoon"),
    "ಅಧಿಕೃತ ಜಿಲ್ಲಾ ಡೇಟಾ ಲಭ್ಯವಾದಾಗ ಈ ಮಾಡ್ಯೂಲ್ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
  );
  assert.equal(
    translateDictionaryValue(hi, "emptyState.titles.water", "Dam Levels"),
    "बांध स्तर",
  );
});

test("localized shell copy exposes 404 and contributor banner strings", () => {
  const hi = loadDictionary("hi");
  const kn = loadDictionary("kn");

  assert.equal(
    translateDictionaryValue(hi, "notFound.title", "Page not found"),
    "पेज नहीं मिला",
  );
  assert.equal(
    translateDictionaryValue(kn, "support.banner.viewLeaderboard", "View leaderboard"),
    "ಲೀಡರ್‌ಬೋರ್ಡ್ ನೋಡಿ",
  );
});

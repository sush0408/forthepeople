import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { buildNoDataContent } from "../src/lib/no-data.ts";
import { getStateConfig } from "../src/lib/constants/state-config.ts";
import { translateDictionaryValue } from "../src/i18n/translate.ts";

function loadDictionary(locale: "hi" | "kn") {
  return JSON.parse(
    readFileSync(new URL(`../src/dictionaries/${locale}.json`, import.meta.url), "utf8"),
  ) as Record<string, unknown>;
}

test("no-data card localizes generic district copy on non-English routes", () => {
  const hi = loadDictionary("hi");
  const content = buildNoDataContent({
    module: "weather",
    district: "bengaluru-urban",
    stateConfig: getStateConfig("karnataka"),
    isUrban: false,
    translate: (path, fallback, vars) => translateDictionaryValue(hi, path, fallback, vars),
  });

  assert.equal(content.title, "डेटा तैयार किया जा रहा है");
  assert.match(content.body, /मौसम/);
  assert.match(content.body, /Bengaluru Urban/);
  assert.match(content.note, /ForThePeople\.in/);
});

test("no-data card keeps alert empty states honest instead of claiming there are no alerts", () => {
  const content = buildNoDataContent({
    module: "alerts",
    district: "mandya",
    stateConfig: getStateConfig("karnataka"),
    isUrban: false,
  });

  assert.equal(content.title, "Alert feed not live yet");
  assert.match(content.body, /Mandya/);
  assert.doesNotMatch(content.body, /There are currently no/i);
});

test("power no-data card exposes the official portal when a state config has one", () => {
  const content = buildNoDataContent({
    module: "power",
    district: "mandya",
    stateConfig: getStateConfig("karnataka"),
    isUrban: false,
  });

  assert.equal(content.sourceLabel, "Open official outage portal");
  assert.equal(content.sourceUrl, "https://bescom.karnataka.gov.in");
});

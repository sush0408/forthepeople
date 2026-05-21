import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDistrictRequestStateOptions,
  findDistrictRequestDistrict,
  findDistrictRequestState,
  getDistrictCoverageProgressPct,
  getDistrictRequestErrorMessage,
  getDistrictRequestHint,
  getLocalizedDistrictRequestLabel,
  normalizeDistrictRequestName,
  parseDistrictRequestSubmission,
  parseTopDistrictRequests,
} from "../src/lib/district-request.ts";

test("getDistrictRequestHint explains remaining coverage for a selected state", () => {
  assert.equal(getDistrictRequestHint("", 4), null);
  assert.equal(getDistrictRequestHint("   ", 4), null);
  assert.equal(getDistrictRequestHint("Karnataka", 1), "1 district still waiting in Karnataka.");
  assert.equal(getDistrictRequestHint(" Karnataka ", 1), "1 district still waiting in Karnataka.");
  assert.equal(getDistrictRequestHint("Karnataka", 3), "3 districts still waiting in Karnataka.");
});

test("getDistrictRequestHint explains fully covered states", () => {
  assert.equal(
    getDistrictRequestHint("Delhi", 0),
    "All known districts in Delhi are already live. Pick another state or vote on upcoming features.",
  );
});

test("getDistrictRequestErrorMessage prefers explicit API messages", () => {
  assert.equal(
    getDistrictRequestErrorMessage(new Error("Rate limit hit")),
    "Rate limit hit",
  );
  assert.equal(
    getDistrictRequestErrorMessage(null),
    "Could not submit your district request right now. Please try again.",
  );
});

test("parseTopDistrictRequests keeps only well-formed leaderboard rows", () => {
  assert.deepEqual(
    parseTopDistrictRequests({
      top: [
        { id: "1", stateName: "Karnataka", districtName: "Mandya", requestCount: 4 },
        { id: " 3 ", stateName: " Kerala ", districtName: " Wayanad ", requestCount: 2 },
        { id: " 6 ", stateName: " Uttar   Pradesh ", districtName: " Gautam   Buddha  Nagar ", requestCount: 8 },
        { id: "2", stateName: "Karnataka", districtName: "Mysuru", requestCount: "3" },
        { id: "", stateName: "Tamil Nadu", districtName: "Salem", requestCount: 1 },
        { id: "4", stateName: "Tamil Nadu", districtName: "Salem", requestCount: Number.NaN },
        { id: "5", stateName: "Tamil Nadu", districtName: "Salem", requestCount: -1 },
        null,
      ],
    }),
    [
      { id: "1", stateName: "Karnataka", districtName: "Mandya", requestCount: 4 },
      { id: "3", stateName: "Kerala", districtName: "Wayanad", requestCount: 2 },
      { id: "6", stateName: "Uttar Pradesh", districtName: "Gautam Buddha Nagar", requestCount: 8 },
    ],
  );
});

test("parseDistrictRequestSubmission respects explicit API failures", () => {
  assert.deepEqual(parseDistrictRequestSubmission({ success: false, error: " Duplicate request " }), {
    success: false,
    error: "Duplicate request",
  });
  assert.deepEqual(parseDistrictRequestSubmission({ success: true }), {
    success: true,
    error: null,
  });
  assert.deepEqual(parseDistrictRequestSubmission(null), {
    success: false,
    error: null,
  });
  assert.deepEqual(parseDistrictRequestSubmission({ error: "Temporary outage" }), {
    success: false,
    error: "Temporary outage",
  });
});

test("buildDistrictRequestStateOptions prioritizes states with pending districts", () => {
  assert.deepEqual(
    buildDistrictRequestStateOptions([
      {
        slug: "delhi",
        name: "Delhi",
        districts: [{ active: true }, { active: true }],
      },
      {
        slug: "karnataka",
        name: "Karnataka",
        districts: [{ active: true }, { active: false }, { active: false }],
      },
      {
        slug: "bihar",
        name: "Bihar",
        districts: [{ active: false }],
      },
    ] as never),
    [
      { slug: "karnataka", stateName: "Karnataka", stateLocalName: undefined, pendingDistrictCount: 2, fullyCovered: false },
      { slug: "bihar", stateName: "Bihar", stateLocalName: undefined, pendingDistrictCount: 1, fullyCovered: false },
      { slug: "delhi", stateName: "Delhi", stateLocalName: undefined, pendingDistrictCount: 0, fullyCovered: true },
    ],
  );
});

test("normalizeDistrictRequestName collapses internal whitespace", () => {
  assert.equal(normalizeDistrictRequestName(" Uttar   Pradesh "), "Uttar Pradesh");
  assert.equal(normalizeDistrictRequestName(""), "");
  assert.equal(normalizeDistrictRequestName(null), "");
});

test("getDistrictCoverageProgressPct never fabricates non-zero progress", () => {
  assert.equal(getDistrictCoverageProgressPct(0, 780), 0);
  assert.equal(getDistrictCoverageProgressPct(-4, 780), 0);
  assert.equal(getDistrictCoverageProgressPct(390, 780), 50);
  assert.equal(getDistrictCoverageProgressPct(900, 780), 100);
  assert.equal(getDistrictCoverageProgressPct(10, 0), 0);
});

test("getLocalizedDistrictRequestLabel keeps English primary only on English routes", () => {
  assert.equal(getLocalizedDistrictRequestLabel("en", "Karnataka", "ಕರ್ನಾಟಕ"), "Karnataka");
  assert.equal(getLocalizedDistrictRequestLabel("kn", "Karnataka", "ಕರ್ನಾಟಕ"), "ಕರ್ನಾಟಕ (Karnataka)");
  assert.equal(getLocalizedDistrictRequestLabel("hi", "Delhi", "दिल्ली"), "दिल्ली (Delhi)");
});

test("district request lookup helpers resolve states and districts by canonical English names", () => {
  const states = [
    {
      name: "Karnataka",
      nameLocal: "ಕರ್ನಾಟಕ",
      districts: [{ name: "Mysuru", nameLocal: "ಮೈಸೂರು", active: false }],
    },
  ] as never;

  assert.equal(findDistrictRequestState(states, " Karnataka ")?.nameLocal, "ಕರ್ನಾಟಕ");
  assert.equal(findDistrictRequestDistrict(states, "Karnataka", " Mysuru ")?.nameLocal, "ಮೈಸೂರು");
  assert.equal(findDistrictRequestState(states, "karnataka")?.nameLocal, "ಕರ್ನಾಟಕ");
  assert.equal(findDistrictRequestDistrict(states, "KARNATAKA", "mysuru")?.nameLocal, "ಮೈಸೂರು");
  assert.equal(findDistrictRequestState(states, " ಕರ್ನಾಟಕ ")?.name, "Karnataka");
  assert.equal(findDistrictRequestDistrict(states, "ಕರ್ನಾಟಕ", " ಮೈಸೂರು ")?.name, "Mysuru");
  assert.equal(findDistrictRequestDistrict(states, "Karnataka", "Mandya"), null);
});

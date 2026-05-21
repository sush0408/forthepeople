import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTenderQueryKey,
  buildTenderQuerySearch,
  deadlineUrgency,
  formatPublishedAge,
  timelineBounds,
} from "../src/lib/tenders/ui.ts";

test("formatPublishedAge handles same-day and one-day-old tenders", () => {
  const nowMs = Date.parse("2026-04-25T12:00:00.000Z");

  assert.equal(formatPublishedAge("2026-04-25T09:30:00.000Z", nowMs), "Published today");
  assert.equal(formatPublishedAge("2026-04-24T08:00:00.000Z", nowMs), "Published yesterday");
  assert.equal(formatPublishedAge("2026-04-21T08:00:00.000Z", nowMs), "Published 4d ago");
});

test("deadlineUrgency marks expired and urgent tenders correctly", () => {
  const nowMs = Date.parse("2026-04-25T12:00:00.000Z");

  assert.equal(deadlineUrgency("2026-04-25T10:00:00.000Z", nowMs).badgeLabel, "Closed");
  assert.equal(deadlineUrgency("2026-04-26T11:00:00.000Z", nowMs).badgeLabel, "Under 48h");
  assert.equal(deadlineUrgency("2026-04-30T12:00:00.000Z", nowMs).badgeLabel, "This week");
});

test("timelineBounds survives empty and invalid timelines", () => {
  const fallbackNowMs = Date.parse("2026-04-25T12:00:00.000Z");

  assert.deepEqual(timelineBounds([], fallbackNowMs), {
    earliest: fallbackNowMs,
    latest: fallbackNowMs + 1,
    spanMs: 1,
  });

  assert.deepEqual(timelineBounds([{ at: "not-a-date" }], fallbackNowMs), {
    earliest: fallbackNowMs,
    latest: fallbackNowMs + 1,
    spanMs: 1,
  });
});

test("tender query helpers scope client requests by state and district", () => {
  assert.equal(buildTenderQuerySearch("karnataka"), "state=karnataka");
  assert.deepEqual(
    buildTenderQueryKey("stats", "karnataka", "mandya", "live"),
    ["tenders", "stats", "karnataka", "mandya", "live"],
  );
});

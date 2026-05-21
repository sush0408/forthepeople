import assert from "node:assert/strict";
import test from "node:test";

import { formatRelativeFreshness } from "../src/lib/data-freshness.ts";
import { inferLocaleFromPathname, withLocalePath } from "../src/lib/locale-routing.ts";

test("withLocalePath prefixes bare internal routes and preserves locale-prefixed ones", () => {
  assert.equal(withLocalePath("hi", "/support"), "/hi/support");
  assert.equal(withLocalePath("kn", "features"), "/kn/features");
  assert.equal(withLocalePath("en", "/en/privacy"), "/en/privacy");
  assert.equal(
    withLocalePath("hi", "/contributors?filter=one-time"),
    "/hi/contributors?filter=one-time",
  );
  assert.equal(
    withLocalePath("ta", "/karnataka/mandya/data-sources"),
    "/ta/karnataka/mandya/data-sources",
  );
});

test("withLocalePath preserves special hrefs and root routes", () => {
  assert.equal(withLocalePath("hi", "/"), "/hi");
  assert.equal(withLocalePath("hi", "#support"), "#support");
  assert.equal(withLocalePath("hi", "?tab=faq"), "?tab=faq");
  assert.equal(withLocalePath("hi", "mailto:hello@forthepeople.in"), "mailto:hello@forthepeople.in");
  assert.equal(withLocalePath("hi", "//cdn.example.com/app.css"), "//cdn.example.com/app.css");
});

test("inferLocaleFromPathname falls back safely when the route is not localized", () => {
  assert.equal(inferLocaleFromPathname("/hi/karnataka/mandya"), "hi");
  assert.equal(inferLocaleFromPathname("/support"), "en");
  assert.equal(inferLocaleFromPathname(null), "en");
});

test("formatRelativeFreshness handles missing, invalid, and future timestamps", () => {
  const nowMs = Date.parse("2026-04-26T12:00:00.000Z");

  assert.equal(formatRelativeFreshness(null, nowMs), "Awaiting first sync");
  assert.equal(formatRelativeFreshness("not-a-date", nowMs), "Freshness unavailable");
  assert.equal(formatRelativeFreshness("2026-04-26T13:00:00.000Z", nowMs), "just now");
});

test("formatRelativeFreshness formats recent minutes, hours, and days", () => {
  const nowMs = Date.parse("2026-04-26T12:00:00.000Z");

  assert.equal(formatRelativeFreshness("2026-04-26T11:42:00.000Z", nowMs), "18m ago");
  assert.equal(formatRelativeFreshness("2026-04-26T08:00:00.000Z", nowMs), "4h ago");
  assert.equal(formatRelativeFreshness("2026-04-24T12:00:00.000Z", nowMs), "2d ago");
});

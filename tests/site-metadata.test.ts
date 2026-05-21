import assert from "node:assert/strict";
import test from "node:test";

import {
  localizedDistrictPath,
  localizedDistrictUrl,
  localizedSitePath,
  localizedSiteUrl,
} from "../src/lib/site-metadata.ts";

test("localizedSitePath prefixes internal paths with the active locale", () => {
  assert.equal(localizedSitePath("hi", "/support"), "/hi/support");
  assert.equal(localizedSitePath("ta", "about"), "/ta/about");
  assert.equal(localizedSitePath("en", "/en/privacy"), "/en/privacy");
});

test("localizedSiteUrl builds absolute locale-aware canonicals", () => {
  assert.equal(
    localizedSiteUrl("hi", "/support", "https://forthepeople.in"),
    "https://forthepeople.in/hi/support",
  );
  assert.equal(
    localizedSiteUrl("ta", "/karnataka", "https://forthepeople.in"),
    "https://forthepeople.in/ta/karnataka",
  );
  assert.equal(
    localizedSiteUrl("kn", "/support", "https://forthepeople.in/"),
    "https://forthepeople.in/kn/support",
  );
});

test("localizedDistrictPath and localizedDistrictUrl stay locale-aware for nested district routes", () => {
  assert.equal(
    localizedDistrictPath("hi", "karnataka", "mandya"),
    "/hi/karnataka/mandya",
  );
  assert.equal(
    localizedDistrictPath("ta", "tamil-nadu", "chennai", "/contributors"),
    "/ta/tamil-nadu/chennai/contributors",
  );
  assert.equal(
    localizedDistrictUrl("kn", "karnataka", "mysuru", "contributors", "https://forthepeople.in"),
    "https://forthepeople.in/kn/karnataka/mysuru/contributors",
  );
  assert.equal(
    localizedDistrictPath("hi", "karnataka", "mandya", "?tab=water"),
    "/hi/karnataka/mandya?tab=water",
  );
  assert.equal(
    localizedDistrictUrl("hi", "karnataka", "mandya", "#faq", "https://forthepeople.in/"),
    "https://forthepeople.in/hi/karnataka/mandya#faq",
  );
});

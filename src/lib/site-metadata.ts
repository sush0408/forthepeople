import { withLocalePath } from "./locale-routing.ts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forthepeople.in";

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/u, "");
}

export function localizedSitePath(locale: string, path: string): string {
  return withLocalePath(locale, path);
}

export function localizedSiteUrl(locale: string, path: string, baseUrl = BASE_URL): string {
  return `${normalizeBaseUrl(baseUrl)}${localizedSitePath(locale, path)}`;
}

export function localizedDistrictPath(
  locale: string,
  stateSlug: string,
  districtSlug: string,
  suffix = "",
): string {
  const normalizedSuffix = suffix
    ? (/^[?#]/u.test(suffix) ? suffix : `/${suffix.replace(/^\/+/u, "")}`)
    : "";
  return localizedSitePath(locale, `/${stateSlug}/${districtSlug}${normalizedSuffix}`);
}

export function localizedDistrictUrl(
  locale: string,
  stateSlug: string,
  districtSlug: string,
  suffix = "",
  baseUrl = BASE_URL,
): string {
  return `${normalizeBaseUrl(baseUrl)}${localizedDistrictPath(locale, stateSlug, districtSlug, suffix)}`;
}

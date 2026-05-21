import { withLocalePath } from "./locale-routing.ts";

type ChromeTranslator = (
  path: string,
  fallback?: string,
  vars?: Record<string, string | number>,
) => string;

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLocaleLowerCase();
}

export function hasMeaningfulSearchQuery(query: string, minimumLength = 2): boolean {
  return normalizeSearchQuery(query).length >= minimumLength;
}

export function matchesDistrictSearch(
  query: string,
  districtName: string,
  districtLocalName?: string | null,
): boolean {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!hasMeaningfulSearchQuery(normalizedQuery)) return false;

  return normalizeSearchQuery(districtName).includes(normalizedQuery)
    || normalizeSearchQuery(districtLocalName ?? "").includes(normalizedQuery);
}

export function getContributorBannerCopy(
  total: number | null,
  failed: boolean,
  translate?: ChromeTranslator,
): string {
  if (failed) {
    return translate?.(
      "support.banner.unavailable",
      "Contributor count is temporarily unavailable. The leaderboard is still available.",
    ) ?? "Contributor count is temporarily unavailable. The leaderboard is still available.";
  }

  if (total === null) {
    return translate?.("support.banner.loading", "Loading contributor count…") ?? "Loading contributor count…";
  }

  if (!Number.isFinite(total) || total < 0) {
    return translate?.(
      "support.banner.refreshing",
      "Contributor count is refreshing. The leaderboard is still available.",
    ) ?? "Contributor count is refreshing. The leaderboard is still available.";
  }

  if (total > 0) {
    const fallback = `${total.toLocaleString("en-IN")} people already backing India's data revolution`;
    return translate?.("support.banner.populated", fallback, { count: total.toLocaleString("en-IN") }) ?? fallback;
  }

  return translate?.(
    "support.banner.empty",
    "No public supporters are visible yet. Be the first to back India's data revolution.",
  ) ?? "No public supporters are visible yet. Be the first to back India's data revolution.";
}

export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function localeAwareHref(locale: string, href: string): string {
  return isInternalHref(href) ? withLocalePath(locale, href) : href;
}

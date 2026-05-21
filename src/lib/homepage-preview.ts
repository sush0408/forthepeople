import { buildStateDistrictKey } from "./district-selection.ts";

export interface HomepageDistrictPreviewMatch {
  slug: string;
  stateSlug?: string | null;
}

export function buildHomepagePreviewDistrictKey(
  stateSlug: string,
  districtSlug: string,
): string {
  return buildStateDistrictKey(stateSlug, districtSlug);
}

export function findHomepageDistrictPreview<T extends HomepageDistrictPreviewMatch>(
  previews: T[],
  stateSlug: string,
  districtSlug: string,
): T | null {
  const targetKey = buildHomepagePreviewDistrictKey(stateSlug, districtSlug);
  return previews.find((preview) =>
    buildHomepagePreviewDistrictKey(preview.stateSlug ?? "", preview.slug) === targetKey,
  ) ?? null;
}

export function buildHomepagePreviewItemKey(
  stateSlug: string,
  districtSlug: string,
  itemKey: string,
): string {
  const normalizedItemKey = normalizePreviewLabel(itemKey)?.toLocaleLowerCase() ?? "";
  return `${buildStateDistrictKey(stateSlug, districtSlug)}::${normalizedItemKey}`;
}

export function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(value, 100));
}

export function roundPreviewMetric(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value);
}

export function normalizePreviewLabel(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/gu, " ");
  return trimmed ? trimmed : null;
}

export function normalizePreviewTimestamp(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const timestamp = new Date(value);
  return Number.isFinite(timestamp.getTime()) ? timestamp.toISOString() : null;
}

export function dedupeLatestPreviewItems<T>(
  items: T[],
  getKey: (item: T) => string | null | undefined,
  limit: number,
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    const key = normalizePreviewLabel(getKey(item))?.toLocaleLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= limit) break;
  }

  return unique;
}

export function getHomepagePreviewRouteTarget<T extends { stateSlug?: string | null; districtSlug?: string | null }>(
  items: T[] | null | undefined,
  fallbackStateSlug: string,
  fallbackDistrictSlug: string,
): { stateSlug: string; districtSlug: string } {
  const firstMatch = items?.find((item) => normalizePreviewLabel(item.stateSlug) && normalizePreviewLabel(item.districtSlug));
  return {
    stateSlug: normalizePreviewLabel(firstMatch?.stateSlug) ?? fallbackStateSlug,
    districtSlug: normalizePreviewLabel(firstMatch?.districtSlug) ?? fallbackDistrictSlug,
  };
}

export function formatHomepagePreviewDistrictName(
  districtName: string | null | undefined,
  districtSlug: string,
): string {
  const normalizedDistrictName = normalizePreviewLabel(districtName);
  if (normalizedDistrictName) return normalizedDistrictName;

  return districtSlug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toLocaleUpperCase() + segment.slice(1))
    .join(" ");
}

export function formatHomepagePreviewAge(iso: string, now = Date.now()): string {
  const timestampMs = new Date(iso).getTime();
  if (!Number.isFinite(timestampMs)) return "Freshness unavailable";

  const diffMinutes = Math.max(0, Math.round((now - timestampMs) / 60_000));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h ago`;
  return `${Math.round(diffMinutes / 1440)}d ago`;
}

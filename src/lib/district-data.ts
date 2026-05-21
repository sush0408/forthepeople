export type DistrictDataQueryKey = readonly [
  "district",
  string,
  string,
  string,
  string,
];

function normalizeDistrictDataKeyPart(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim().toLocaleLowerCase() : "";
}

export function normalizeDistrictDataRouteParam(value: string | null | undefined): string {
  return normalizeDistrictDataKeyPart(value);
}

export function buildDistrictDataCacheKey(
  stateSlug: string,
  districtSlug: string,
  module: string,
  talukSlug?: string,
): string {
  const statePart = normalizeDistrictDataKeyPart(stateSlug) || "unknown-state";
  const districtPart = normalizeDistrictDataKeyPart(districtSlug) || "unknown-district";
  const modulePart = normalizeDistrictDataKeyPart(module) || "unknown-module";
  const talukPart = normalizeDistrictDataKeyPart(talukSlug);
  return talukPart
    ? `ftp:${statePart}:${districtPart}:${modulePart}:${talukPart}`
    : `ftp:${statePart}:${districtPart}:${modulePart}`;
}

export function buildDistrictDataQueryKey(
  stateSlug: string,
  districtSlug: string,
  module: string,
  talukSlug?: string,
): DistrictDataQueryKey {
  return [
    "district",
    normalizeDistrictDataKeyPart(stateSlug),
    normalizeDistrictDataKeyPart(districtSlug),
    normalizeDistrictDataKeyPart(module),
    normalizeDistrictDataKeyPart(talukSlug),
  ];
}

export function getDistrictDataErrorStatus(error: string | undefined): number {
  if (!error) return 200;
  if (error === "District not found") return 404;
  if (error.startsWith("Unknown module:")) return 400;
  return 200;
}

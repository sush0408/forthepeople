/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

export type DistrictMapAction = "explore" | "request";

function normalizeDistrictName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function districtMapAction(isActive: boolean): DistrictMapAction {
  return isActive ? "explore" : "request";
}

export function districtGeoJsonPath(stateSlug: string): string {
  return `/geo/${stateSlug}-districts.json`;
}

export function districtRequestPayload(stateName: string, districtName: string) {
  return {
    stateName: normalizeDistrictName(stateName),
    districtName: normalizeDistrictName(districtName),
  };
}

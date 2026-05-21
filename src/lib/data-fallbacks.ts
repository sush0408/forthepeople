import { INDIA_STATES, getDistrict, getTotalActiveDistrictCount } from "./constants/districts.ts";

function normalizeDistrictConfigKey(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export interface HomepageStatsFallback {
  activeDistricts: number;
  modulesPerDistrict: number;
  totalDataPoints: number;
  mostRecentAt: string | null;
  plannedDistricts: number;
  fromCache: false;
  error: true;
  fallback: "static-district-config";
}

export interface WaterModuleFallback {
  data: {
    dams: [];
    canals: [];
  };
  meta: {
    module: "water";
    district: string;
    updatedAt: string;
    fromCache: false;
    lastUpdated: null;
    fallback: "static-district-config";
    reason: "database-unavailable" | "district-not-in-static-config";
    districtName?: string;
  };
}

export interface HomepagePreviewFallback {
  districtPreviews: Array<{
    slug: string;
    stateSlug: string;
    name: string;
    nameLocal: string;
    tagline: string | null;
    weather: null;
    dam: null;
    crop: null;
    news: null;
    healthGrade: null;
    healthScore: null;
  }>;
  topCrops: [];
  latestNews: [];
  latestDams: [];
  fromCache: false;
  error: true;
  fallback: "static-district-config";
  reason: "database-unavailable" | "no-active-districts-in-db";
}

export function getHomepageStatsFallback(): HomepageStatsFallback {
  return {
    activeDistricts: getTotalActiveDistrictCount(),
    modulesPerDistrict: 29,
    totalDataPoints: 0,
    mostRecentAt: null,
    plannedDistricts: 780,
    fromCache: false,
    error: true,
    fallback: "static-district-config",
  };
}

export function shouldUseHomepageStatsFallback(
  activeDistricts: number,
  totalDataPoints: number,
): boolean {
  return activeDistricts <= 0 && totalDataPoints <= 0;
}

export function hasStaticWaterFallbackDistrict(
  stateSlug: string,
  districtSlug: string,
): boolean {
  return Boolean(getDistrict(normalizeDistrictConfigKey(stateSlug), normalizeDistrictConfigKey(districtSlug)));
}

export function getWaterModuleFallback(
  stateSlug: string,
  districtSlug: string,
  now = new Date(),
): WaterModuleFallback {
  const normalizedStateSlug = normalizeDistrictConfigKey(stateSlug);
  const normalizedDistrictSlug = normalizeDistrictConfigKey(districtSlug);
  const district = getDistrict(normalizedStateSlug, normalizedDistrictSlug);

  return {
    data: { dams: [], canals: [] },
    meta: {
      module: "water",
      district: normalizedDistrictSlug,
      updatedAt: now.toISOString(),
      fromCache: false,
      lastUpdated: null,
      fallback: "static-district-config",
      reason: district ? "database-unavailable" : "district-not-in-static-config",
      districtName: district?.name,
    },
  };
}

export function getHomepagePreviewFallback(
  reason: HomepagePreviewFallback["reason"] = "database-unavailable",
): HomepagePreviewFallback {
  const districtPreviews = INDIA_STATES.flatMap((state) =>
    state.districts
      .filter((district) => district.active)
      .map((district) => ({
        slug: district.slug,
        stateSlug: state.slug,
        name: district.name,
        nameLocal: district.nameLocal,
        tagline: district.tagline ?? null,
        weather: null,
        dam: null,
        crop: null,
        news: null,
        healthGrade: null,
        healthScore: null,
      })),
  );

  return {
    districtPreviews,
    topCrops: [],
    latestNews: [],
    latestDams: [],
    fromCache: false,
    error: true,
    fallback: "static-district-config",
    reason,
  };
}

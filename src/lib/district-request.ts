import type { State } from "./constants/districts.ts";

export interface TopDistrictRequest {
  id: string;
  stateName: string;
  districtName: string;
  requestCount: number;
}

export interface DistrictRequestSubmissionResult {
  success: boolean;
  error: string | null;
}

export interface DistrictRequestStateOption {
  slug: string;
  stateName: string;
  stateLocalName: string;
  pendingDistrictCount: number;
  fullyCovered: boolean;
}

type DistrictRequestTranslator = (
  path: string,
  fallback?: string,
  vars?: Record<string, string | number>,
) => string;

function hasNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeDistrictRequestLookupKey(value: unknown): string {
  return normalizeDistrictRequestName(value).toLocaleLowerCase();
}

export function normalizeDistrictRequestName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

export function getDistrictCoverageProgressPct(
  activeDistrictCount: number,
  plannedDistrictCount: number,
): number {
  if (!Number.isFinite(activeDistrictCount) || activeDistrictCount <= 0) {
    return 0;
  }

  if (!Number.isFinite(plannedDistrictCount) || plannedDistrictCount <= 0) {
    return 0;
  }

  return Math.min(100, (activeDistrictCount / plannedDistrictCount) * 100);
}

export function getLocalizedDistrictRequestLabel(
  locale: string,
  englishName: string,
  localName?: string | null,
): string {
  const normalizedEnglishName = normalizeDistrictRequestName(englishName);
  const normalizedLocalName = normalizeDistrictRequestName(localName);

  if (!normalizedEnglishName) {
    return normalizedLocalName;
  }

  if (
    locale === "en"
    || !normalizedLocalName
    || normalizedLocalName.toLocaleLowerCase() === normalizedEnglishName.toLocaleLowerCase()
  ) {
    return normalizedEnglishName;
  }

  return `${normalizedLocalName} (${normalizedEnglishName})`;
}

export function findDistrictRequestState<T extends Pick<State, "name" | "nameLocal" | "districts">>(
  states: T[],
  stateName: string,
): T | null {
  const normalizedStateName = normalizeDistrictRequestLookupKey(stateName);
  if (!normalizedStateName) return null;

  return states.find((state) => (
    normalizeDistrictRequestLookupKey(state.name) === normalizedStateName
    || normalizeDistrictRequestLookupKey(state.nameLocal) === normalizedStateName
  )) ?? null;
}

export function findDistrictRequestDistrict<
  TState extends Pick<State, "name" | "nameLocal" | "districts">,
  TDistrict extends TState["districts"][number],
>(
  states: TState[],
  stateName: string,
  districtName: string,
): TDistrict | null {
  const normalizedDistrictName = normalizeDistrictRequestLookupKey(districtName);
  const state = findDistrictRequestState(states, stateName);

  if (!state || !normalizedDistrictName) {
    return null;
  }

  return state.districts.find(
    (district) => (
      normalizeDistrictRequestLookupKey(district.name) === normalizedDistrictName
      || normalizeDistrictRequestLookupKey(district.nameLocal) === normalizedDistrictName
    ),
  ) as TDistrict | undefined ?? null;
}

export function parseTopDistrictRequests(payload: unknown): TopDistrictRequest[] {
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as { top?: unknown[] }).top)) {
    return [];
  }

  return (payload as { top: unknown[] }).top.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];

    const item = entry as Partial<TopDistrictRequest>;
    if (
      !hasNonEmptyText(item.id)
      || !hasNonEmptyText(item.stateName)
      || !hasNonEmptyText(item.districtName)
      || typeof item.requestCount !== "number"
      || !Number.isFinite(item.requestCount)
      || item.requestCount < 0
    ) {
      return [];
    }

    return [{
      id: normalizeDistrictRequestName(item.id),
      stateName: normalizeDistrictRequestName(item.stateName),
      districtName: normalizeDistrictRequestName(item.districtName),
      requestCount: item.requestCount,
    }];
  });
}

export function getDistrictRequestHint(
  stateName: string,
  lockedDistrictCount: number,
  translate?: DistrictRequestTranslator,
): string | null {
  const normalizedStateName = normalizeDistrictRequestName(stateName);

  if (!normalizedStateName) {
    return null;
  }

  if (lockedDistrictCount > 0) {
    const fallback =
      `${lockedDistrictCount} district${lockedDistrictCount === 1 ? "" : "s"} still waiting in ${normalizedStateName}.`;
    return translate?.(
      lockedDistrictCount === 1
        ? "home.requestCard.remainingHintOne"
        : "home.requestCard.remainingHintMany",
      fallback,
      { count: lockedDistrictCount, state: normalizedStateName },
    ) ?? fallback;
  }

  return translate?.(
    "home.requestCard.coveredHint",
    "All known districts in {state} are already live. Pick another state or vote on upcoming features.",
    { state: normalizedStateName },
  ) ?? `All known districts in ${normalizedStateName} are already live. Pick another state or vote on upcoming features.`;
}

export function getDistrictRequestErrorMessage(
  error: unknown,
  translate?: DistrictRequestTranslator,
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return translate?.(
    "home.requestCard.submitError",
    "Could not submit your district request right now. Please try again.",
  ) ?? "Could not submit your district request right now. Please try again.";
}

export function parseDistrictRequestSubmission(payload: unknown): DistrictRequestSubmissionResult {
  if (!payload || typeof payload !== "object") {
    return { success: false, error: null };
  }

  const typedPayload = payload as { success?: unknown; error?: unknown };
  const error = normalizeDistrictRequestName(typedPayload.error) || null;

  if (typedPayload.success === true) {
    return { success: true, error: null };
  }

  return { success: false, error };
}

export function buildDistrictRequestStateOptions(
  states: Pick<State, "slug" | "name" | "nameLocal" | "districts">[],
): DistrictRequestStateOption[] {
  return states
    .map((state) => {
      const pendingDistrictCount = state.districts.filter((district) => !district.active).length;
      return {
        slug: state.slug,
        stateName: state.name,
        stateLocalName: state.nameLocal,
        pendingDistrictCount,
        fullyCovered: pendingDistrictCount === 0,
      };
    })
    .sort((left, right) => {
      if (left.fullyCovered !== right.fullyCovered) {
        return left.fullyCovered ? 1 : -1;
      }
      if (left.pendingDistrictCount !== right.pendingDistrictCount) {
        return right.pendingDistrictCount - left.pendingDistrictCount;
      }
      return left.stateName.localeCompare(right.stateName);
    });
}

export function buildStateDistrictKey(
  stateSlug: string,
  districtSlug: string,
): string {
  return `${stateSlug.trim().toLocaleLowerCase()}::${districtSlug.trim().toLocaleLowerCase()}`;
}

export function parseStateDistrictKey(
  value: string,
): { stateSlug: string; districtSlug: string } | null {
  const parts = value.split("::");
  if (parts.length !== 2) {
    return null;
  }

  const [rawStateSlug = "", rawDistrictSlug = ""] = parts;
  const stateSlug = rawStateSlug.trim().toLocaleLowerCase();
  const districtSlug = rawDistrictSlug.trim().toLocaleLowerCase();

  if (!stateSlug || !districtSlug) {
    return null;
  }

  return { stateSlug, districtSlug };
}

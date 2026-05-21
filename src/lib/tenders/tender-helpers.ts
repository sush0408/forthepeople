// Server-only helpers for the Tenders module.
// Uses prisma — do NOT import from client components.
// For pure formatting/guard helpers, import from './format' instead.

import { prisma } from "@/lib/db";

// Re-export client-safe helpers so existing server-side imports don't break.
export { serializeForJson, formatInr, assertFactualCopy, tenderError } from "./format";

export interface ActiveTenderDistrictIdentity {
  districtName: string;
  districtSlug: string;
  stateName: string;
  stateSlug: string;
  tendersActive: boolean;
}

// ── District slug resolver (DB-driven) ────────────────────────────────────
export async function resolveActiveTenderDistrictIdentity(
  districtSlug: string,
  stateSlug?: string | null,
): Promise<ActiveTenderDistrictIdentity | null> {
  const normalizedStateSlug = stateSlug?.trim() || undefined;
  const row = await prisma.district.findFirst({
    where: {
      slug: districtSlug,
      active: true,
      ...(normalizedStateSlug ? { state: { slug: normalizedStateSlug } } : {}),
    },
    select: {
      name: true,
      slug: true,
      tendersActive: true,
      state: { select: { name: true, slug: true } },
    },
  });

  if (!row) return null;

  return {
    districtName: row.name,
    districtSlug: row.slug,
    stateName: row.state.name,
    stateSlug: row.state.slug,
    tendersActive: row.tendersActive,
  };
}

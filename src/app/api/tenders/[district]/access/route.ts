// GET /api/tenders/[district]/access
// Lightweight "is tenders activated for this district?" probe called by the
// tenders page before loading the dashboard. Intentionally returns zero
// credential-bearing fields — just district identity + boolean flag.

import { NextResponse } from "next/server";
import { resolveActiveTenderDistrictIdentity } from "@/lib/tenders/tender-helpers";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ district: string }> },
) {
  const { district: districtSlug } = await ctx.params;
  const stateSlug = new URL(req.url).searchParams.get("state");

  try {
    const row = await resolveActiveTenderDistrictIdentity(districtSlug, stateSlug);
    if (!row) {
      return NextResponse.json(
        {
          error: {
            code: "DISTRICT_NOT_ACTIVE",
            message: `District '${districtSlug}'${stateSlug ? ` in state '${stateSlug}'` : ""} not active`,
          },
        },
        { status: 404 },
      );
    }
    return NextResponse.json({
      tendersActive: row.tendersActive,
      districtName: row.districtName,
      districtSlug: row.districtSlug,
      stateName: row.stateName,
      stateSlug: row.stateSlug,
    });
  } catch {
    // Fail-open: if the DB is unreachable, default to locked so we don't
    // accidentally expose a broken dashboard.
    return NextResponse.json({ tendersActive: false, error: "db-unreachable" }, { status: 200 });
  }
}

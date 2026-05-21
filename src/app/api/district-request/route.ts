/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

// ═══════════════════════════════════════════════════════════
// ForThePeople.in — District Request API
// POST /api/district-request — vote for a district
// GET /api/district-request — get top requested districts
// ═══════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cacheGet, cacheSet } from "@/lib/cache";
import { normalizeDistrictRequestName } from "@/lib/district-request";

const TOP_CACHE_KEY = "ftp:district-requests:top";
const memoryRequests = new Map<string, { id: string; stateName: string; districtName: string; requestCount: number }>();

function memoryTop() {
  return [...memoryRequests.values()]
    .sort((left, right) =>
      right.requestCount - left.requestCount
      || left.stateName.localeCompare(right.stateName)
      || left.districtName.localeCompare(right.districtName),
    )
    .slice(0, 5);
}

function upsertMemoryRequest(stateName: string, districtName: string) {
  const normalizedStateName = normalizeDistrictRequestName(stateName);
  const normalizedDistrictName = normalizeDistrictRequestName(districtName);
  const key = `${normalizedStateName}::${normalizedDistrictName}`.toLowerCase();
  const existing = memoryRequests.get(key);
  const requestCount = (existing?.requestCount ?? 0) + 1;
  const record = {
    id: existing?.id ?? key,
    stateName: normalizedStateName,
    districtName: normalizedDistrictName,
    requestCount,
  };
  memoryRequests.set(key, record);
  return record;
}

export async function GET() {
  const cached = await cacheGet<object[]>(TOP_CACHE_KEY);
  if (cached) {
    return NextResponse.json({ top: cached, fromCache: true });
  }

  try {
    const top = await prisma.districtRequest.findMany({
      orderBy: [
        { requestCount: "desc" },
        { stateName: "asc" },
        { districtName: "asc" },
      ],
      take: 5,
    });
    await cacheSet(TOP_CACHE_KEY, top, 300);
    return NextResponse.json({ top, fromCache: false });
  } catch (err) {
    console.error("[district-request GET]", err);
    return NextResponse.json({ top: memoryTop(), fromCache: false, fallback: true });
  }
}

export async function POST(req: NextRequest) {
  let stateName = "";
  let districtName = "";

  try {
    const body = await req.json();
    stateName = normalizeDistrictRequestName(body.stateName);
    districtName = normalizeDistrictRequestName(body.districtName);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!stateName || !districtName) {
    return NextResponse.json({ error: "stateName and districtName required" }, { status: 400 });
  }

  try {
    // Upsert — increment count
    const record = await prisma.districtRequest.upsert({
      where: { stateName_districtName: { stateName, districtName } },
      create: { stateName, districtName, requestCount: 1 },
      update: { requestCount: { increment: 1 } },
    });

    // Bust top cache
    await cacheSet(TOP_CACHE_KEY, null, 0);

    return NextResponse.json({ success: true, requestCount: record.requestCount });
  } catch (err) {
    console.error("[district-request POST]", err);
    const record = upsertMemoryRequest(stateName, districtName);
    await cacheSet(TOP_CACHE_KEY, null, 0);
    return NextResponse.json({ success: true, requestCount: record.requestCount, fallback: true });
  }
}

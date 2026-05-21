/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

// ═══════════════════════════════════════════════════════════
// ForThePeople.in — Homepage Stats API
// GET /api/data/homepage-stats
// Returns aggregated counts for hero stats bar
// ═══════════════════════════════════════════════════════════
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cacheGet, cacheSet } from "@/lib/cache";
import { getHomepageStatsFallback, shouldUseHomepageStatsFallback } from "@/lib/data-fallbacks";
import { latestFreshnessIso } from "@/lib/data-freshness";

const CACHE_KEY = "ftp:homepage-stats:v3";

export async function GET() {
  const cached = await cacheGet<object>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ ...cached, fromCache: true });
  }

  try {
    const [
      cropCount,
      damCount,
      weatherCount,
      newsCount,
      leaderCount,
      schoolCount,
      activeDistricts,
      latestCrop,
      latestWeather,
      latestDam,
      latestNews,
    ] = await Promise.all([
      prisma.cropPrice.count(),
      prisma.damReading.count(),
      prisma.weatherReading.count(),
      prisma.newsItem.count(),
      prisma.leader.count(),
      prisma.school.count(),
      prisma.district.count({ where: { active: true } }),
      prisma.cropPrice.findFirst({ orderBy: { fetchedAt: "desc" }, select: { fetchedAt: true } }),
      prisma.weatherReading.findFirst({ orderBy: { recordedAt: "desc" }, select: { recordedAt: true } }),
      prisma.damReading.findFirst({ orderBy: { recordedAt: "desc" }, select: { recordedAt: true } }),
      prisma.newsItem.findFirst({ orderBy: { publishedAt: "desc" }, select: { publishedAt: true } }),
    ]);

    const totalDataPoints = cropCount + damCount + weatherCount + newsCount + leaderCount + schoolCount;
    const mostRecentAt = latestFreshnessIso([
      latestCrop?.fetchedAt,
      latestWeather?.recordedAt,
      latestDam?.recordedAt,
      latestNews?.publishedAt,
    ]);

    if (shouldUseHomepageStatsFallback(activeDistricts, totalDataPoints)) {
      const fallback = getHomepageStatsFallback();
      await cacheSet(CACHE_KEY, fallback, 300);
      return NextResponse.json(fallback, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
      });
    }

    const result = {
      activeDistricts,
      modulesPerDistrict: 29,
      totalDataPoints,
      mostRecentAt,
      plannedDistricts: 780,
      fromCache: false,
    };

    await cacheSet(CACHE_KEY, result, 300); // 5 min cache
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("[homepage-stats]", err);
    try {
      const fallbackCount = await prisma.district.count({ where: { active: true } });
      if (fallbackCount === 0) {
        return NextResponse.json(getHomepageStatsFallback());
      }
      return NextResponse.json({
        activeDistricts: fallbackCount,
        modulesPerDistrict: 29,
        totalDataPoints: 0,
        mostRecentAt: null,
        plannedDistricts: 780,
        fromCache: false,
        error: true,
        fallback: "database-partial",
      });
    } catch {
      return NextResponse.json(getHomepageStatsFallback());
    }
  }
}

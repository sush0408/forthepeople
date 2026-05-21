/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

// ═══════════════════════════════════════════════════════════
// ForThePeople.in — Homepage Preview API
// GET /api/data/homepage-preview
// Returns live data snippets for active districts (for cards)
// ═══════════════════════════════════════════════════════════
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cacheGet, cacheSet } from "@/lib/cache";
import { getHomepagePreviewFallback } from "@/lib/data-fallbacks";
import {
  dedupeLatestPreviewItems,
  normalizePreviewLabel,
  normalizePreviewTimestamp,
  roundPreviewMetric,
} from "@/lib/homepage-preview";

const CACHE_KEY = "ftp:homepage-preview:v1";

export async function GET() {
  const cached = await cacheGet<object>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ ...cached, fromCache: true });
  }

  try {
    // Get active districts
    const activeDistricts = await prisma.district.findMany({
      where: { active: true },
      orderBy: [{ state: { slug: "asc" } }, { name: "asc" }],
      select: { id: true, slug: true, name: true, nameLocal: true, tagline: true, state: { select: { slug: true } } },
    });
    if (activeDistricts.length === 0) {
      return NextResponse.json(getHomepagePreviewFallback("no-active-districts-in-db"));
    }
    const districtMetaById = new Map(
      activeDistricts.map((district) => [
        district.id,
        {
          districtName: district.name,
          districtSlug: district.slug,
          stateSlug: (district as { state?: { slug: string } }).state?.slug ?? "karnataka",
        },
      ]),
    );
    const getDistrictMeta = (districtId: string | null) =>
      districtId ? districtMetaById.get(districtId) : undefined;

    // For each district, fetch latest weather, dam, crop in one pass
    const previews = await Promise.all(
      activeDistricts.map(async (d) => {
        const [weather, dam, crop, news, healthScore] = await Promise.all([
          prisma.weatherReading.findFirst({
            where: { districtId: d.id },
            orderBy: { recordedAt: "desc" },
            select: { temperature: true, conditions: true, recordedAt: true },
          }),
          prisma.damReading.findFirst({
            where: { districtId: d.id },
            orderBy: { recordedAt: "desc" },
            select: { damName: true, storagePct: true, recordedAt: true },
          }),
          prisma.cropPrice.findFirst({
            where: { districtId: d.id },
            orderBy: { date: "desc" },
            select: { commodity: true, modalPrice: true, date: true },
          }),
          prisma.newsItem.findFirst({
            where: { districtId: d.id },
            orderBy: { publishedAt: "desc" },
            select: { title: true, publishedAt: true, source: true },
          }),
          prisma.districtHealthScore.findUnique({
            where: { districtId: d.id },
            select: { grade: true, overallScore: true },
          }),
        ]);

        return {
          slug: d.slug,
          stateSlug: (d as { state?: { slug: string } }).state?.slug ?? "karnataka",
          name: d.name,
          nameLocal: d.nameLocal,
          tagline: d.tagline,
          weather: weather
            ? {
                temp: roundPreviewMetric(weather.temperature),
                conditions: normalizePreviewLabel(weather.conditions),
              }
            : null,
          dam: dam
            ? {
                name: normalizePreviewLabel(dam.damName) ?? "Unnamed reservoir",
                storagePct: roundPreviewMetric(dam.storagePct) ?? 0,
              }
            : null,
          crop: crop
            ? {
                commodity: normalizePreviewLabel(crop.commodity) ?? "Unknown commodity",
                price: roundPreviewMetric(crop.modalPrice) ?? 0,
              }
            : null,
          news: news
            ? {
                title: normalizePreviewLabel(news.title) ?? "Latest district update",
                source: normalizePreviewLabel(news.source) ?? "Official source",
                publishedAt: news.publishedAt.toISOString(),
              }
            : null,
          healthGrade: healthScore?.grade ?? null,
          healthScore: roundPreviewMetric(healthScore?.overallScore),
        };
      })
    );

    // Also fetch top 3 crops across all active districts for the crops card
    const topCrops = await prisma.cropPrice.findMany({
      where: { districtId: { in: activeDistricts.map((d) => d.id) } },
      orderBy: { date: "desc" },
      take: 30,
      select: { commodity: true, modalPrice: true, date: true, districtId: true },
    });

    // Deduplicate by commodity, keep latest
    const latestCrops = dedupeLatestPreviewItems(topCrops, (crop) => crop.commodity, 3)
      .map((crop) => ({
        ...crop,
        commodity: normalizePreviewLabel(crop.commodity) ?? "Unknown commodity",
        modalPrice: roundPreviewMetric(crop.modalPrice) ?? 0,
        districtName: getDistrictMeta(crop.districtId)?.districtName ?? "Unknown district",
        districtSlug: getDistrictMeta(crop.districtId)?.districtSlug ?? "",
        stateSlug: getDistrictMeta(crop.districtId)?.stateSlug ?? "",
      }));

    // Latest news across all districts
    const latestNews = (await prisma.newsItem.findMany({
      where: { districtId: { in: activeDistricts.map((d) => d.id) } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true, source: true, publishedAt: true, districtId: true },
    })).map((news) => ({
      title: normalizePreviewLabel(news.title) ?? "Latest district update",
      source: normalizePreviewLabel(news.source) ?? "Official source",
      publishedAt: normalizePreviewTimestamp(news.publishedAt) ?? "",
      districtName: getDistrictMeta(news.districtId)?.districtName ?? "Unknown district",
      districtSlug: getDistrictMeta(news.districtId)?.districtSlug ?? "",
      stateSlug: getDistrictMeta(news.districtId)?.stateSlug ?? "",
    }));

    // Dam levels for the dams card
    const latestDams = await prisma.damReading.findMany({
      where: { districtId: { in: activeDistricts.map((d) => d.id) } },
      orderBy: { recordedAt: "desc" },
      take: 10,
      select: { damName: true, storagePct: true, districtId: true },
    });
    // Deduplicate by damName
    const uniqueDams = dedupeLatestPreviewItems(latestDams, (dam) => dam.damName, 3)
      .map((dam) => ({
        ...dam,
        damName: normalizePreviewLabel(dam.damName) ?? "Unnamed reservoir",
        storagePct: roundPreviewMetric(dam.storagePct) ?? 0,
        districtName: getDistrictMeta(dam.districtId)?.districtName ?? "Unknown district",
        districtSlug: getDistrictMeta(dam.districtId)?.districtSlug ?? "",
        stateSlug: getDistrictMeta(dam.districtId)?.stateSlug ?? "",
      }));

    const result = {
      districtPreviews: previews,
      topCrops: latestCrops,
      latestNews,
      latestDams: uniqueDams,
      fromCache: false,
    };

    await cacheSet(CACHE_KEY, result, 300);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("[homepage-preview]", err);
    return NextResponse.json(getHomepagePreviewFallback());
  }
}

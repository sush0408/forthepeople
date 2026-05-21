/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { CloudRain, CloudSun, Newspaper, type LucideIcon, SunMedium, Waves, Wheat } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { getHomepagePreviewFallback } from "@/lib/data-fallbacks";
import {
  buildHomepagePreviewItemKey,
  clampPercentage,
  formatHomepagePreviewDistrictName,
  formatHomepagePreviewAge,
  getHomepagePreviewRouteTarget,
} from "@/lib/homepage-preview";

interface Preview {
  topCrops: {
    commodity: string;
    modalPrice: number;
    date: string;
    districtId: string;
    districtSlug: string;
    districtName: string;
    stateSlug: string;
  }[];
  latestNews: {
    title: string;
    source: string;
    publishedAt: string;
    districtId: string;
    districtSlug: string;
    districtName: string;
    stateSlug: string;
  }[];
  latestDams: {
    damName: string;
    storagePct: number;
    districtId: string;
    districtSlug: string;
    districtName: string;
    stateSlug: string;
  }[];
  districtPreviews: {
    slug: string;
    name?: string;
    stateSlug?: string;
    weather: { temp: number | null; conditions: string | null } | null;
  }[];
  error?: boolean;
  fallback?: string;
  reason?: string;
}

function WeatherConditionIcon({ conditions }: { conditions: string | null | undefined }) {
  const normalizedConditions = conditions?.toLocaleLowerCase() ?? "";
  const Icon = normalizedConditions.includes("rain")
    ? CloudRain
    : normalizedConditions.includes("cloud")
      ? CloudSun
      : SunMedium;

  return <Icon size={14} strokeWidth={1.8} aria-hidden="true" />;
}

function damBar(pct: number) {
  const clampedPct = clampPercentage(pct);
  const color = clampedPct > 70 ? "#16A34A" : clampedPct > 40 ? "#F59E0B" : "#DC2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div style={{ flex: 1, height: 6, background: "#F5F5F0", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${clampedPct}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)", color: "#6B6B6B", minWidth: 36 }}>
        {clampedPct}%
      </span>
    </div>
  );
}

function EmptyPreviewState({ message }: { message: string }) {
  return (
    <span style={{ fontSize: 12, color: "#9B9B9B", lineHeight: 1.5 }}>
      {message}
    </span>
  );
}

function PreviewCard({
  Icon,
  title,
  children,
  link,
  linkLabel,
}: {
  Icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  link: string;
  linkLabel: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E4",
        borderRadius: 16,
        padding: "18px 18px 14px",
        flex: 1,
        minWidth: 220,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#EFF6FF",
            color: "#2563EB",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{title}</span>
      </div>
      <div style={{ marginBottom: 12 }}>{children}</div>
      <Link
        href={link}
        style={{ fontSize: 12, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export default function LiveDataPreview({ locale }: { locale: string }) {
  const { t } = useI18n();
  const { data, isLoading } = useQuery<Preview>({
    queryKey: ["homepage-preview"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/data/homepage-preview");
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload || typeof payload !== "object") {
          return getHomepagePreviewFallback();
        }

        return payload as Preview;
      } catch {
        return getHomepagePreviewFallback();
      }
    },
    staleTime: 300_000,
  });

  if (isLoading) {
    return (
      <div style={{ padding: "0 16px", display: "flex", gap: 12, overflowX: "auto" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E8E4",
              borderRadius: 16,
              padding: 18,
              minWidth: 220,
              height: 140,
              flex: 1,
            }}
          />
        ))}
      </div>
    );
  }

  const firstDistrict = data?.districtPreviews?.[0];
  const firstSlug = firstDistrict?.slug ?? "mandya";
  const firstState = firstDistrict?.stateSlug ?? "karnataka";
  const cropRouteTarget = getHomepagePreviewRouteTarget(data?.topCrops, firstState, firstSlug);
  const damRouteTarget = getHomepagePreviewRouteTarget(data?.latestDams, firstState, firstSlug);
  const newsRouteTarget = getHomepagePreviewRouteTarget(data?.latestNews, firstState, firstSlug);
  const weatherRows = data?.districtPreviews?.slice(0, 4) ?? [];
  const remainingWeatherCount = Math.max(0, (data?.districtPreviews?.length ?? 0) - weatherRows.length);
  const statusMessage = data?.reason === "no-active-districts-in-db"
    ? t(
        "home.preview.noActiveDistrictsStatus",
        "No active districts are available in the local database yet. Showing static coverage only.",
      )
    : data?.fallback
      ? t("home.preview.fallbackStatus", "Showing district coverage while live homepage feeds reconnect.")
      : t("home.preview.liveStatus", "Live homepage cards refresh as new district data lands.");

  return (
    <div>
      <div style={{ padding: "16px 16px 8px" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "#9B9B9B",
            marginBottom: 4,
          }}
        >
          {t("home.preview.eyebrow", "Live data right now")}
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
          {statusMessage}
        </div>
      </div>
      <div style={{ padding: "0 16px 16px", display: "flex", gap: 12, overflowX: "auto" }}>
        {/* Crop Prices */}
        <PreviewCard
          Icon={Wheat}
          title={t("home.preview.cropsTitle", "Today's crop prices")}
          link={`/${locale}/${cropRouteTarget.stateSlug}/${cropRouteTarget.districtSlug}/crops`}
          linkLabel={t("home.preview.cropsLink", "All prices ->")}
        >
          {data?.topCrops?.length ? (
            data.topCrops.map((c) => (
              <div
                key={buildHomepagePreviewItemKey(c.stateSlug, c.districtSlug, `${c.commodity}:${c.date}`)}
                style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 10 }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#4B4B4B" }}>{c.commodity}</div>
                  <div style={{ fontSize: 10, color: "#9B9B9B", marginTop: 1 }}>{c.districtName}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono, monospace)", color: "#16A34A", whiteSpace: "nowrap" }}>
                  ₹{c.modalPrice.toLocaleString("en-IN")}/qtl
                </span>
              </div>
            ))
          ) : (
            <EmptyPreviewState
              message={t(
                "home.preview.cropsEmpty",
                "Awaiting the latest market-day crop sync for active districts.",
              )}
            />
          )}
        </PreviewCard>

        {/* Dam Levels */}
        <PreviewCard
          Icon={Waves}
          title={t("home.preview.damsTitle", "Dam levels")}
          link={`/${locale}/${damRouteTarget.stateSlug}/${damRouteTarget.districtSlug}/water`}
          linkLabel={t("home.preview.damsLink", "Full report ->")}
        >
          {data?.latestDams?.length ? (
            data.latestDams.map((d) => (
              <div
                key={buildHomepagePreviewItemKey(d.stateSlug, d.districtSlug, d.damName)}
                style={{ marginBottom: 2 }}
              >
                <div style={{ fontSize: 11, color: "#6B6B6B", marginBottom: 2 }}>{d.damName}</div>
                <div style={{ fontSize: 10, color: "#9B9B9B", marginBottom: 4 }}>{d.districtName}</div>
                {damBar(d.storagePct)}
              </div>
            ))
          ) : (
            <EmptyPreviewState
              message={t("home.preview.damsEmpty", "Awaiting the first dam-level sync for active districts.")}
            />
          )}
        </PreviewCard>

        {/* News */}
        <PreviewCard
          Icon={Newspaper}
          title={t("home.preview.newsTitle", "Latest news")}
          link={`/${locale}/${newsRouteTarget.stateSlug}/${newsRouteTarget.districtSlug}/news`}
          linkLabel={t("home.preview.newsLink", "All news ->")}
        >
          {data?.latestNews?.length ? (
            data.latestNews.map((n, i) => (
              <div
                key={buildHomepagePreviewItemKey(n.stateSlug, n.districtSlug, `${n.title}:${n.publishedAt}:${i}`)}
                style={{ marginBottom: 8 }}
              >
                <div style={{ fontSize: 12, color: "#1A1A1A", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 10, color: "#9B9B9B", marginTop: 2 }}>
                  {n.districtName} · {n.source} · {formatHomepagePreviewAge(n.publishedAt)}
                </div>
              </div>
            ))
          ) : (
            <EmptyPreviewState
              message={t("home.preview.newsEmpty", "No recent district headlines are available yet.")}
            />
          )}
        </PreviewCard>

        {/* Weather */}
        <PreviewCard
          Icon={CloudSun}
          title={t("home.preview.weatherTitle", "Weather")}
          link={`/${locale}/${firstState}/${firstSlug}/weather`}
          linkLabel={t("home.preview.weatherLink", "Full forecast ->")}
        >
          {weatherRows.length ? (
            <>
              {weatherRows.map((d) => (
                <div key={`${d.stateSlug ?? "unknown"}-${d.slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#4B4B4B" }}>
                    {formatHomepagePreviewDistrictName(d.name, d.slug)}
                  </span>
                  {d.weather ? (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "var(--font-mono, monospace)",
                        color: "#2563EB",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span>{d.weather.temp !== null ? `${d.weather.temp}°C` : "–"}</span>
                      {d.weather.conditions ? <WeatherConditionIcon conditions={d.weather.conditions} /> : null}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#9B9B9B" }}>–</span>
                  )}
                </div>
              ))}
              {remainingWeatherCount > 0 && (
                <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 6 }}>
                  {t(
                    "home.preview.weatherOverflow",
                    "+{count} more active districts in the full weather dashboard",
                    { count: remainingWeatherCount },
                  )}
                </div>
              )}
            </>
          ) : (
            <EmptyPreviewState
              message={t("home.preview.weatherEmpty", "Awaiting the first weather reading for active districts.")}
            />
          )}
        </PreviewCard>
      </div>
    </div>
  );
}

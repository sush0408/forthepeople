/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { formatRelativeFreshness } from "@/lib/data-freshness";
import { getHomepageStatsFallback } from "@/lib/data-fallbacks";

interface Stats {
  activeDistricts: number;
  modulesPerDistrict: number;
  totalDataPoints: number;
  mostRecentAt: string | null;
  plannedDistricts: number;
  error?: boolean;
  fallback?: string;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const start = countRef.current;
    const delta = target - start;
    if (delta === 0) return;

    let frameId = 0;
    let startedAt: number | null = null;
    const tick = (timestamp: number) => {
      if (startedAt === null) {
        startedAt = timestamp;
      }

      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const nextCount = Math.round(start + delta * progress);
      setCount(nextCount);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [target, duration]);
  return count;
}

function StatCard({ value, label, mono = true }: { value: string; label: string; mono?: boolean }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E4",
        borderRadius: 12,
        padding: "16px 14px",
        textAlign: "center",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#2563EB",
          fontFamily: mono ? "var(--font-mono, monospace)" : "var(--font-plus-jakarta, system-ui, sans-serif)",
          letterSpacing: "-1px",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#6B6B6B", marginTop: 4, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

export default function HomepageStats() {
  const { t } = useI18n();
  const { data } = useQuery<Stats>({
    queryKey: ["homepage-stats"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/data/homepage-stats");
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload || typeof payload !== "object") {
          return {
            ...getHomepageStatsFallback(),
            error: true,
            fallback: "request-failed",
          };
        }

        return payload as Stats;
      } catch {
        return {
          ...getHomepageStatsFallback(),
          error: true,
          fallback: "request-failed",
        };
      }
    },
    staleTime: 300_000,
  });

  // Drive the count-up animation from real values only. While the API is in
  // flight we render an em-dash so users never see "0 Districts LIVE" during
  // a cold function start.
  const districts = useCountUp(data?.activeDistricts ?? 0);
  const modules = useCountUp(data?.modulesPerDistrict ?? 29);
  const dataPoints = useCountUp(data?.totalDataPoints ?? 0);
  const ready = !!data;
  const statusCopy = data?.fallback
    ? t("home.stats.fallbackStatus", "Showing district coverage while local homepage stats reconnect.")
    : t("home.stats.liveStatus", "Data refreshes every 5-30 minutes from official government portals.");

  return (
    <div>
      <div className="grid grid-cols-2 md:flex" style={{ gap: 8, padding: "12px 16px 0" }}>
        <StatCard value={ready ? `${districts}` : "—"} label={t("home.stats.districtsLive", "Districts live")} />
        <StatCard value={ready ? `${modules}` : "—"} label={t("home.stats.dashboardsPerDistrict", "Dashboards / district")} />
        <StatCard
          value={ready ? dataPoints.toLocaleString("en-IN") : "—"}
          label={t("home.stats.dataPointsTracked", "Data points tracked")}
        />
        <StatCard
          value={`${(data?.plannedDistricts ?? 780).toLocaleString("en-IN")}+`}
          label={t("home.stats.districtsComing", "Districts coming")}
        />
        <div className="hidden md:contents">
          <StatCard
            value={ready ? formatRelativeFreshness(data?.mostRecentAt) : "—"}
            label={t("home.stats.lastUpdated", "Last updated")}
            mono={false}
          />
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#9B9B9B", textAlign: "center", marginTop: 8 }}>
        {statusCopy}
      </p>
    </div>
  );
}

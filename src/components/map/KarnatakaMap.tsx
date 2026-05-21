/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { CheckCircle2, Lock, Send } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { INDIA_STATES } from "@/lib/constants/districts";
import { getLocalizedDistrictRequestLabel, parseDistrictRequestSubmission } from "@/lib/district-request";
import { districtMapAction, districtRequestPayload } from "@/lib/map/district-map";

interface KarnatakaMapProps {
  locale: string;
  stateName: string;
  activeDistricts: Set<string>; // set of active district slugs
}

export default function KarnatakaMap({ locale, stateName, activeDistricts }: KarnatakaMapProps) {
  const router = useRouter();
  const { t } = useI18n();
  const stateData = INDIA_STATES.find((state) => state.slug === "karnataka");
  const [tooltip, setTooltip] = useState<{ name: string; active: boolean; x: number; y: number } | null>(null);
  const [requestNote, setRequestNote] = useState<{ districtName: string; status: "sent" | "error" } | null>(null);

  useEffect(() => {
    if (!requestNote) return;

    const timeout = window.setTimeout(() => setRequestNote(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [requestNote]);

  function getDistrictLabel(districtSlug: string, fallbackName: string): string {
    const district = stateData?.districts.find((item) => item.slug === districtSlug);
    return getLocalizedDistrictRequestLabel(locale, district?.name ?? fallbackName, district?.nameLocal);
  }

  async function requestDistrict(districtName: string, districtLabel: string) {
    try {
      const res = await fetch("/api/district-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(districtRequestPayload(stateName, districtName)),
      });
      const payload = await res.json().catch(() => null);
      const submission = parseDistrictRequestSubmission(payload);
      if (!res.ok || !submission.success) throw new Error(submission.error ?? "Request failed");
      setRequestNote({ districtName: districtLabel, status: "sent" });
    } catch {
      setRequestNote({ districtName: districtLabel, status: "error" });
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [76.5, 15.3], scale: 3200 }}
        width={500}
        height={450}
        style={{ width: "100%", height: "auto", maxHeight: "100%", display: "block" }}
      >
        <Geographies geography="/geo/karnataka-districts.json">
          {({ geographies }: { geographies: Array<{ rsmKey: string; properties: Record<string, string | boolean> }> }) =>
            geographies.map((geo) => {
              const slug = geo.properties?.slug as string ?? "";
              const name = geo.properties?.name as string ?? "";
              const districtLabel = getDistrictLabel(slug, name);
              const isActive = activeDistricts.has(slug);
              const action = districtMapAction(isActive);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (action === "explore") {
                      router.push(`/${locale}/karnataka/${slug}`);
                    } else {
                      void requestDistrict(name, districtLabel);
                    }
                  }}
                  onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                    const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                    if (rect) {
                      setTooltip({ name: districtLabel, active: isActive, x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }
                  }}
                  onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                    const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                    if (rect) {
                      setTooltip((t) => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: {
                      fill: isActive ? "rgba(37,99,235,0.18)" : "#E8E8E4",
                      stroke: isActive ? "#2563EB" : "#FFFFFF",
                      strokeWidth: isActive ? 1.5 : 0.8,
                      outline: "none",
                      cursor: "pointer",
                      transition: "fill 150ms",
                    },
                    hover: {
                      fill: isActive ? "#EFF6FF" : "#D4D4D0",
                      stroke: isActive ? "#1D4ED8" : "#FFFFFF",
                      strokeWidth: isActive ? 2 : 0.8,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: isActive ? "rgba(37,99,235,0.45)" : "#D4D4D0",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: Math.min(tooltip.x + 10, 260),
            top: Math.max(tooltip.y - 36, 4),
            background: "#1A1A1A",
            color: "#FFFFFF",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {!tooltip.active && <Lock size={10} style={{ opacity: 0.7 }} />}
          {tooltip.name}
          {tooltip.active && (
            <span style={{ color: "#93C5FD", marginLeft: 4 }}>
              {t("map.exploreAction", "Explore")}
            </span>
          )}
          {!tooltip.active && (
            <span style={{ color: "#FDE68A", marginLeft: 4 }}>
              {t("map.requestAction", "Click to request")}
            </span>
          )}
        </div>
      )}

      {requestNote && (
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: requestNote.status === "sent" ? "#ECFDF5" : "#FEF2F2",
              border: `1px solid ${requestNote.status === "sent" ? "#BBF7D0" : "#FECACA"}`,
              color: requestNote.status === "sent" ? "#166534" : "#991B1B",
              borderRadius: 999,
              padding: "7px 11px",
              fontSize: 12,
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(15,23,42,0.12)",
            }}
          >
            {requestNote.status === "sent" ? <CheckCircle2 size={14} /> : <Send size={14} />}
            {requestNote.status === "sent"
              ? t("map.requestAdded", "Request added for {district}", { district: requestNote.districtName })
              : t("map.requestFailed", "Could not request {district}", { district: requestNote.districtName })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: "absolute", bottom: 8, right: 8,
          display: "flex", flexDirection: "column", gap: 4,
          background: "rgba(255,255,255,0.92)", border: "1px solid #E8E8E4",
          borderRadius: 8, padding: "5px 9px", fontSize: 10, color: "#6B6B6B",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 8, background: "rgba(37,99,235,0.18)", border: "1px solid #2563EB", borderRadius: 2 }} />
          {t("map.activeLegend", "Active")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 8, background: "#E8E8E4", border: "1px solid #CCCCCC", borderRadius: 2 }} />
          {t("map.requestLegend", "Request")}
        </div>
      </div>
    </div>
  );
}

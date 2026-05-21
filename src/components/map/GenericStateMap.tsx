/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { CheckCircle2, Lock, Send } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { INDIA_STATES } from "@/lib/constants/districts";
import { getLocalizedDistrictRequestLabel, parseDistrictRequestSubmission } from "@/lib/district-request";
import { districtGeoJsonPath, districtMapAction, districtRequestPayload } from "@/lib/map/district-map";

interface GenericStateMapProps {
  locale: string;
  stateSlug: string;
  stateName: string;
  activeDistricts: Set<string>;
}

function computeCenter(geojson: { features: Array<{ geometry: { coordinates: number[][][][] | number[][][] | number[][] } }> }): [number, number] {
  let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
  for (const f of geojson.features) {
    const coords = f.geometry.coordinates;
    const flatten = (c: unknown[]): void => {
      if (typeof c[0] === "number") {
        const [lng, lat] = c as number[];
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      } else {
        for (const sub of c) flatten(sub as unknown[]);
      }
    };
    flatten(coords as unknown[]);
  }
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

function computeScale(geojson: { features: Array<{ geometry: { coordinates: number[][][][] | number[][][] | number[][] } }> }): number {
  let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
  for (const f of geojson.features) {
    const coords = f.geometry.coordinates;
    const flatten = (c: unknown[]): void => {
      if (typeof c[0] === "number") {
        const [lng, lat] = c as number[];
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      } else {
        for (const sub of c) flatten(sub as unknown[]);
      }
    };
    flatten(coords as unknown[]);
  }
  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;
  const span = Math.max(lngSpan, latSpan);
  if (span < 1) return 8000;
  if (span < 3) return 4000;
  if (span < 5) return 3000;
  if (span < 8) return 2000;
  if (span < 12) return 1400;
  return 1000;
}

export default function GenericStateMap({ locale, stateSlug, stateName, activeDistricts }: GenericStateMapProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [tooltip, setTooltip] = useState<{ name: string; active: boolean; x: number; y: number } | null>(null);
  const [requestNote, setRequestNote] = useState<{ districtName: string; status: "sent" | "error" } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoData, setGeoData] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ignored = false;
    fetch(districtGeoJsonPath(stateSlug))
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        if (ignored) return;
        setGeoData(data);
        setFailed(false);
      })
      .catch(() => {
        if (ignored) return;
        setGeoData(null);
        setFailed(true);
      });
    return () => {
      ignored = true;
    };
  }, [stateSlug]);

  useEffect(() => {
    if (!requestNote) return;

    const timeout = window.setTimeout(() => setRequestNote(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [requestNote]);

  const center = useMemo(() => geoData ? computeCenter(geoData) : [78, 22] as [number, number], [geoData]);
  const scale = useMemo(() => geoData ? computeScale(geoData) : 2000, [geoData]);
  const stateData = useMemo(
    () => INDIA_STATES.find((state) => state.slug === stateSlug) ?? null,
    [stateSlug],
  );

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

  if (failed) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>
            {t("map.boundariesQueuedTitle", "District boundaries are queued")}
          </div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
            {t(
              "map.boundariesQueuedBody",
              "We have public sources identified; this state needs a normalized GeoJSON file.",
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#64748B" }}>
          {t("map.loading", "Loading map...")}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: center as [number, number], scale }}
        width={500}
        height={450}
        style={{ width: "100%", height: "auto", maxHeight: "100%", display: "block" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoData}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; properties: Record<string, string> }> }) =>
              geographies.map((geo) => {
                const slug = geo.properties?.slug ?? "";
                const name = geo.properties?.name ?? "";
                const districtLabel = getDistrictLabel(slug, name);
                const isActive = activeDistricts.has(slug);
                const action = districtMapAction(isActive);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (action === "explore") {
                        router.push(`/${locale}/${stateSlug}/${slug}`);
                      } else {
                        void requestDistrict(name, districtLabel);
                      }
                    }}
                    onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                      const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                      if (rect) setTooltip({ name: districtLabel, active: isActive, x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                    onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                      const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                      if (rect) setTooltip((t) => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: {
                        fill: isActive ? "rgba(37,99,235,0.18)" : "#E5E7EB",
                        stroke: isActive ? "#2563EB" : "#FFFFFF",
                        strokeWidth: isActive ? 1.5 : 0.5,
                        outline: "none",
                        cursor: "pointer",
                        transition: "fill 150ms",
                      },
                      hover: {
                        fill: isActive ? "#EFF6FF" : "#D4D4D0",
                        stroke: isActive ? "#1D4ED8" : "#9CA3AF",
                        strokeWidth: isActive ? 2 : 1,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { fill: isActive ? "rgba(37,99,235,0.45)" : "#D4D4D0", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          style={{
            position: "absolute", left: Math.min(tooltip.x + 10, 260), top: Math.max(tooltip.y - 36, 4),
            background: "#1A1A1A", color: "#FFFFFF", padding: "4px 10px", borderRadius: 6,
            fontSize: 12, fontWeight: 500, pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10,
            display: "flex", alignItems: "center", gap: 5,
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

      <div style={{ position: "absolute", bottom: 6, right: 6, display: "flex", flexDirection: "column", gap: 3, background: "rgba(255,255,255,0.92)", border: "1px solid #E8E8E4", borderRadius: 6, padding: "4px 8px", fontSize: 9, color: "#9B9B9B", pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 10, height: 6, background: "rgba(37,99,235,0.18)", border: "1px solid #2563EB", borderRadius: 1 }} />
          {t("map.activeLegend", "Active")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 10, height: 6, background: "#E5E7EB", border: "1px solid #CCC", borderRadius: 1 }} />
          {t("map.requestLegend", "Request")}
        </div>
      </div>
    </div>
  );
}

/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { Info } from "lucide-react";
import { formatRelativeFreshness } from "@/lib/data-freshness";

interface DataSourceBannerProps {
  moduleName: string;
  sources: string[];
  lastUpdated?: string | null;
  updateFrequency: string;
  isLive?: boolean;
}

export default function DataSourceBanner({ moduleName, sources, lastUpdated, updateFrequency, isLive }: DataSourceBannerProps) {
  const freshness = formatRelativeFreshness(lastUpdated);
  const hasLastUpdated = Boolean(lastUpdated);

  return (
    <div
      aria-label={`${moduleName} data sources and freshness`}
      style={{
        fontSize: 12,
        color: "#6B6B6B",
        lineHeight: 1.6,
        padding: "10px 14px",
        background: "#FAFAF8",
        border: "1px solid #E8E8E4",
        borderRadius: 8,
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <Info size={13} style={{ color: "#9B9B9B", flexShrink: 0, marginTop: 2 }} />
        <div>
          <span>
            Data sourced from{" "}
            <strong style={{ color: "#4B4B4B" }}>{sources.join(", ")}</strong>.
            {" "}Freshness:{" "}
            <strong style={{ color: hasLastUpdated ? "#374151" : "#92400E" }}>{freshness}</strong>.
            {" "}Update frequency: {updateFrequency}.
            {isLive && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 6, color: "#16A34A", fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
                LIVE
              </span>
            )}
          </span>
          <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 4 }}>
            ForThePeople.in is NOT an official government website. Data aggregated from publicly available government portals under India&apos;s Open Data Policy (NDSAP).
          </div>
        </div>
      </div>
    </div>
  );
}

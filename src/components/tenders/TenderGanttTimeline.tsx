"use client";

// Horizontal Gantt-style tender lifecycle timeline.
// Past events: filled. Current event: pulsing dot. Future: outlined.

import { useState } from "react";
import { timelineBounds } from "@/lib/tenders/ui";

export type TimelineEvent = {
  at: string;
  type: string;
  label: string;
  status: "past" | "current" | "future";
};

const COLORS: Record<string, string> = {
  PUBLISHED: "#2563EB",
  PRE_BID: "#7C3AED",
  CORRIGENDUM: "#B45309",
  CLOSING: "#DC2626",
  OPENING_TECH: "#0891B2",
  OPENING_FIN: "#0891B2",
  AWARD: "#16A34A",
  CONTRACT: "#15803D",
  COMPLETION: "#15803D",
};

export default function TenderGanttTimeline({ events }: { events: TimelineEvent[] }) {
  const [fallbackNowMs] = useState(() => Date.now());
  const { earliest, spanMs } = timelineBounds(events, fallbackNowMs);
  const currentCount = events.filter((event) => event.status === "current").length;
  const futureCount = events.filter((event) => event.status === "future").length;

  if (events.length === 0) {
    return (
      <div style={{ padding: 16, border: "1px dashed #D1D5DB", borderRadius: 10, color: "#6B7280", fontSize: 13 }}>
        No timeline events yet.
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #E8E8E4", borderRadius: 10, padding: 16, background: "#FFFFFF" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Timeline</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={metaPill}>{events.length} events</span>
          {currentCount > 0 && <span style={metaPill}>{currentCount} active</span>}
          {futureCount > 0 && <span style={metaPill}>{futureCount} upcoming</span>}
        </div>
      </div>
      <div style={{ position: "relative", height: 54, marginBottom: 20 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 22, height: 4, background: "#EEF2FF", borderRadius: 2 }} />
        {events.map((e, i) => {
          const pos = ((new Date(e.at).getTime() - earliest) / spanMs) * 100;
          const colour = COLORS[e.type] ?? "#6B7280";
          const isPast = e.status === "past" || e.status === "current";
          const isCurrent = e.status === "current";
          return (
            <div
              key={i}
              title={`${e.label} — ${new Date(e.at).toLocaleString("en-IN")}`}
              style={{
                position: "absolute",
                left: `calc(${pos}% - 7px)`,
                top: 16,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: isPast ? colour : "#FFFFFF",
                border: `2px solid ${colour}`,
                boxShadow: isCurrent ? `0 0 0 4px ${colour}30` : undefined,
                cursor: "help",
                animation: isCurrent ? "pulse 1.6s ease-in-out infinite" : undefined,
              }}
            />
          );
        })}
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {events.map((e, i) => (
          <li key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: "#374151" }}>
            <span style={{ width: 10, height: 10, marginTop: 4, borderRadius: "50%", background: COLORS[e.type] ?? "#6B7280", flexShrink: 0, opacity: e.status === "future" ? 0.4 : 1 }} />
            <span style={{ width: 140, flexShrink: 0, fontVariantNumeric: "tabular-nums", color: "#6B7280" }}>
              {new Date(e.at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <span style={{ fontWeight: e.status === "current" ? 700 : 500 }}>{e.label}</span>
          </li>
        ))}
      </ol>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

const metaPill: React.CSSProperties = {
  fontSize: 11,
  color: "#475569",
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 999,
  padding: "2px 8px",
  fontWeight: 600,
};

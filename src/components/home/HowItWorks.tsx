/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import { BarChart3, Database, Eye, RadioTower } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function HowItWorks() {
  const steps: Array<{
    icon: LucideIcon;
    title: string;
    desc: string;
    stat: string;
    tint: string;
    ink: string;
  }> = [
    {
      icon: RadioTower,
      title: "We Collect",
      desc: "Government portals, district feeds, weather, markets, and public records.",
      stat: "5-30 min",
      tint: "#ECFDF5",
      ink: "#047857",
    },
    {
      icon: Database,
      title: "We Organize",
      desc: "Cleaned into district modules with source labels, charts, and maps.",
      stat: "29 modules",
      tint: "#EFF6FF",
      ink: "#2563EB",
    },
    {
      icon: Eye,
      title: "You See",
      desc: "A public dashboard that shows what changed, what is missing, and where to verify.",
      stat: "Open data",
      tint: "#FFF7ED",
      ink: "#C2410C",
    },
  ];

  return (
    <section style={{ padding: "0 16px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#64748B",
              marginBottom: 4,
            }}
          >
            How It Works
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>
            From public records to district decisions
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#475569",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <BarChart3 size={14} strokeWidth={1.9} />
          Source-first dashboards
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              style={{
                position: "relative",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: 18,
                minHeight: 150,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: step.tint,
                    color: step.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </div>
                <span style={{ fontSize: 12, color: "#64748B", fontFamily: "var(--font-mono, monospace)" }}>
                  0{index + 1}
                </span>
              </div>

              <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6, maxWidth: 300 }}>
                {step.desc}
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "4px 8px",
                  background: step.tint,
                  color: step.ink,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {step.stat}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

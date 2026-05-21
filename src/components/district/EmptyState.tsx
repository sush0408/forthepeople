// ── ForThePeople.in — Graceful Empty State Component ───────
"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Briefcase,
  Bus,
  ChartColumn,
  CloudSun,
  Droplets,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Newspaper,
  Scale,
  Shield,
  Sprout,
  TriangleAlert,
  Users,
  Vote,
  Waves,
  Wheat,
  Wrench,
  Zap,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { getEmptyState } from "@/lib/empty-states";

interface EmptyStateProps {
  module: string;
  compact?: boolean;
}

const MODULE_VISUALS: Record<string, { icon: LucideIcon; accent: string; background: string }> = {
  weather: { icon: CloudSun, accent: "#2563EB", background: "#EFF6FF" },
  crops: { icon: Wheat, accent: "#65A30D", background: "#F7FEE7" },
  water: { icon: Waves, accent: "#0F766E", background: "#ECFEFF" },
  news: { icon: Newspaper, accent: "#6B7280", background: "#F3F4F6" },
  leadership: { icon: Users, accent: "#4338CA", background: "#EEF2FF" },
  finance: { icon: Landmark, accent: "#0F766E", background: "#ECFDF5" },
  budget: { icon: Landmark, accent: "#0F766E", background: "#ECFDF5" },
  schools: { icon: GraduationCap, accent: "#7C3AED", background: "#F5F3FF" },
  health: { icon: HeartPulse, accent: "#DC2626", background: "#FEF2F2" },
  elections: { icon: Vote, accent: "#B45309", background: "#FFF7ED" },
  police: { icon: Shield, accent: "#1D4ED8", background: "#EFF6FF" },
  transport: { icon: Bus, accent: "#EA580C", background: "#FFF7ED" },
  jjm: { icon: Droplets, accent: "#0891B2", background: "#ECFEFF" },
  housing: { icon: Home, accent: "#BE123C", background: "#FFF1F2" },
  power: { icon: Zap, accent: "#CA8A04", background: "#FEFCE8" },
  rti: { icon: FileText, accent: "#1D4ED8", background: "#EFF6FF" },
  courts: { icon: Scale, accent: "#7C2D12", background: "#FFF7ED" },
  "gram-panchayat": { icon: Home, accent: "#15803D", background: "#F0FDF4" },
  industries: { icon: Briefcase, accent: "#374151", background: "#F3F4F6" },
  farm: { icon: Sprout, accent: "#3F6212", background: "#F7FEE7" },
  population: { icon: ChartColumn, accent: "#4338CA", background: "#EEF2FF" },
  infrastructure: { icon: Wrench, accent: "#B45309", background: "#FFF7ED" },
  schemes: { icon: FileText, accent: "#7C3AED", background: "#F5F3FF" },
  alerts: { icon: TriangleAlert, accent: "#DC2626", background: "#FEF2F2" },
  default: { icon: BarChart3, accent: "#2563EB", background: "#EFF6FF" },
};

export default function EmptyState({ module, compact = false }: EmptyStateProps) {
  const { locale, t } = useI18n();
  const { title, message } = getEmptyState(module);
  const visual = MODULE_VISUALS[module] ?? MODULE_VISUALS.default;
  const Icon = visual.icon;
  const localizedTitle = locale === "en"
    ? title
    : t(`emptyState.titles.${module}`, title);
  const localizedMessage = locale === "en"
    ? message
    : t("emptyState.message", "Official district data for {module} is still being connected.", {
        module: localizedTitle,
      });
  const iconBadge = (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: compact ? 32 : 48,
        height: compact ? 32 : 48,
        borderRadius: compact ? 10 : 14,
        background: visual.background,
        color: visual.accent,
        flexShrink: 0,
      }}
    >
      <Icon size={compact ? 16 : 22} strokeWidth={2.1} />
    </span>
  );

  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0" }}>
        {iconBadge}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#4B4B4B", lineHeight: 1.35 }}>{localizedTitle}</div>
          <div style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.45, marginTop: 3 }}>{localizedMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E4",
        borderRadius: 16,
        padding: "24px 20px",
        textAlign: "center",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{iconBadge}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>{localizedTitle}</div>
      <div style={{ fontSize: 13, color: "#5B5B5B", lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
        {localizedMessage}
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: "#8B8B85" }}>
        {t("emptyState.availableSoon", "This module appears here once official district data is available.")}
      </div>
    </div>
  );
}

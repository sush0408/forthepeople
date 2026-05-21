/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

// ═══════════════════════════════════════════════════════════
// ForThePeople.in — District Overview Command Center
// ═══════════════════════════════════════════════════════════
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { EChartsOption } from "echarts";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Database,
  Droplets,
  FileText,
  HardHat,
  Home,
  MapPin,
  Newspaper,
  Percent,
  PiggyBank,
  Scale,
  ScrollText,
  Search,
  Shield,
  TreePine,
  TrendingUp,
  Users,
  Wheat,
} from "lucide-react";
import {
  useOverview,
  useCropPrices,
  useWater,
  useAlerts,
  useInfrastructure,
  useBudget,
  usePolice,
  useNews,
} from "@/hooks/useRealtimeData";
import { SIDEBAR_MODULES } from "@/lib/constants/sidebar-modules";
import { StatCard, SectionLabel, LoadingShell, LiveBadge, SeverityBadge } from "@/components/district/ui";
import EmptyState from "@/components/district/EmptyState";
import AIInsightCard from "@/components/common/AIInsightCard";
import { DistrictHealthScoreCard } from "@/components/district/DistrictHealthScoreCard";
import DistrictSponsorBanner from "@/components/common/DistrictSponsorBanner";
import { getStateConfig } from "@/lib/constants/state-config";
import DistrictHeroIllustration from "@/components/district/DistrictHeroIllustration";
import InfraSnippet from "@/components/district/InfraSnippet";
import LeadersSnippet from "@/components/district/LeadersSnippet";
import PopulationSnippet from "@/components/district/PopulationSnippet";
import TenderSnippet from "@/components/district/TenderSnippet";
import LiveElectionBanner from "@/components/district/LiveElectionBanner";
import { useI18n } from "@/i18n/I18nProvider";
import type { CropPrice, InfraProject, NewsItem } from "@/hooks/useRealtimeData";
import type { DistrictBadge } from "@/lib/constants/districts";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

interface Props {
  locale: string;
  stateSlug: string;
  districtSlug: string;
  stateName: string;
  districtData: {
    name: string;
    nameLocal?: string;
    tagline?: string;
    population?: number | null;
    area?: number | null;
    talukCount?: number;
    villageCount?: number | null;
    literacy?: number | null;
    sexRatio?: number | null;
    active: boolean;
    badges?: DistrictBadge[];
    taluks: Array<{ slug: string; name: string; nameLocal?: string; tagline?: string }>;
  };
}

type Tone = "blue" | "green" | "amber" | "red" | "purple" | "slate";

const TONE_STYLES: Record<Tone, { color: string; bg: string; soft: string; border: string }> = {
  blue: { color: "#2563EB", bg: "#EFF6FF", soft: "#DBEAFE", border: "#BFDBFE" },
  green: { color: "#16A34A", bg: "#F0FDF4", soft: "#DCFCE7", border: "#BBF7D0" },
  amber: { color: "#D97706", bg: "#FFFBEB", soft: "#FEF3C7", border: "#FDE68A" },
  red: { color: "#DC2626", bg: "#FEF2F2", soft: "#FEE2E2", border: "#FECACA" },
  purple: { color: "#7C3AED", bg: "#F5F3FF", soft: "#EDE9FE", border: "#DDD6FE" },
  slate: { color: "#475569", bg: "#F8FAFC", soft: "#E2E8F0", border: "#CBD5E1" },
};

const LIVE_MODULES = new Set(["crops", "weather", "water", "news", "alerts", "power"]);
const MODULE_MAP = Object.fromEntries(SIDEBAR_MODULES.map((m) => [m.slug, m]));

const MODULE_PATHWAYS: Array<{
  label: string;
  intent: string;
  slugs: string[];
  icon: LucideIcon;
  tone: Tone;
}> = [
  {
    label: "Daily life",
    intent: "Weather, water, power, health, schools and transport.",
    slugs: ["weather", "water", "jjm", "power", "transport", "health", "schools", "housing"],
    icon: Home,
    tone: "blue",
  },
  {
    label: "Money & projects",
    intent: "Budgets, infrastructure, tenders and local industry.",
    slugs: ["finance", "infrastructure", "tenders", "industries"],
    icon: PiggyBank,
    tone: "green",
  },
  {
    label: "Accountability",
    intent: "Officials, police, courts, RTI and local governance.",
    slugs: ["leadership", "police", "courts", "rti", "file-rti", "gram-panchayat", "update-log"],
    icon: Scale,
    tone: "amber",
  },
  {
    label: "Welfare & opportunities",
    intent: "Schemes, services, exams, jobs and citizen actions.",
    slugs: ["schemes", "services", "exams", "citizen-corner", "responsibility", "contributors"],
    icon: ScrollText,
    tone: "purple",
  },
  {
    label: "Local pulse",
    intent: "Alerts, news, offices, maps, people and source transparency.",
    slugs: ["alerts", "news", "offices", "map", "famous-personalities", "data-sources"],
    icon: Newspaper,
    tone: "red",
  },
  {
    label: "Agriculture",
    intent: "Mandi prices, soil advice, irrigation and rural economy.",
    slugs: ["crops", "farm", "water", "jjm", "gram-panchayat", "industries"],
    icon: Wheat,
    tone: "green",
  },
];

const CHART_TEXT = "#475569";
const CHART_GRID = "#E8E8E4";

function formatINR(value?: number | null) {
  if (!value) return "—";
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(0)} Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function pctColor(value: number) {
  if (value >= 75) return "#16A34A";
  if (value >= 45) return "#D97706";
  return "#DC2626";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function truncate(text: string, max = 92) {
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function normalizeStatus(status?: string | null) {
  return (status ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function isActiveProject(project: InfraProject) {
  const status = normalizeStatus(project.status);
  return ["ongoing", "active", "under_construction", "in_progress"].includes(status) || status.includes("construction");
}

function isDelayedProject(project: InfraProject) {
  const status = normalizeStatus(project.status);
  return status === "delayed" || status.includes("delay") || (project.delayMonths ?? 0) > 0;
}

function createGaugeOption(value: number, color: string, label: string): EChartsOption {
  return {
    animationDuration: 350,
    series: [
      {
        type: "gauge",
        min: 0,
        max: 100,
        radius: "94%",
        center: ["50%", "56%"],
        startAngle: 210,
        endAngle: -30,
        progress: {
          show: true,
          width: 13,
          roundCap: true,
          itemStyle: { color },
        },
        axisLine: {
          roundCap: true,
          lineStyle: { width: 13, color: [[1, "#EEF2F7"]] },
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
          color,
          fontFamily: "var(--font-mono)",
          fontSize: 26,
          fontWeight: 800,
          offsetCenter: [0, "6%"],
        },
        title: {
          show: true,
          offsetCenter: [0, "42%"],
          color: CHART_TEXT,
          fontSize: 11,
          fontWeight: 600,
        },
        data: [{ value: Math.round(value), name: label }],
      },
    ],
  };
}

function createBudgetOption(allocated: number, spent: number): EChartsOption {
  return {
    animationDuration: 700,
    grid: { left: 6, right: 58, top: 18, bottom: 18, containLabel: true },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "value",
      axisLabel: { color: CHART_TEXT, formatter: (v: number) => `₹${Math.round(v / 10_000_000)}Cr` },
      splitLine: { lineStyle: { color: CHART_GRID } },
    },
    yAxis: {
      type: "category",
      data: ["Allocated", "Spent"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: CHART_TEXT, fontWeight: 600 },
    },
    series: [
      {
        type: "bar",
        data: [
          { value: allocated, itemStyle: { color: "#CBD5E1", borderRadius: [0, 6, 6, 0] } },
          { value: spent, itemStyle: { color: "#16A34A", borderRadius: [0, 6, 6, 0] } },
        ],
        barWidth: 18,
        label: {
          show: true,
          position: "right",
          color: "#0F172A",
          formatter: (params) => formatINR(Number(params.value ?? 0)),
          fontWeight: 700,
        },
      },
    ],
  };
}

function createCropOption(crops: CropPrice[]): EChartsOption {
  const rows = crops.slice(0, 6).map((c) => ({
    name: c.commodity,
    value: Math.round(c.modalPrice / 100),
  }));

  return {
    animationDuration: 700,
    grid: { left: 4, right: 48, top: 12, bottom: 10, containLabel: true },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "value",
      axisLabel: { color: CHART_TEXT, formatter: (v: number) => `₹${v}` },
      splitLine: { lineStyle: { color: CHART_GRID } },
    },
    yAxis: {
      type: "category",
      data: rows.map((r) => r.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: CHART_TEXT },
    },
    series: [
      {
        type: "bar",
        data: rows.map((r) => r.value),
        barWidth: 14,
        itemStyle: { color: "#16A34A", borderRadius: [0, 6, 6, 0] },
        label: {
          show: true,
          position: "right",
          color: "#166534",
          fontWeight: 700,
          formatter: "₹{c}/kg",
        },
      },
    ],
  };
}

function createInfraOption(projects: InfraProject[]): EChartsOption {
  const rows = projects
    .slice(0, 5)
    .map((p) => ({
      name: p.shortName ?? p.name,
      value: Math.round(p.progressPct ?? 0),
    }))
    .reverse();

  return {
    animationDuration: 700,
    grid: { left: 4, right: 42, top: 12, bottom: 10, containLabel: true },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "value",
      max: 100,
      axisLabel: { color: CHART_TEXT, formatter: "{value}%" },
      splitLine: { lineStyle: { color: CHART_GRID } },
    },
    yAxis: {
      type: "category",
      data: rows.map((r) => truncate(r.name, 24)),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: CHART_TEXT },
    },
    series: [
      {
        type: "bar",
        data: rows.map((r) => ({
          value: r.value,
          itemStyle: { color: pctColor(r.value), borderRadius: [0, 6, 6, 0] },
        })),
        barWidth: 12,
        label: { show: true, position: "right", formatter: "{c}%", color: "#0F172A", fontWeight: 700 },
      },
    ],
  };
}

function createModuleTreeOption(t: (path: string, fallback?: string) => string): EChartsOption {
  return {
    animationDuration: 500,
    tooltip: { trigger: "item", triggerOn: "mousemove" },
    series: [
      {
        type: "tree",
        data: [
          {
            name: t("overview.districtData", "District data"),
            itemStyle: { color: "#2563EB" },
            label: { color: "#0F172A", fontWeight: 800 },
            children: MODULE_PATHWAYS.map((group) => ({
              name: t(`overview.pathways.${group.label}.label`, group.label),
              itemStyle: { color: TONE_STYLES[group.tone].color },
              label: { color: "#1E293B", fontWeight: 700 },
              children: group.slugs.slice(0, 4).map((slug) => ({
                name: t(`modules.${slug}`, MODULE_MAP[slug]?.label ?? slug),
                itemStyle: { color: "#94A3B8" },
                label: { color: "#64748B" },
              })),
            })),
          },
        ],
        top: "4%",
        bottom: "4%",
        left: "4%",
        right: "18%",
        symbolSize: 9,
        orient: "LR",
        roam: false,
        expandAndCollapse: false,
        initialTreeDepth: 2,
        lineStyle: { color: "#CBD5E1", width: 1.2, curveness: 0.35 },
        label: { position: "right", verticalAlign: "middle", align: "left", fontSize: 11 },
        leaves: { label: { position: "right", verticalAlign: "middle", align: "left", fontSize: 10 } },
      },
    ],
  };
}

function ChartCard({
  title,
  eyebrow,
  href,
  height = 210,
  option,
  empty,
}: {
  title: string;
  eyebrow: string;
  href?: string;
  height?: number;
  option?: EChartsOption;
  empty?: ReactNode;
}) {
  const content = (
    <article className="overview-chart-card">
      <div className="overview-card-head">
        <div>
          <div className="overview-eyebrow">{eyebrow}</div>
          <h3>{title}</h3>
        </div>
        {href && <ArrowUpRight size={16} />}
      </div>
      {option ? (
        <ReactECharts
          option={option}
          notMerge
          lazyUpdate
          opts={{ renderer: "svg" }}
          style={{ width: "100%", height }}
        />
      ) : (
        <div style={{ minHeight: height, display: "grid", placeItems: "center" }}>
          {empty ?? <span style={{ fontSize: 13, color: "#94A3B8" }}>No data yet</span>}
        </div>
      )}
    </article>
  );

  if (!href) return content;
  return <Link href={href} className="overview-card-link">{content}</Link>;
}

function PriorityCard({
  icon: Icon,
  tone,
  eyebrow,
  title,
  value,
  detail,
  href,
  live,
}: {
  icon: LucideIcon;
  tone: Tone;
  eyebrow: string;
  title: string;
  value: string;
  detail: string;
  href: string;
  live?: boolean;
}) {
  const style = TONE_STYLES[tone];
  return (
    <Link href={href} className="overview-priority-link">
      <article className="overview-priority-card" style={{ borderColor: style.border }}>
        <div className="overview-priority-icon" style={{ color: style.color, background: style.bg }}>
          <Icon size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="overview-card-meta">
            <span>{eyebrow}</span>
            {live && <LiveBadge />}
          </div>
          <h3>{title}</h3>
          <div className="overview-priority-value" style={{ color: style.color }}>
            {value}
          </div>
          <p>{detail}</p>
        </div>
      </article>
    </Link>
  );
}

function ModuleChip({ slug, base }: { slug: string; base: string }) {
  const mod = MODULE_MAP[slug];
  const { t } = useI18n();
  if (!mod) return null;
  const Icon = mod.icon;
  const href = slug === "overview" ? base : `${base}/${slug}`;
  return (
    <Link href={href} className="overview-module-chip">
      <Icon size={15} />
      <span>{t(`modules.${slug}`, mod.label)}</span>
      {LIVE_MODULES.has(slug) && <span className="overview-live-dot" aria-label="Live module" />}
    </Link>
  );
}

function PathwayCard({
  group,
  base,
}: {
  group: (typeof MODULE_PATHWAYS)[number];
  base: string;
}) {
  const { t } = useI18n();
  const Icon = group.icon;
  const tone = TONE_STYLES[group.tone];
  return (
    <details className="overview-pathway-card" open={group.label === "Daily life" || group.label === "Money & projects"}>
      <summary>
        <span className="overview-pathway-icon" style={{ background: tone.bg, color: tone.color }}>
          <Icon size={18} />
        </span>
        <span>
          <strong>{t(`overview.pathways.${group.label}.label`, group.label)}</strong>
          <small>{t(`overview.pathways.${group.label}.intent`, group.intent)}</small>
        </span>
        <ChevronRight size={16} className="overview-pathway-chevron" />
      </summary>
      <div className="overview-module-chip-grid">
        {group.slugs.map((slug) => <ModuleChip key={`${group.label}-${slug}`} slug={slug} base={base} />)}
      </div>
    </details>
  );
}

function NewsList({ items, base }: { items: NewsItem[]; base: string }) {
  if (!items.length) return <EmptyState module="news" compact />;
  return (
    <div className="overview-news-list">
      {items.slice(0, 4).map((item) => (
        <a
          key={item.id}
          href={item.url ?? `${base}/news`}
          target={item.url ? "_blank" : undefined}
          rel={item.url ? "noopener noreferrer" : undefined}
          className="overview-news-item"
        >
          <span>{truncate(item.headline, 90)}</span>
          <small>{item.source} · {timeAgo(item.publishedAt)}</small>
        </a>
      ))}
    </div>
  );
}

export default function OverviewClient({ locale, stateSlug, districtSlug, stateName, districtData }: Props) {
  const base = `/${locale}/${stateSlug}/${districtSlug}`;
  const stateConfig = getStateConfig(stateSlug);
  const { t } = useI18n();
  const { data: overview } = useOverview(districtSlug, stateSlug);
  const { data: crops, isLoading: cropsLoading } = useCropPrices(districtSlug, stateSlug);
  const { data: water, isLoading: waterLoading } = useWater(districtSlug, stateSlug);
  const { data: alerts } = useAlerts(districtSlug, stateSlug);
  const { data: infraData, isLoading: infraLoading } = useInfrastructure(districtSlug, stateSlug);
  const { data: budgetData, isLoading: budgetLoading } = useBudget(districtSlug, stateSlug);
  const { data: policeData, isLoading: policeLoading } = usePolice(districtSlug, stateSlug);
  const { data: newsData, isLoading: newsLoading } = useNews(districtSlug, stateSlug);

  const dbTalukCount = overview?.data?.taluks?.length;
  const displayedTalukCount = dbTalukCount ?? districtData.talukCount;
  const latestDam = water?.data?.dams?.[0];
  const latestCrops = crops?.data?.slice(0, 6) ?? [];
  const activeAlerts = alerts?.data ?? [];
  const newsItems = newsData?.data ?? [];
  const infraProjects = infraData?.data ?? [];
  const ongoingProjects = infraProjects.filter(isActiveProject);
  const delayedProjects = infraProjects.filter(isDelayedProject);
  const avgInfraProgress = ongoingProjects.length
    ? ongoingProjects.reduce((sum, p) => sum + (p.progressPct ?? 0), 0) / ongoingProjects.length
    : 0;

  const allBudgetEntries = budgetData?.data?.entries ?? [];
  const latestFY = allBudgetEntries.length > 0 ? allBudgetEntries[0].fiscalYear : null;
  const budgetEntries = latestFY ? allBudgetEntries.filter((e) => e.fiscalYear === latestFY) : [];
  const totalAllocated = budgetEntries.reduce((sum, e) => sum + e.allocated, 0);
  const totalSpent = budgetEntries.reduce((sum, e) => sum + e.spent, 0);
  const spentPct = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const policeStations = policeData?.data?.stations ?? [];
  const trafficRows = policeData?.data?.traffic ?? [];
  const trafficRevenue = trafficRows.reduce((sum, row) => sum + row.amount, 0);

  const alertTone: Tone = activeAlerts.some((a) => a.severity === "critical")
    ? "red"
    : activeAlerts.length > 0
      ? "amber"
      : "green";
  const damTone: Tone = latestDam && latestDam.storagePct >= 70 ? "green" : latestDam && latestDam.storagePct >= 35 ? "amber" : "red";
  const budgetTone: Tone = spentPct >= 75 ? "green" : spentPct >= 45 ? "amber" : "red";

  const topCrop = [...latestCrops].sort((a, b) => b.modalPrice - a.modalPrice)[0];

  return (
    <div className="overview-revamp">
      <DistrictHeroIllustration
        stateSlug={stateSlug}
        districtSlug={districtSlug}
        districtName={districtData.name}
        stateName={stateName}
        districtNameLocal={districtData.nameLocal}
        tagline={districtData.tagline}
        badges={districtData.badges}
        active={districtData.active}
        stats={{
          population: districtData.population ? `${(districtData.population / 1000000).toFixed(2)}M` : undefined,
          area: districtData.area ? districtData.area.toLocaleString("en-IN") : undefined,
          literacy: districtData.literacy ? `${districtData.literacy}%` : undefined,
          subDistrictCount: displayedTalukCount,
          subDistrictLabel: t("district.taluks", stateConfig?.subDistrictUnitPlural ?? "Taluks"),
        }}
      />

      <main className="overview-page-pad">
        <section className="overview-command-hero" aria-labelledby="overview-command-title">
          <div>
            <div className="overview-eyebrow">{t("overview.commandEyebrow", "District command center")}</div>
            <h2 id="overview-command-title">{t("overview.attentionTitle", `What needs attention in ${districtData.name}?`, { district: districtData.name })}</h2>
            <p>
              {t("overview.attentionBody", "Urgent alerts, water storage, spending and project movement appear before directories and archives.")}
            </p>
          </div>
          <Link href={`${base}/data-sources`} className="overview-source-link">
            <Database size={16} />
            {t("overview.dataSources", "Data sources")}
          </Link>
        </section>

        <section className="overview-priority-grid" aria-label={t("overview.prioritySignals", "Priority district signals")}>
          <PriorityCard
            icon={AlertTriangle}
            tone={alertTone}
            eyebrow={t("overview.publicAlerts", "Public alerts")}
            title={activeAlerts.length > 0 ? truncate(activeAlerts[0].title, 56) : t("overview.noActiveAlerts", "No active alerts")}
            value={activeAlerts.length > 0 ? `${activeAlerts.length}` : "0"}
            detail={activeAlerts.length > 0 ? "active advisories need review" : t("overview.advisoriesQuiet", "district advisories look quiet")}
            href={`${base}/alerts`}
            live
          />
          <PriorityCard
            icon={Droplets}
            tone={damTone}
            eyebrow={t("overview.waterStorage", "Water storage")}
            title={latestDam?.damName ?? t("overview.damReadings", "Dam readings")}
            value={latestDam ? `${latestDam.storagePct.toFixed(1)}%` : "—"}
            detail={latestDam ? `${latestDam.waterLevel.toFixed(1)} / ${latestDam.maxLevel.toFixed(1)} ft` : t("overview.waitingLiveFeed", "waiting for live feed")}
            href={`${base}/water`}
            live
          />
          <PriorityCard
            icon={PiggyBank}
            tone={budgetTone}
            eyebrow={t("overview.budgetUse", "Budget use")}
            title={latestFY ? `Fiscal year ${latestFY}` : t("overview.financeTracker", "Finance tracker")}
            value={totalAllocated > 0 ? `${spentPct.toFixed(1)}%` : "—"}
            detail={totalAllocated > 0 ? `${formatINR(totalSpent)} spent of ${formatINR(totalAllocated)}` : t("overview.noBudgetRecords", "no budget records yet")}
            href={`${base}/finance`}
          />
          <PriorityCard
            icon={HardHat}
            tone={delayedProjects.length > 0 ? "amber" : "green"}
            eyebrow={t("overview.projects", "Projects")}
            title={t("overview.infrastructureMovement", "Infrastructure movement")}
            value={`${ongoingProjects.length}`}
            detail={delayedProjects.length > 0 ? `${delayedProjects.length} delayed or at risk` : t("overview.averageProgress", `${Math.round(avgInfraProgress)}% average progress`, { value: Math.round(avgInfraProgress) })}
            href={`${base}/infrastructure`}
          />
        </section>

        <LiveElectionBanner stateSlug={stateSlug} leadershipHref={`${base}/leadership`} />

        {activeAlerts.length > 0 && (
          <section className="overview-alert-strip" aria-label="Active alerts">
            {activeAlerts.slice(0, 2).map((alert) => (
              <Link key={alert.id} href={`${base}/alerts`} className="overview-alert-card">
                <AlertTriangle size={16} />
                <span>
                  <strong>{alert.title}</strong>
                  <small>{truncate(alert.description, 110)}</small>
                </span>
                <SeverityBadge severity={alert.severity} />
              </Link>
            ))}
          </section>
        )}

        <section className="overview-chart-grid" aria-label="District data charts">
          <ChartCard
            eyebrow={t("overview.water", "Water")}
            title={latestDam?.damName ?? t("overview.damStorage", "Dam storage")}
            href={`${base}/water`}
            height={190}
            option={latestDam ? createGaugeOption(latestDam.storagePct, pctColor(latestDam.storagePct), "storage") : undefined}
            empty={waterLoading ? <LoadingShell rows={2} /> : <EmptyState module="water" compact />}
          />
          <ChartCard
            eyebrow={t("overview.finance", "Finance")}
            title={t("overview.allocatedVsSpent", "Allocated vs spent")}
            href={`${base}/finance`}
            height={190}
            option={totalAllocated > 0 ? createBudgetOption(totalAllocated, totalSpent) : undefined}
            empty={budgetLoading ? <LoadingShell rows={2} /> : <EmptyState module="budget" compact />}
          />
          <ChartCard
            eyebrow={t("overview.mandi", "Mandi")}
            title={topCrop ? `Highest: ${topCrop.commodity}` : t("overview.cropPrices", "Crop prices")}
            href={`${base}/crops`}
            height={210}
            option={latestCrops.length > 0 ? createCropOption(latestCrops) : undefined}
            empty={cropsLoading ? <LoadingShell rows={2} /> : <EmptyState module="crops" compact />}
          />
          <ChartCard
            eyebrow={t("overview.projects", "Projects")}
            title={t("overview.activeWorksProgress", "Progress of active works")}
            href={`${base}/infrastructure`}
            height={210}
            option={ongoingProjects.length > 0 ? createInfraOption(ongoingProjects) : undefined}
            empty={infraLoading ? <LoadingShell rows={2} /> : <EmptyState module="infrastructure" compact />}
          />
        </section>

        <AIInsightCard module="overview" district={districtSlug} />
        <DistrictHealthScoreCard districtSlug={districtSlug} />

        <section className="overview-stats-section" aria-label="District snapshot">
          <SectionLabel>{t("overview.districtSnapshot", "District snapshot")}</SectionLabel>
          <div className="overview-stats-grid">
            <StatCard label={t("district.population", "Population")} value={districtData.population?.toLocaleString("en-IN") ?? "—"} icon={Users} />
            <StatCard label={`${t("district.area", "Area")} (km²)`} value={districtData.area?.toLocaleString("en-IN") ?? "—"} icon={TreePine} />
            <StatCard label={t("district.taluks", stateConfig?.subDistrictUnitPlural ?? "Taluks")} value={displayedTalukCount ?? "—"} icon={MapPin} />
            {(stateConfig?.showVillages !== false) && (
              <StatCard label={t("district.villages", "Villages")} value={districtData.villageCount?.toLocaleString("en-IN") ?? "—"} icon={Building2} />
            )}
            <StatCard label={t("district.literacy", "Literacy")} value={districtData.literacy ? `${districtData.literacy}%` : "—"} icon={Percent} accent="#16A34A" />
            <StatCard label={t("modules.schemes", "Schemes")} value={overview?.data?._count?.schemes?.toString() ?? "—"} icon={FileText} />
          </div>
        </section>

        <section className="overview-pathway-layout" aria-labelledby="overview-find-title">
          <div className="overview-pathway-copy">
            <div className="overview-eyebrow">{t("overview.findEyebrow", "Find information faster")}</div>
            <h2 id="overview-find-title">{t("overview.findTitle", "Start with a citizen question, not a department name.")}</h2>
            <p>
              {t("overview.findBody", "Choose the question closest to what you need, then jump into the relevant dashboard.")}
            </p>
            <div className="overview-search-cue">
              <Search size={16} />
              {t("overview.searchCue", "Use the top search for district or module names.")}
            </div>
          </div>
          <ChartCard
            eyebrow={t("overview.moduleMap", "Module map")}
            title={t("overview.groupedData", "How the data is grouped")}
            height={340}
            option={createModuleTreeOption(t)}
          />
        </section>

        <section className="overview-pathway-list" aria-label="Information pathways">
          {MODULE_PATHWAYS.map((group) => (
            <PathwayCard key={group.label} group={group} base={base} />
          ))}
        </section>

        <section className="overview-workbench-grid" aria-label="District workbench">
          <PopulationSnippet district={districtSlug} state={stateSlug} base={base} />
          <LeadersSnippet district={districtSlug} state={stateSlug} base={base} />
          <InfraSnippet district={districtSlug} state={stateSlug} base={base} />
          <TenderSnippet locale={locale} district={districtSlug} state={stateSlug} base={base} />
        </section>

        <section className="overview-two-col" aria-label="Accountability and updates">
          <article className="overview-summary-card">
            <div className="overview-card-head">
              <div>
                <div className="overview-eyebrow">{t("overview.publicSafety", "Public safety")}</div>
                <h3>{t("overview.policeTraffic", "Police & traffic")}</h3>
              </div>
              <Link href={`${base}/police`}>{t("overview.stationDirectory", "Station directory")}</Link>
            </div>
            {policeLoading ? (
              <LoadingShell rows={2} />
            ) : (
              <div className="overview-metric-row">
                <div><Shield size={17} /><strong>{policeStations.length}</strong><span>{t("overview.stations", "stations")}</span></div>
                <div><TrendingUp size={17} /><strong>{formatINR(trafficRevenue)}</strong><span>{t("overview.trafficRevenue", "traffic revenue")}</span></div>
              </div>
            )}
          </article>

          <article className="overview-summary-card">
            <div className="overview-card-head">
              <div>
                <div className="overview-eyebrow">{t("overview.localNews", "Local news")}</div>
                <h3>{t("overview.latestUpdates", "Latest verified updates")}</h3>
              </div>
              <Link href={`${base}/news`}>{t("overview.allNews", "All news")}</Link>
            </div>
            {newsLoading ? <LoadingShell rows={3} /> : <NewsList items={newsItems} base={base} />}
          </article>
        </section>

        {districtData.taluks.length > 0 && (
          <section className="overview-taluks" aria-label={`${stateConfig?.subDistrictUnitPlural ?? "Taluks"} in ${districtData.name}`}>
            <SectionLabel>{stateConfig?.subDistrictUnitPlural ?? "Taluks"} in {districtData.name}</SectionLabel>
            <div className="overview-taluk-grid">
              {districtData.taluks.map((taluk) => (
                <Link key={taluk.slug} href={`${base}/${taluk.slug}`} className="overview-taluk-card">
                  <strong>{taluk.name}</strong>
                  {taluk.nameLocal && <span>{taluk.nameLocal}</span>}
                  {taluk.tagline && <small>{taluk.tagline}</small>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="overview-sponsor-section">
          <DistrictSponsorBanner
            district={districtSlug}
            state={stateSlug}
            districtName={districtData.name}
            stateName={stateName}
            locale={locale}
          />
        </section>
      </main>
    </div>
  );
}

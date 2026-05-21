import type { StateConfig } from "./constants/state-config";

type NoDataTranslator = (
  path: string,
  fallback?: string,
  vars?: Record<string, string | number>,
) => string;

export interface NoDataContent {
  title: string;
  body: string;
  note: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
}

interface BuildNoDataContentOptions {
  module: string;
  district: string;
  stateConfig: StateConfig | null;
  isUrban: boolean;
  customMessage?: string;
  translate?: NoDataTranslator;
}

function normalizeModuleKey(module: string): string {
  return module.trim().toLocaleLowerCase();
}

export function formatDistrictLabel(value: string): string {
  return value
    .trim()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toLocaleUpperCase());
}

function buildLocalizedModuleTitle(
  module: string,
  translate?: NoDataTranslator,
): string {
  const normalizedModule = normalizeModuleKey(module);
  return translate?.(`emptyState.titles.${normalizedModule}`, normalizedModule) ?? normalizedModule;
}

export function buildNoDataContent({
  module,
  district,
  stateConfig,
  isUrban,
  customMessage,
  translate,
}: BuildNoDataContentOptions): NoDataContent {
  if (customMessage) {
    return {
      title: translate?.("noDataCard.title", "Data being prepared") ?? "Data being prepared",
      body: customMessage,
      note: translate?.(
        "noDataCard.note",
        "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
      ) ?? "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
      sourceLabel: null,
      sourceUrl: null,
    };
  }

  const normalizedModule = normalizeModuleKey(module);
  const districtName = formatDistrictLabel(district);
  const moduleTitle = buildLocalizedModuleTitle(normalizedModule, translate);
  const discomName = stateConfig?.discomFullName ?? "the local electricity provider";
  const transportName = stateConfig?.stateTransportFullName ?? "the state transport corporation";

  switch (normalizedModule) {
    case "alerts":
      return {
        title: translate?.("noDataCard.alerts.title", "Alert feed not live yet") ?? "Alert feed not live yet",
        body: translate?.(
          "noDataCard.alerts.body",
          "We have not connected a verified alert feed for {district} yet. This card stays quiet until an official district source is available.",
          { district: districtName },
        ) ?? `We have not connected a verified alert feed for ${districtName} yet. This card stays quiet until an official district source is available.`,
        note: translate?.(
          "noDataCard.note",
          "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
        ) ?? "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
        sourceLabel: null,
        sourceUrl: null,
      };
    case "power":
      return {
        title: translate?.("noDataCard.power.title", "Power outage feed being connected")
          ?? "Power outage feed being connected",
        body: translate?.(
          "noDataCard.power.body",
          "{module} for {district} is still being connected from {source}. Use the official portal in the meantime.",
          { module: moduleTitle, district: districtName, source: discomName },
        ) ?? `${moduleTitle} for ${districtName} is still being connected from ${discomName}. Use the official portal in the meantime.`,
        note: translate?.(
          "noDataCard.note",
          "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
        ) ?? "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
        sourceLabel: translate?.("noDataCard.power.portalLabel", "Open official outage portal") ?? "Open official outage portal",
        sourceUrl: stateConfig?.discomPortalUrl ?? null,
      };
    case "crops":
    case "farm":
    case "gram-panchayat":
    case "jjm": {
      if (isUrban) {
        return {
          title: translate?.("noDataCard.urban.title", "Not applicable for this urban district")
            ?? "Not applicable for this urban district",
          body: translate?.(
            "noDataCard.urban.body",
            "{module} is primarily a rural-data surface, so {district} does not show a district feed here.",
            { module: moduleTitle, district: districtName },
          ) ?? `${moduleTitle} is primarily a rural-data surface, so ${districtName} does not show a district feed here.`,
          note: translate?.(
            "noDataCard.note",
            "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
          ) ?? "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
          sourceLabel: null,
          sourceUrl: null,
        };
      }
      break;
    }
    case "transport":
      return {
        title: translate?.("noDataCard.transport.title", "Transport data being connected")
          ?? "Transport data being connected",
        body: translate?.(
          "noDataCard.transport.body",
          "{module} for {district} is still being connected from {source} and public rail sources.",
          { module: moduleTitle, district: districtName, source: transportName },
        ) ?? `${moduleTitle} for ${districtName} is still being connected from ${transportName} and public rail sources.`,
        note: translate?.(
          "noDataCard.note",
          "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
        ) ?? "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
        sourceLabel: null,
        sourceUrl: null,
      };
  }

  return {
    title: translate?.("noDataCard.title", "Data being prepared") ?? "Data being prepared",
    body: translate?.(
      "noDataCard.body",
      "{module} data for {district} is still being added from official district and state sources.",
      { module: moduleTitle, district: districtName },
    ) ?? `${moduleTitle} data for ${districtName} is still being added from official district and state sources.`,
    note: translate?.(
      "noDataCard.note",
      "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
    ) ?? "ForThePeople.in republishes public-source government data and shows this module once verified district data is available.",
    sourceLabel: null,
    sourceUrl: null,
  };
}

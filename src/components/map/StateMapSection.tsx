/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/i18n/I18nProvider";

const KarnatakaMap = dynamic(() => import("@/components/map/KarnatakaMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const GenericStateMap = dynamic(() => import("@/components/map/GenericStateMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  const { t } = useI18n();

  return (
    <div
      style={{
        height: 320,
        background: "#F5F7FF",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: "#9B9B9B", fontSize: 13 }}>
        {t("map.loading", "Loading map...")}
      </span>
    </div>
  );
}

interface StateMapSectionProps {
  locale: string;
  stateSlug: string;
  stateName: string;
  activeDistrictSlugs: string[];
}

export default function StateMapSection({ locale, stateSlug, stateName, activeDistrictSlugs }: StateMapSectionProps) {
  const { t } = useI18n();

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 14, overflow: "hidden", height: "100%", maxHeight: 400 }}>
      <div style={{ padding: "10px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9B9B9B" }}>
          {t("map.sectionHint", "Click a live district to explore, or request one that is still locked")}
        </span>
      </div>
      <div style={{ height: "calc(100% - 32px)", overflow: "hidden" }}>
        {stateSlug === "karnataka" ? (
          <KarnatakaMap locale={locale} stateName={stateName} activeDistricts={new Set(activeDistrictSlugs)} />
        ) : (
          <GenericStateMap locale={locale} stateSlug={stateSlug} stateName={stateName} activeDistricts={new Set(activeDistrictSlugs)} />
        )}
      </div>
      <div style={{ padding: "0 16px 6px", fontSize: 10, color: "#B0B0AA" }}>
        Map data © DataMeet Contributors · CC-BY 4.0
      </div>
    </div>
  );
}

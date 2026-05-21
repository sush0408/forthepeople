/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { getStateConfig } from "@/lib/constants/state-config";
import { buildNoDataContent } from "@/lib/no-data";

interface NoDataCardProps {
  module: string;
  district: string;
  state: string;
  isUrban?: boolean;
  customMessage?: string;
}

export default function NoDataCard({ module, district, state, isUrban = false, customMessage }: NoDataCardProps) {
  const { locale, t } = useI18n();
  const stateConfig = getStateConfig(state);
  const { title, body, note, sourceLabel, sourceUrl } = buildNoDataContent({
    module,
    district,
    stateConfig,
    isUrban,
    customMessage,
    translate: locale === "en" ? undefined : t,
  });

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E4",
        borderRadius: 16,
        padding: "18px 20px",
        marginBottom: 20,
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            background: "#FFF7ED",
            color: "#C2410C",
            flexShrink: 0,
          }}
        >
          <Info size={18} />
        </span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>{body}</div>
          {sourceUrl && sourceLabel && (
            <Link
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                fontSize: 12,
                fontWeight: 600,
                color: "#C2410C",
                textDecoration: "none",
              }}
            >
              {sourceLabel}
              <ArrowUpRight size={13} />
            </Link>
          )}
          <div style={{ fontSize: 11, color: "#8B8B85", marginTop: 10, lineHeight: 1.5 }}>
            {note}
          </div>
        </div>
      </div>
    </div>
  );
}

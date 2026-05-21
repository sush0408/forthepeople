/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Trophy, ChevronRight } from "lucide-react";
import LocaleLink from "@/components/common/LocaleLink";
import { getDictionary } from "@/dictionaries";
import { translateDictionaryValue } from "@/i18n/I18nProvider";
import { getContributorBannerCopy } from "@/lib/chrome";
import { inferLocaleFromPathname } from "@/lib/locale-routing";

export default function ContributorCountBanner() {
  // Plain fetch — /support page is outside the QueryClientProvider tree.
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const pathname = usePathname();
  const locale = inferLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const t = (path: string, fallback?: string, vars?: Record<string, string | number>) =>
    translateDictionaryValue(dictionary, path, fallback, vars);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/data/contributors?limit=1")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const subs = typeof d?.subscribersTotal === "number" ? d.subscribersTotal : 0;
        const oneTime = typeof d?.oneTimeTotal === "number" ? d.oneTimeTotal : 0;
        setFailed(false);
        setTotal(subs + oneTime);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          setTotal(0);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "12px 20px",
        background: "#FEF3C7",
        border: "1px solid #FDE68A",
        borderRadius: 10,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      <Trophy size={16} style={{ color: "#B45309", flexShrink: 0 }} aria-hidden="true" />
      <span style={{ fontSize: 13, color: "#92400E" }}>
        {failed || total === null || total === 0 ? getContributorBannerCopy(total, failed, t) : (
          <>
            <strong>{total.toLocaleString("en-IN")}</strong>
            {" "}
            {t("support.banner.supportersSuffix", "people already backing India's data revolution")}
          </>
        )}
      </span>
      <LocaleLink
        href="/contributors"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#2563EB",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {t("support.banner.viewLeaderboard", "View leaderboard")}
          <ChevronRight size={14} aria-hidden="true" />
        </span>
      </LocaleLink>
    </div>
  );
}

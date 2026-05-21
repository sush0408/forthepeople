/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import FeedbackModal from "@/components/common/FeedbackModal";
import { useI18n } from "@/i18n/I18nProvider";
import { inferLocaleFromPathname, withLocalePath } from "@/lib/locale-routing";

export default function Footer() {
  const [time, setTime] = useState("");
  const pathname = usePathname();
  const { t } = useI18n();
  const locale = inferLocaleFromPathname(pathname);

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E8E8E4",
        fontSize: 11,
        color: "#9B9B9B",
      }}
    >
      {/* Row 1 — NDSAP notice + live clock */}
      <div
        style={{
          borderBottom: "1px solid #F0F0EC",
          padding: "0 20px",
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {t("footer.ndsNotice", "Data sourced under NDSAP Open Data Policy · Built for the citizens of India")}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "#6B6B6B",
            fontSize: 11,
            flexShrink: 0,
          }}
        >
          {time}
        </span>
      </div>

      {/* Row 2 — branding + nav links */}
      <div
        style={{
          padding: "0 20px",
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <span
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: "0 1 auto" }}
        >
          <strong style={{ color: "#6B6B6B" }}>ForThePeople.in</strong>
          {" — "}
          <span className="hidden sm:inline">{t("footer.disclaimer", "Independent. NOT an official government website. Data under NDSAP.")} </span>
          <Link href={withLocalePath(locale, "/disclaimer")} style={{ color: "#2563EB", textDecoration: "none" }}>
            {t("footer.disclaimerLink", "Disclaimer")}
          </Link>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link href={withLocalePath(locale, "/about")}       style={{ color: "#9B9B9B", textDecoration: "none" }}>{t("footer.about", "About")}</Link>
          <span style={{ color: "#C0C0C0" }}>·</span>
          <Link href={withLocalePath(locale, "/disclaimer")}  style={{ color: "#9B9B9B", textDecoration: "none" }}>{t("footer.disclaimerLink", "Disclaimer")}</Link>
          <span style={{ color: "#C0C0C0" }}>·</span>
          <Link href={withLocalePath(locale, "/privacy")}     style={{ color: "#9B9B9B", textDecoration: "none" }}>{t("footer.privacy", "Privacy")}</Link>
          <span style={{ color: "#C0C0C0" }}>·</span>
          <Link href={withLocalePath(locale, "/features")} style={{ color: "#7C3AED", textDecoration: "none" }}>{t("footer.features", "Features")}</Link>
          <span style={{ color: "#C0C0C0" }} className="hidden sm:inline">·</span>
          <Link href={withLocalePath(locale, "/contribute")}  style={{ color: "#9B9B9B", textDecoration: "none" }} className="hidden sm:inline">{t("footer.contribute", "Contribute")}</Link>
          <span style={{ color: "#C0C0C0" }} className="hidden sm:inline">·</span>
          <span className="hidden sm:inline"><FeedbackModal label={t("nav.feedback", "Feedback")} /></span>
          <span style={{ color: "#C0C0C0" }} className="hidden sm:inline">·</span>
          <Link href={withLocalePath(locale, "/support")} style={{ color: "#DC2626", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
            {t("footer.support", "Support")}
            <Heart size={12} fill="currentColor" aria-hidden="true" />
          </Link>
          <span style={{ color: "#C0C0C0" }} className="hidden sm:inline">·</span>
          <a
            href="https://www.instagram.com/jayanth_m_b/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6B6B6B", textDecoration: "none" }}
            className="hidden sm:inline"
          >
            {t("footer.builtBy", "Built by Jayanth M B")}
          </a>
        </div>
      </div>
    </footer>
  );
}

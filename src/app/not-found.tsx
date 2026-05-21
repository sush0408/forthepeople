/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";
import LocaleLink from "@/components/common/LocaleLink";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import { translateDictionaryValue } from "@/i18n/I18nProvider";
import { inferLocaleFromPathname } from "@/lib/locale-routing";

export default function NotFound() {
  const pathname = usePathname();
  const locale = inferLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const t = (path: string, fallback?: string, vars?: Record<string, string | number>) =>
    translateDictionaryValue(dictionary, path, fallback, vars);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAF8",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          fontFamily: "var(--font-jetbrains)",
          color: "#E8E8E4",
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#1A1A1A",
          marginBottom: 8,
          letterSpacing: "-0.3px",
        }}
      >
        {t("notFound.title", "Page not found")}
      </h1>
      <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 32, maxWidth: 360 }}>
        {t(
          "notFound.body",
          "This page doesn't exist, or the district / module you're looking for hasn't been added yet.",
        )}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <LocaleLink
          href="/"
          style={{
            padding: "10px 20px",
            background: "#2563EB",
            color: "#FFF",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {t("notFound.home", "Go Home")}
        </LocaleLink>
        <LocaleLink
          href="/about"
          style={{
            padding: "10px 20px",
            background: "#FFF",
            border: "1px solid #E8E8E4",
            color: "#1A1A1A",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {t("notFound.about", "About ForThePeople")}
        </LocaleLink>
      </div>
    </div>
  );
}

/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const STORAGE_KEY = "ftp_disclaimer_v1";

export default function DisclaimerBar() {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        background: "#FEF9C3",
        borderBottom: "1px solid #FDE68A",
        padding: "8px 16px",
        fontSize: 12,
        color: "#78350F",
        display: "flex",
        alignItems: "center",
        gap: 8,
        lineHeight: 1.5,
      }}
    >
      <AlertTriangle size={16} style={{ color: "#B45309", flexShrink: 0 }} aria-hidden="true" />
      <span style={{ flex: 1 }}>
        <strong>{t("site.disclaimerStrong", "ForThePeople.in is NOT an official government website.")}</strong>{" "}
        {t("site.disclaimerBody", "Data is sourced from publicly available government portals under India's Open Data Policy (NDSAP). Always verify critical information at the original government portal.")}
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss disclaimer"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#92400E",
          padding: 4,
          lineHeight: 1,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 28,
          minHeight: 28,
        }}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

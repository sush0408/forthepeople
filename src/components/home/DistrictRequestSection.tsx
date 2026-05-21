/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, MapPinned, Send, TrendingUp, Vote } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { INDIA_STATES } from "@/lib/constants/districts";
import {
  buildDistrictRequestStateOptions,
  findDistrictRequestDistrict,
  findDistrictRequestState,
  getDistrictCoverageProgressPct,
  getDistrictRequestErrorMessage,
  getDistrictRequestHint,
  getLocalizedDistrictRequestLabel,
  parseDistrictRequestSubmission,
  parseTopDistrictRequests,
  type TopDistrictRequest,
} from "@/lib/district-request";
import { withLocalePath } from "@/lib/locale-routing";
import { districtRequestPayload } from "@/lib/map/district-map";

export default function DistrictRequestSection({ locale = "en" }: { locale?: string }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic count of active districts from constants
  const activeCount = INDIA_STATES.reduce((sum, s) => sum + s.districts.filter(d => d.active).length, 0);
  const stateOptions = buildDistrictRequestStateOptions(INDIA_STATES);

  const { data } = useQuery<{ top: TopDistrictRequest[] }>({
    queryKey: ["district-requests"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/district-request");
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          return { top: [] };
        }

        return { top: parseTopDistrictRequests(payload) };
      } catch {
        return { top: [] };
      }
    },
    staleTime: 300_000,
  });

  const mutation = useMutation({
    mutationFn: async (body: { stateName: string; districtName: string }) => {
      const response = await fetch("/api/district-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => null);
      const submission = parseDistrictRequestSubmission(payload);

      if (!response.ok || !submission.success) {
        throw new Error(submission.error ?? "Failed to submit district request");
      }

      return payload as { success: boolean; requestCount?: number; fallback?: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["district-requests"] });
      setSubmitted(true);
    },
  });

  const topRequest = data?.top?.[0];
  const selectedStateMeta = findDistrictRequestState(INDIA_STATES, selectedState);
  const selectedDistrictMeta = findDistrictRequestDistrict(INDIA_STATES, selectedState, selectedDistrict);
  const lockedDistricts = [...(selectedStateMeta?.districts.filter((d) => !d.active) ?? [])]
    .sort((left, right) => left.name.localeCompare(right.name));
  const localizedSelectedState = getLocalizedDistrictRequestLabel(
    locale,
    selectedStateMeta?.name ?? selectedState,
    selectedStateMeta?.nameLocal,
  );
  const localizedSelectedDistrict = getLocalizedDistrictRequestLabel(
    locale,
    selectedDistrictMeta?.name ?? selectedDistrict,
    selectedDistrictMeta?.nameLocal,
  );
  const localizedTopRequest = topRequest
    ? {
        district: getLocalizedDistrictRequestLabel(
          locale,
          topRequest.districtName,
          findDistrictRequestDistrict(INDIA_STATES, topRequest.stateName, topRequest.districtName)?.nameLocal,
        ),
        state: getLocalizedDistrictRequestLabel(
          locale,
          topRequest.stateName,
          findDistrictRequestState(INDIA_STATES, topRequest.stateName)?.nameLocal,
        ),
      }
    : null;
  const requestHint = getDistrictRequestHint(localizedSelectedState, lockedDistricts.length, t);

  function resetRequestState() {
    setSubmitted(false);
    mutation.reset();
  }

  function handleRequest() {
    if (!selectedState || !selectedDistrict) return;
    mutation.mutate(districtRequestPayload(selectedState, selectedDistrict));
  }

  const progressPct = getDistrictCoverageProgressPct(activeCount, 780);

  return (
    <section style={{ padding: "0 16px 18px" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 62%, #F0FDF4 100%)",
          border: "1px solid #E8E8E4",
          borderRadius: 16,
          padding: "18px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, alignItems: "stretch" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#ECFDF5",
                  color: "#047857",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MapPinned size={20} strokeWidth={1.9} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                  {t("home.requestCard.title", "Expanding to 780+ districts")}
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                  {t("home.requestCard.subtitle", "Tell us which district should go live next.")}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>
                {t("home.requestCard.coverageLabel", "Coverage")}
              </span>
              <span style={{ fontSize: 12, color: "#475569", fontFamily: "var(--font-mono, monospace)" }}>
                {t("home.requestCard.coverageValue", "{count} / 780 live", { count: activeCount })}
              </span>
            </div>
            <div style={{ background: "#E5E7EB", borderRadius: 999, height: 8, overflow: "hidden", marginBottom: 14 }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #16A34A, #2563EB)",
                  borderRadius: 999,
                }}
              />
            </div>

            {topRequest ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 12,
                  color: "#92400E",
                  fontWeight: 700,
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: 999,
                  padding: "6px 10px",
                }}
              >
                <TrendingUp size={14} strokeWidth={1.9} />
                {t("home.requestCard.mostRequested", "Most requested: {district}, {state}", {
                  district: localizedTopRequest?.district ?? topRequest.districtName,
                  state: localizedTopRequest?.state ?? topRequest.stateName,
                })}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
                {t(
                  "home.requestCard.empty",
                  "No public requests yet. Pick a state and nominate the next district to launch.",
                )}
              </div>
            )}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.78)",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 14,
            }}
          >
            {submitted ? (
              <div
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: 10,
                  padding: "13px 14px",
                  fontSize: 13,
                  color: "#166534",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <CheckCircle2 size={17} strokeWidth={1.9} />
                <span>
                  {t("home.requestCard.success", "Request submitted. We'll prioritise {district}.", {
                    district: localizedSelectedDistrict,
                  })}
                </span>
                <button
                  onClick={resetRequestState}
                  style={{
                    marginLeft: "auto",
                    border: "none",
                    background: "transparent",
                    color: "#166534",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {t("home.requestCard.requestAnother", "Request another")}
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#475569", fontWeight: 700, marginBottom: 10 }}>
                  {t(
                    "home.requestCard.instructions",
                    "Choose a state first, then pick one district still waiting to go live.",
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                  <select
                    value={selectedState}
                    disabled={mutation.isPending}
                    onChange={(e) => {
                      resetRequestState();
                      setSelectedState(e.target.value);
                      setSelectedDistrict("");
                    }}
                    style={selectStyle}
                  >
                    <option value="">{t("home.requestCard.selectState", "Select state")}</option>
                    {stateOptions.map((state) => (
                      <option key={state.slug} value={state.stateName}>
                        {state.pendingDistrictCount > 0
                          ? t("home.requestCard.statePendingOption", "{state} ({count} pending)", {
                              state: getLocalizedDistrictRequestLabel(locale, state.stateName, state.stateLocalName),
                              count: state.pendingDistrictCount,
                            })
                          : t("home.requestCard.stateCoveredOption", "{state} (all live)", {
                              state: getLocalizedDistrictRequestLabel(locale, state.stateName, state.stateLocalName),
                            })}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      resetRequestState();
                      setSelectedDistrict(e.target.value);
                    }}
                    disabled={mutation.isPending || !selectedState || lockedDistricts.length === 0}
                    style={{
                      ...selectStyle,
                      color: selectedDistrict ? "#1A1A1A" : "#94A3B8",
                      opacity: mutation.isPending || !selectedState || lockedDistricts.length === 0 ? 0.58 : 1,
                    }}
                  >
                    <option value="">
                      {selectedState && lockedDistricts.length === 0
                        ? t("home.requestCard.noPending", "No pending districts")
                        : t("home.requestCard.selectDistrict", "Select district")}
                    </option>
                    {lockedDistricts.map((d) => (
                      <option key={d.slug} value={d.name}>
                        {getLocalizedDistrictRequestLabel(locale, d.name, d.nameLocal)}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleRequest}
                    disabled={!selectedState || !selectedDistrict || mutation.isPending}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      padding: "0 16px",
                      background: selectedState && selectedDistrict ? "#111827" : "#E5E7EB",
                      color: selectedState && selectedDistrict ? "#fff" : "#94A3B8",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: selectedState && selectedDistrict ? "pointer" : "default",
                      minHeight: 44,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mutation.isPending
                      ? t("home.requestCard.sending", "Sending...")
                      : t("home.requestCard.requestCta", "Request")}
                    <Send size={14} strokeWidth={1.9} />
                  </button>
                </div>

                {requestHint && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                    {requestHint}
                  </div>
                )}

                {topRequest && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>
                    {t("home.requestCard.mostRequestedCount", "{district}, {state} currently has {count} public requests.", {
                      district: localizedTopRequest?.district ?? topRequest.districtName,
                      state: localizedTopRequest?.state ?? topRequest.stateName,
                      count: topRequest.requestCount,
                    })}
                  </div>
                )}

                {mutation.isError && (
                  <div
                    style={{
                      marginTop: 10,
                      borderRadius: 10,
                      border: "1px solid #FECACA",
                      background: "#FEF2F2",
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#B91C1C",
                      lineHeight: 1.5,
                    }}
                  >
                    {getDistrictRequestErrorMessage(mutation.error, t)}
                  </div>
                )}
              </>
            )}

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
              <Link
                href={withLocalePath(locale, "/features")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 12px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#334155",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Vote size={15} strokeWidth={1.9} style={{ color: "#2563EB" }} />
                  {t("home.requestCard.voteFeatures", "Vote on upcoming features")}
                </span>
                <ArrowRight size={14} strokeWidth={1.9} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const selectStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "0 12px",
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  fontSize: 13,
  color: "#1A1A1A",
  background: "#FFFFFF",
  outline: "none",
  minHeight: 44,
};

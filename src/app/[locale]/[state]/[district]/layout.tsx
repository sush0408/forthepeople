/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Sidebar from "@/components/layout/Sidebar";
import FeedbackFloatingButton from "@/components/common/FeedbackFloatingButton";
import { getDistrict, getState } from "@/lib/constants/districts";
import { localizedDistrictUrl, localizedSiteUrl } from "@/lib/site-metadata";

type Params = Promise<{ locale: string; state: string; district: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, state: stateSlug, district: districtSlug } = await params;
  const stateData = getState(stateSlug);
  const districtData = getDistrict(stateSlug, districtSlug);

  if (!districtData || !stateData) return {};

  const title = `${districtData.name} District — Government Data Dashboard`;
  const description = `Live government data for ${districtData.name} district, ${stateData.name}${districtData.tagline ? ` — ${districtData.tagline}` : ""}. Crop prices, water levels, schemes, budget, and more.`;

  const canonicalUrl = localizedDistrictUrl(locale, stateSlug, districtSlug);
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DistrictLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale, state: stateSlug, district: districtSlug } = await params;

  // 404 for non-existent districts
  const stateData = getState(stateSlug);
  const districtData = getDistrict(stateSlug, districtSlug);
  if (!districtData) notFound();

  // JSON-LD structured data
  const districtUrl = localizedDistrictUrl(locale, stateSlug, districtSlug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": `${districtData!.name} District Administration`,
    "description": `Government data dashboard for ${districtData!.name} district${stateData ? `, ${stateData.name}` : ""}`,
    "url": districtUrl,
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": districtData!.name,
      "containedInPlace": stateData ? { "@type": "State", "name": stateData.name } : undefined,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": localizedSiteUrl(locale, "/") },
      { "@type": "ListItem", "position": 2, "name": stateData?.name ?? "Karnataka", "item": localizedSiteUrl(locale, `/${stateSlug}`) },
      { "@type": "ListItem", "position": 3, "name": districtData!.name, "item": districtUrl },
    ],
  };

  return (
    <>
      <Script
        id="district-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 56px - 28px)",
        }}
      >
        {/* Sidebar — desktop only */}
        <Sidebar locale={locale} stateSlug={stateSlug} districtSlug={districtSlug} />

        {/* Main content */}
        <main
          style={{ flex: 1, minWidth: 0, background: "#FAFAF8" }}
          role="main"
          aria-label={`${districtData!.name} district data`}
        >
          {children}
        </main>
      </div>

      {/* Floating feedback button — bottom-right on all district pages */}
      <FeedbackFloatingButton stateSlug={stateSlug} districtSlug={districtSlug} />
    </>
  );
}

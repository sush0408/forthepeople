/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import { localizedSiteUrl } from "@/lib/site-metadata";

export { default } from "../../support/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Support ForThePeople.in — ₹1.50/day serves one district",
    description:
      "Help keep India's citizen transparency platform running. ₹12 lakh/year to serve 780+ districts. Every rupee keeps government data free and accessible.",
    alternates: { canonical: localizedSiteUrl(locale, "/support") },
  };
}

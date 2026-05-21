/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import { localizedSiteUrl } from "@/lib/site-metadata";

export { default } from "../../about/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "About ForThePeople.in — India's Citizen Transparency Platform",
    description:
      "ForThePeople.in is India's free citizen transparency platform. Built by Jayanth M B in 2026, it aggregates district-level government data under NDSAP across 780+ districts.",
    alternates: { canonical: localizedSiteUrl(locale, "/about") },
    openGraph: {
      url: localizedSiteUrl(locale, "/about"),
      title: "About ForThePeople.in",
      description:
        "India's citizen transparency platform — free district-level government data for every Indian citizen.",
    },
  };
}

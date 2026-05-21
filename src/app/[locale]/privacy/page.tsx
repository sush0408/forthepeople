/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import { localizedSiteUrl } from "@/lib/site-metadata";

export { default } from "../../privacy/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Privacy Policy — ForThePeople.in",
    description:
      "How ForThePeople.in handles your data. Fully compliant with India's Digital Personal Data Protection (DPDP) Act, 2023.",
    alternates: { canonical: localizedSiteUrl(locale, "/privacy") },
  };
}

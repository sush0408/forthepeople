/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import { localizedSiteUrl } from "@/lib/site-metadata";

export { default } from "../../disclaimer/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Disclaimer — ForThePeople.in",
    description:
      "Legal disclaimer for ForThePeople.in, India's independent citizen transparency platform. Read about data accuracy, political neutrality, and use of government references.",
    alternates: { canonical: localizedSiteUrl(locale, "/disclaimer") },
  };
}

/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import { localizedSiteUrl } from "@/lib/site-metadata";

export { default } from "../../feedback/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Share Your Feedback — ForThePeople.in",
    description:
      "Report wrong data, request a district, suggest a feature, or send general feedback to ForThePeople.in.",
    alternates: { canonical: localizedSiteUrl(locale, "/feedback") },
    openGraph: {
      url: localizedSiteUrl(locale, "/feedback"),
      title: "Share Your Feedback — ForThePeople.in",
      description:
        "Report wrong data, request a district, suggest a feature, or send general feedback to ForThePeople.in.",
    },
  };
}

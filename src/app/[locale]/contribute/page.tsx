/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import { localizedSiteUrl } from "@/lib/site-metadata";

export { default } from "../../contribute/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Contribute — ForThePeople.in",
    description:
      "Help expand ForThePeople.in to your district — report errors, suggest data sources, request your district, or contribute code.",
    alternates: { canonical: localizedSiteUrl(locale, "/contribute") },
    openGraph: {
      url: localizedSiteUrl(locale, "/contribute"),
      title: "Contribute — ForThePeople.in",
      description:
        "Help expand ForThePeople.in to your district — report errors, suggest data sources, request your district, or contribute code.",
    },
  };
}

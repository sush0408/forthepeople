/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import type { Metadata } from "next";
import GlobalContributorsClient from "./GlobalContributorsClient";
import { localizedSiteUrl } from "@/lib/site-metadata";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Contributors — ForThePeople.in",
    description:
      "The people who keep India's citizen transparency platform running. View the leaderboard and all contributors.",
    alternates: { canonical: localizedSiteUrl(locale, "/contributors") },
    openGraph: {
      url: localizedSiteUrl(locale, "/contributors"),
      title: "Contributors — ForThePeople.in",
      description:
        "The people who keep India's citizen transparency platform running. View the leaderboard and all contributors.",
    },
  };
}

export default async function GlobalContributorsPage({ params }: Props) {
  const { locale } = await params;
  return <GlobalContributorsClient locale={locale} />;
}

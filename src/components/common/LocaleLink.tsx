"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { inferLocaleFromPathname, withLocalePath } from "@/lib/locale-routing";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  fallbackLocale?: string;
};

export default function LocaleLink({
  href,
  fallbackLocale = "en",
  ...props
}: LocaleLinkProps) {
  const pathname = usePathname();
  const locale = inferLocaleFromPathname(pathname, fallbackLocale);

  return <Link href={withLocalePath(locale, href)} {...props} />;
}

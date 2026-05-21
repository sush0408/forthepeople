const LOCALE_SET = new Set([
  "en", "kn", "hi", "te", "ta", "ml", "mr", "bn", "gu", "pa", "or", "as",
  "ur", "sa", "ne", "sd", "ks", "doi", "kok", "mni", "brx", "sat", "mai",
]);

function isAbsoluteOrSpecialHref(path: string): boolean {
  return /^(?:[a-z][a-z\d+\-.]*:|\/\/|#|\?)/iu.test(path);
}

export function inferLocaleFromPathname(pathname: string | null | undefined, fallback = "en"): string {
  const slug = pathname?.split("/").filter(Boolean)[0];
  return slug && LOCALE_SET.has(slug) ? slug : fallback;
}

export function withLocalePath(locale: string, path: string): string {
  const trimmedPath = path.trim();
  if (!trimmedPath) {
    return `/${locale}`;
  }

  if (isAbsoluteOrSpecialHref(trimmedPath)) {
    return trimmedPath;
  }

  const normalizedPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
  const [pathname, suffix = ""] = normalizedPath.split(/(?=[?#])/u, 2);
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && LOCALE_SET.has(segments[0])) {
    return `${pathname}${suffix}`;
  }

  return pathname === "/"
    ? `/${locale}${suffix}`
    : `/${locale}${pathname}${suffix}`;
}

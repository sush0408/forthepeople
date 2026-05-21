export type TranslationDictionary = Record<string, unknown>;

function readPath(dictionary: TranslationDictionary, path: string): unknown {
  return path.split(".").reduce<unknown>((node, segment) => {
    if (!node || typeof node !== "object") return undefined;
    return (node as Record<string, unknown>)[segment];
  }, dictionary);
}

function interpolate(value: string, vars?: Record<string, string | number>) {
  if (!vars) return value;
  return Object.entries(vars).reduce(
    (next, [key, replacement]) => next.replaceAll(`{${key}}`, String(replacement)),
    value,
  );
}

export function translateDictionaryValue(
  dictionary: TranslationDictionary,
  path: string,
  fallback = path,
  vars?: Record<string, string | number>,
): string {
  const translated = readPath(dictionary, path);
  return interpolate(typeof translated === "string" ? translated : fallback, vars);
}

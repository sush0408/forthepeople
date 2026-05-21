export function formatRelativeFreshness(iso: string | null | undefined, nowMs = Date.now()): string {
  if (!iso) return "Awaiting first sync";

  const timestampMs = new Date(iso).getTime();
  if (!Number.isFinite(timestampMs)) return "Freshness unavailable";

  const diffMs = nowMs - timestampMs;
  if (diffMs <= 0) return "just now";

  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toTimestampMs(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const timestampMs = new Date(value).getTime();
  return Number.isFinite(timestampMs) ? timestampMs : null;
}

export function latestFreshnessIso(values: Array<string | Date | null | undefined>): string | null {
  let latestTimestampMs: number | null = null;

  for (const value of values) {
    const timestampMs = toTimestampMs(value);
    if (timestampMs === null) continue;
    latestTimestampMs = latestTimestampMs === null
      ? timestampMs
      : Math.max(latestTimestampMs, timestampMs);
  }

  return latestTimestampMs === null ? null : new Date(latestTimestampMs).toISOString();
}

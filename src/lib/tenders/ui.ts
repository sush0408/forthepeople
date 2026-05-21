export type TimelinePoint = { at: string };

export function buildTenderQuerySearch(stateSlug: string): string {
  return new URLSearchParams({ state: stateSlug }).toString();
}

export function buildTenderQueryKey(
  scope: string,
  stateSlug: string,
  districtSlug: string,
  ...parts: Array<string | number | boolean>
) {
  return ["tenders", scope, stateSlug, districtSlug, ...parts] as const;
}

export function deadlineUrgency(deadlineIso: string, nowMs: number) {
  const msLeft = new Date(deadlineIso).getTime() - nowMs;
  const daysLeft = msLeft / 86400_000;

  if (msLeft <= 0) {
    return {
      borderColor: "#9CA3AF",
      badgeLabel: "Closed",
      pulsing: false,
      dimmed: true,
      ariaLabel: "Deadline has passed",
    };
  }

  if (daysLeft < 2) {
    return {
      borderColor: "#DC2626",
      badgeLabel: "Under 48h",
      pulsing: true,
      dimmed: false,
      ariaLabel: `Deadline in ${Math.max(1, Math.round(daysLeft * 24))} hours (urgent)`,
    };
  }

  if (daysLeft < 7) {
    return {
      borderColor: "#F59E0B",
      badgeLabel: "This week",
      pulsing: false,
      dimmed: false,
      ariaLabel: `Deadline in ${Math.ceil(daysLeft)} days (approaching)`,
    };
  }

  return {
    borderColor: "#16A34A",
    badgeLabel: "Open",
    pulsing: false,
    dimmed: false,
    ariaLabel: `Deadline in ${Math.ceil(daysLeft)} days (ample time)`,
  };
}

export function formatPublishedAge(publishedAt: string, nowMs: number): string {
  const publishedMs = new Date(publishedAt).getTime();
  if (!Number.isFinite(publishedMs)) return "Published date unavailable";

  const daysAgo = Math.floor((nowMs - publishedMs) / 86400_000);
  if (daysAgo <= 0) return "Published today";
  if (daysAgo === 1) return "Published yesterday";
  return `Published ${daysAgo}d ago`;
}

export function timelineBounds(events: TimelinePoint[], fallbackNowMs: number) {
  if (events.length === 0) {
    return { earliest: fallbackNowMs, latest: fallbackNowMs + 1, spanMs: 1 };
  }

  const timestamps = events
    .map((event) => new Date(event.at).getTime())
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return { earliest: fallbackNowMs, latest: fallbackNowMs + 1, spanMs: 1 };
  }

  const earliest = Math.min(...timestamps);
  const latest = Math.max(...timestamps);

  return {
    earliest,
    latest,
    spanMs: Math.max(1, latest - earliest),
  };
}

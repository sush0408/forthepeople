// Suggested visibility expiry windows for manual supporter records.
// These remain suggestions only; admins can still override the saved date.
export function suggestedExpiryDays(amount: number): number | null {
  if (amount <= 0) return null;
  if (amount < 1000) return 90;
  if (amount < 10000) return 180;
  return 365;
}

export function suggestedExpiryDate(amount: number, now = new Date()): string | null {
  const days = suggestedExpiryDays(amount);
  if (days == null) return null;

  const next = new Date(now);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

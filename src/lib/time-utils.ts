/**
 * Parse "HH:MM" string into today's Date in Turkey time (UTC+3)
 */
export function parseTimeToday(timeStr: string): Date {
  const now = getTurkeyNow();
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Get current time in Turkey timezone
 */
export function getTurkeyNow(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' })
  );
}

/**
 * Get today's date string in YYYY-MM-DD format (Turkey time)
 */
export function getTurkeyDateStr(): string {
  const now = new Date();
  return now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
}

/**
 * Format seconds into HH:MM:SS
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

/**
 * Format date string for display: "9 Mart 2026, Pazartesi"
 */
export function formatDateTurkish(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00+03:00');
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
    timeZone: 'Europe/Istanbul',
  });
}

/**
 * Calculate Ramadan day number from a date and Ramadan start date
 */
export function getRamadanDay(dateStr: string, ramadanStartStr: string): number {
  const date = new Date(dateStr + 'T12:00:00+03:00');
  const start = new Date(ramadanStartStr + 'T12:00:00+03:00');
  const diff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

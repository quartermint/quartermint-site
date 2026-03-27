/**
 * ISO week key utility for weekly stat tracking.
 *
 * Returns keys like "2026-W13" for bucketing Redis counters
 * with natural weekly rollover (no cleanup needed).
 */

/**
 * Get ISO week key for a specific date.
 * @param date The date to compute the ISO week for
 * @returns ISO week string in format "YYYY-WNN" (e.g. "2026-W13")
 */
export function getISOWeekKeyForDate(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

/**
 * Get ISO week key for the current date.
 * @returns ISO week string in format "YYYY-WNN" (e.g. "2026-W13")
 */
export function getISOWeekKey(): string {
  return getISOWeekKeyForDate(new Date())
}

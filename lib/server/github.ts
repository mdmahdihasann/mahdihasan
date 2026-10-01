/**
 * Server-only: Mahdi's public GitHub activity for the GitHub panel. The
 * contribution calendar comes from github-contributions-api.jogruber.de (GitHub
 * has no keyless endpoint for it), cached for six hours so the page regenerates
 * in the background (ISR) instead of calling out on every visit.
 *
 * Any failure resolves to `null` and the panel simply doesn't render.
 */

const REVALIDATE = 60 * 60 * 6;

export type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GitHubActivity = {
  username: string;
  total: number;
  /** Sunday-first columns, oldest first; the last one may be short. */
  weeks: ContribDay[][];
  longestStreak: number;
  currentStreak: number;
  busiest: ContribDay | null;
};

export const usernameFromUrl = (url: string) =>
  new URL(url).pathname.split("/").filter(Boolean)[0] ?? "";

/** Consecutive days with at least one contribution. Today may still be empty. */
export function streaks(days: ContribDay[]) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else if (i === days.length - 1) continue;
    else break;
  }
  return { longest, current };
}

export function toWeeks(days: ContribDay[]) {
  const weeks: ContribDay[][] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 || weeks.length === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
  }
  return weeks;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function getGitHubActivity(username: string): Promise<GitHubActivity | null> {
  if (!username) return null;

  const calendar = await getJson<{ total: Record<string, number>; contributions: ContribDay[] }>(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
  );

  if (!calendar?.contributions?.length) return null;

  const days = calendar.contributions;
  const { longest, current } = streaks(days);
  const busiest = days.reduce<ContribDay | null>(
    (best, d) => (d.count > (best?.count ?? 0) ? d : best),
    null,
  );

  return {
    username,
    total: calendar.total.lastYear ?? days.reduce((sum, d) => sum + d.count, 0),
    weeks: toWeeks(days),
    longestStreak: longest,
    currentStreak: current,
    busiest,
  };
}

/**
 * Server-only: Mahdi's public GitHub activity for the GitHub panel. The
 * contribution calendar is read from GitHub's own profile fragment
 * (github.com/users/<name>/contributions — keyless HTML), with
 * github-contributions-api.jogruber.de as a fallback. Both are cached for six
 * hours so the page regenerates in the background (ISR) instead of calling out
 * on every visit.
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

async function get(url: string, accept: string): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: accept },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/**
 * Parses GitHub's contribution-calendar fragment. Each day is a `<td>` with
 * `data-date` / `data-level` and an id; its count is only in the `<tool-tip
 * for="id">` text ("No contributions on …" / "3 contributions on …").
 */
export function parseContributions(html: string): ContribDay[] {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*\sfor="([^"]+)"[^>]*>\s*(\d[\d,]*|No) contributions?/g)) {
    counts.set(m[1], m[2] === "No" ? 0 : Number(m[2].replace(/,/g, "")));
  }

  const days: ContribDay[] = [];
  for (const m of html.matchAll(/<td\s[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const attr = (name: string) => m[0].match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
    const date = attr("data-date");
    const id = attr("id");
    if (!date) continue;
    const level = Math.min(4, Math.max(0, Number(attr("data-level") ?? 0))) as ContribDay["level"];
    days.push({ date, level, count: (id ? counts.get(id) : undefined) ?? (level ? 1 : 0) });
  }
  // The table is laid out row by weekday; the panel wants days in date order.
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function fromGitHub(username: string): Promise<ContribDay[] | null> {
  const res = await get(`https://github.com/users/${encodeURIComponent(username)}/contributions`, "text/html");
  const days = res ? parseContributions(await res.text()) : [];
  return days.length ? days : null;
}

async function fromMirror(username: string): Promise<ContribDay[] | null> {
  const res = await get(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    "application/json",
  );
  try {
    const json = res ? ((await res.json()) as { contributions?: ContribDay[] }) : null;
    return json?.contributions?.length ? json.contributions : null;
  } catch {
    return null;
  }
}

export async function getGitHubActivity(username: string): Promise<GitHubActivity | null> {
  if (!username) return null;

  const days = (await fromGitHub(username)) ?? (await fromMirror(username));
  if (!days) return null;

  const { longest, current } = streaks(days);
  const busiest = days.reduce<ContribDay | null>(
    (best, d) => (d.count > (best?.count ?? 0) ? d : best),
    null,
  );

  return {
    username,
    total: days.reduce((sum, d) => sum + d.count, 0),
    weeks: toWeeks(days),
    longestStreak: longest,
    currentStreak: current,
    busiest,
  };
}

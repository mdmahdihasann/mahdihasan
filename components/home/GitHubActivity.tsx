import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";

import type { GitHubActivity as Activity } from "@/lib/server/github";

import ContribGraph from "./ContribGraph";
import PanelHead from "./PanelHead";

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const days = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

/**
 * Live proof of work: the contribution calendar and streaks, read from GitHub
 * on the server (see `lib/server/github.ts`).
 * Renders nothing when GitHub couldn't be reached.
 */
const GitHubActivity = ({ data }: { data: Activity | null }) => {
  if (!data) return null;

  const profileUrl = `https://github.com/${data.username}`;
  const facts = [
    { label: "Contributions, last 12 months", value: data.total.toLocaleString("en-US") },
    { label: "Longest streak", value: days(data.longestStreak) },
    { label: "Current streak", value: days(data.currentStreak) },
    ...(data.busiest
      ? [
          {
            label: `Busiest day, ${shortDate.format(new Date(`${data.busiest.date}T00:00:00Z`))}`,
            value: `${data.busiest.count} contributions`,
          },
        ]
      : []),
  ];

  return (
    <section id="github" className="panel reveal" aria-labelledby="github-title">
      <PanelHead
        icon={GitCommitHorizontal}
        title="GitHub Activity"
        id="github-title"
        action={
          <a href={profileUrl} className="panel-link" target="_blank" rel="noreferrer noopener">
            @{data.username} <ArrowUpRight size={15} aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        }
      />

      <dl className="gh-facts">
        {facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <ContribGraph weeks={data.weeks} total={data.total} />
    </section>
  );
};

export default GitHubActivity;

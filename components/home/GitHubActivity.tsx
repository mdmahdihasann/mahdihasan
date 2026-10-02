import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";

import type { GitHubActivity as Activity } from "@/lib/server/github";
import { span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import ContribGraph from "./ContribGraph";
import PanelHead, { panelLink } from "./PanelHead";

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
    <section id="github" className={cn("panel reveal", span.full)} aria-labelledby="github-title">
      <PanelHead
        icon={GitCommitHorizontal}
        title="GitHub Activity"
        id="github-title"
        action={
          <a href={profileUrl} className={panelLink} target="_blank" rel="noreferrer noopener">
            @{data.username} <ArrowUpRight size={15} aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        }
      />

      <dl className="mb-[clamp(18px,2.2vw,24px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-x-[22px] gap-y-3.5 max-[600px]:grid-cols-2 max-[600px]:gap-x-4">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-[12.5px] text-fg-3">{f.label}</dt>
            <dd className="mt-0.5 font-display text-[clamp(20px,1.9vw,25px)] font-bold tracking-[-0.02em] text-fg-1 tabular-nums max-[600px]:text-[18px]">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      <ContribGraph weeks={data.weeks} total={data.total} />
    </section>
  );
};

export default GitHubActivity;

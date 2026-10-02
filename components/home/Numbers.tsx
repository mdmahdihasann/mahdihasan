import { TrendingUp } from "lucide-react";

import { profile } from "@/data/profile";
import { stats } from "@/data/stats";
import { liveDot, span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import DhakaTime from "./DhakaTime";
import PanelHead from "./PanelHead";
import StatCounter from "./StatCounter";

const Numbers = () => (
  <section
    id="numbers"
    className={cn("panel reveal flex flex-col", span.narrow)}
    aria-labelledby="numbers-title"
  >
    <PanelHead icon={TrendingUp} title="By The Numbers" id="numbers-title" />

    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ icon: Icon, ...stat }) => (
        <StatCounter key={stat.label} {...stat} icon={<Icon size={18} />} variant="grid" />
      ))}
    </div>

    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-[18px]">
      <div>
        <p className="mb-0.5 text-[13px] text-fg-3">Local time in Dhaka</p>
        <DhakaTime />
      </div>
      <p className="flex items-center gap-2 text-[13.5px] text-fg-2">
        <span className={liveDot} aria-hidden />
        {profile.availability}
      </p>
    </div>
  </section>
);

export default Numbers;

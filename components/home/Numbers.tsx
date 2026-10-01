import { TrendingUp } from "lucide-react";

import { profile } from "@/data/profile";
import { stats } from "@/data/stats";

import DhakaTime from "./DhakaTime";
import PanelHead from "./PanelHead";
import StatCounter from "./StatCounter";

const Numbers = () => (
  <section id="numbers" className="panel reveal" aria-labelledby="numbers-title">
    <PanelHead icon={TrendingUp} title="By The Numbers" id="numbers-title" />

    <div className="numbers-grid">
      {stats.map(({ icon: Icon, ...stat }) => (
        <StatCounter key={stat.label} {...stat} icon={<Icon size={18} />} />
      ))}
    </div>

    <div className="local">
      <div>
        <p className="local-label">Local time in Dhaka</p>
        <DhakaTime />
      </div>
      <p className="local-note">
        <span className="dot" aria-hidden />
        {profile.availability}
      </p>
    </div>
  </section>
);

export default Numbers;

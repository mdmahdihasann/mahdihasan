import { Briefcase } from "lucide-react";

import { services } from "@/data/services";
import { khakiTile, span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import PanelHead from "./PanelHead";

/** Two columns of icon + text rows, ruled apart rather than boxed. */
const Services = () => (
  <section id="services" className={cn("panel reveal", span.full)} aria-labelledby="services-title">
    <PanelHead
      icon={Briefcase}
      title="What I Do"
      id="services-title"
    />

    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-[clamp(24px,3vw,44px)]">
      {services.map(({ icon: Icon, name, desc }) => (
        <li className="group/service flex items-start gap-4 border-t border-line py-[18px]" key={name}>
          <span
            className={cn(
              khakiTile,
              "size-11 rounded-[13px] transition-colors duration-[350ms] ease-smooth group-hover/service:bg-khaki group-hover/service:text-ink",
            )}
            aria-hidden
          >
            <Icon size={20} strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="mb-1 text-[16.5px]">{name}</h3>
            <p className="text-[14px] text-pretty text-fg-2">{desc}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default Services;

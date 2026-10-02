import { Workflow } from "lucide-react";
import type { CSSProperties } from "react";

import { process } from "@/data/process";
import { span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import PanelHead from "./PanelHead";

/**
 * Six steps on one lit rail. The numbers carry the order, so they stay.
 * `--i` is each step's place on the rail; the `process-rail` / `process-node`
 * utilities use it to light the node as the drawing line and the looping comet
 * reach it. Phones turn the rail into a vertical timeline.
 */
const Process = () => (
  <section id="process" className={cn("panel reveal", span.full)} aria-labelledby="process-title">
    <PanelHead icon={Workflow} title="My Work Process" id="process-title" />

    <ol className="process-rail relative grid grid-cols-6 gap-[clamp(10px,1.4vw,18px)] max-[1100px]:grid-cols-3 max-[1100px]:gap-y-7 max-[600px]:grid-cols-1 max-[600px]:gap-y-0">
      {process.map(({ icon: Icon, name, desc }, i) => (
        <li
          className={cn(
            // Steps paint above the rail, so the line and comet pass behind the nodes.
            "group/step relative z-1 flex flex-col items-center text-center",
            "max-[600px]:grid max-[600px]:grid-cols-[var(--node)_minmax(0,1fr)] max-[600px]:items-start max-[600px]:gap-x-4 max-[600px]:pb-[22px] max-[600px]:text-left max-[600px]:last:pb-0",
          )}
          key={name}
          style={{ "--i": i } as CSSProperties}
        >
          <span
            className="process-node relative flex size-(--node) items-center justify-center rounded-full border border-khaki/45 bg-bg-deep text-khaki shadow-[0_0_0_6px_rgba(217,210,163,.05),0_0_22px_-4px_rgba(217,210,163,.45)] transition-colors duration-[350ms] ease-smooth group-hover/step:bg-khaki group-hover/step:text-ink max-[600px]:row-span-3 max-[600px]:[&_svg]:size-[19px]"
            aria-hidden
          >
            <Icon size={22} strokeWidth={1.7} />
          </span>
          <span
            className="mt-3.5 text-[13px] font-semibold text-khaki tabular-nums max-[600px]:mt-0.5"
            aria-hidden
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-0.5 mb-1.5 text-[16.5px] max-[600px]:mt-0 max-[600px]:mb-1">{name}</h3>
          <p className="max-w-[22ch] text-[13.5px] text-pretty text-fg-2 max-[600px]:max-w-none">{desc}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default Process;

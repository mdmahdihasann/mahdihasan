import type { LucideIcon } from "lucide-react";

import { khakiTile } from "@/lib/ui";
import { cn } from "@/lib/utils";

type PanelHeadProps = {
  icon: LucideIcon;
  title: string;
  /** Becomes the h2's id, which the section's `aria-labelledby` points at. */
  id: string;
  /** Optional link or control pinned to the right of the title. */
  action?: React.ReactNode;
};

/** The link style used in a panel head's `action` slot. */
export const panelLink =
  "inline-flex items-center gap-1.5 text-[14px] font-semibold text-khaki transition-[gap,color] duration-300 ease-smooth hover:gap-2.5 hover:text-khaki-hi max-[560px]:text-[13px]";

/** The icon tile + title row every panel opens with. */
const PanelHead = ({ icon: Icon, title, id, action }: PanelHeadProps) => (
  <div className="mb-[clamp(16px,2.4vw,34px)] flex items-center gap-3 max-[600px]:flex-wrap max-[600px]:gap-y-1.5">
    <span
      data-slot="panel-icon"
      className={cn(khakiTile, "size-[34px] rounded-[10px] border-khaki/22")}
      aria-hidden
    >
      <Icon size={17} strokeWidth={1.9} />
    </span>
    <h2 className="text-[clamp(18px,1.7vw,24px)] leading-[1.2] font-bold tracking-[-0.02em]" id={id}>
      {title}
    </h2>
    {action && <div className="ml-auto">{action}</div>}
  </div>
);

export default PanelHead;

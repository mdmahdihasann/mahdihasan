import type { LucideIcon } from "lucide-react";

type PanelHeadProps = {
  icon: LucideIcon;
  title: string;
  /** Becomes the h2's id, which the section's `aria-labelledby` points at. */
  id: string;
  /** Optional link or control pinned to the right of the title. */
  action?: React.ReactNode;
};

/** The icon tile + title row every panel opens with. */
const PanelHead = ({ icon: Icon, title, id, action }: PanelHeadProps) => (
  <div className="panel-head">
    <span className="panel-icon" aria-hidden>
      <Icon size={17} strokeWidth={1.9} />
    </span>
    <h2 className="panel-title" id={id}>
      {title}
    </h2>
    {action && <div className="panel-action">{action}</div>}
  </div>
);

export default PanelHead;

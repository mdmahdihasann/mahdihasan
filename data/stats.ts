import {
  CalendarDays,
  FolderCheck,
  Layers,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";

export type Stat = {
  count: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Read by the hero's floating cards and the By The Numbers panel.
 * TODO: adjust these to your real numbers before publishing.
 */
export const stats: Stat[] = [
  { count: 2, suffix: "+", label: "Years of experience", icon: CalendarDays },
  { count: 20, suffix: "+", label: "Projects completed", icon: FolderCheck },
  { count: 16, suffix: "", label: "Technologies used", icon: Layers },
  { count: 100, suffix: "%", label: "Client satisfaction", icon: ThumbsUp },
];

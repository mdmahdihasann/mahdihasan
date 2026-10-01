import {
  ClipboardList,
  Code2,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type ProcessStep = { icon: LucideIcon; name: string; desc: string };

/** How a project runs from first call to launch, in order. */
export const process: ProcessStep[] = [
  {
    icon: Search,
    name: "Discover",
    desc: "Your goals, your audience and what the site has to do.",
  },
  {
    icon: ClipboardList,
    name: "Plan",
    desc: "Sitemap, content and the right stack: Next.js, WordPress or WooCommerce.",
  },
  {
    icon: PenTool,
    name: "Design",
    desc: "Wireframes and responsive layouts that hold up on every screen.",
  },
  {
    icon: Code2,
    name: "Develop",
    desc: "Clean, reusable components and custom builds wired to your APIs.",
  },
  {
    icon: ShieldCheck,
    name: "Test",
    desc: "Cross-browser, mobile and performance checks before anything ships.",
  },
  {
    icon: Rocket,
    name: "Launch",
    desc: "Hosting, DNS and SEO set up, and support after go-live.",
  },
];

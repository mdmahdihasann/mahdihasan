import { Route } from "lucide-react";

import { span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import PanelHead from "./PanelHead";
import Timeline from "./Timeline";

const Experience = () => (
  <section
    id="experience"
    className={cn("panel reveal", span.wide)}
    aria-labelledby="experience-title"
  >
    <PanelHead icon={Route} title="My Journey" id="experience-title" />
    <Timeline />
  </section>
);

export default Experience;

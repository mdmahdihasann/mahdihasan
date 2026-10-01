import { Route } from "lucide-react";

import PanelHead from "./PanelHead";
import Timeline from "./Timeline";

const Experience = () => (
  <section id="experience" className="panel reveal" aria-labelledby="experience-title">
    <PanelHead icon={Route} title="My Journey" id="experience-title" />
    <Timeline />
  </section>
);

export default Experience;

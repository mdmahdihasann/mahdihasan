import { Briefcase } from "lucide-react";

import { services } from "@/data/services";

import PanelHead from "./PanelHead";

/** Two columns of icon + text rows, ruled apart rather than boxed. */
const Services = () => (
  <section id="services" className="panel reveal" aria-labelledby="services-title">
    <PanelHead icon={Briefcase} title="What I Do" id="services-title" />

    <ul className="service-list">
      {services.map(({ icon: Icon, name, desc }) => (
        <li className="service-row" key={name}>
          <span className="service-icon" aria-hidden>
            <Icon size={20} strokeWidth={1.75} />
          </span>
          <div>
            <h3>{name}</h3>
            <p>{desc}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default Services;

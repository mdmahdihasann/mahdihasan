import {
  ArrowRight,
  CircleCheck,
  Mail,
  MapPin,
  User,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { profile } from "@/data/profile";

import PanelHead from "./PanelHead";

type Fact = { icon: LucideIcon; label: string; value: string; href?: string };

const FACTS: Fact[] = [
  { icon: UserRound, label: "Name", value: profile.name },
  { icon: MapPin, label: "Location", value: profile.location },
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  { icon: CircleCheck, label: "Availability", value: profile.availability },
];

const About = () => (
  <section id="about" className="panel reveal" aria-labelledby="about-title">
    <PanelHead icon={User} title="About Me" id="about-title" />

    <p className="about-text">{profile.summary}</p>

    <dl className="about-facts">
      {FACTS.map(({ icon: Icon, label, value, href }) => (
        <div className="fact" key={label}>
          <span className="fact-icon" aria-hidden>
            <Icon size={16} strokeWidth={1.8} />
          </span>
          <div>
            <dt>{label}</dt>
            <dd className={label === "Availability" ? "is-live" : undefined}>
              {href ? <a href={href}>{value}</a> : value}
            </dd>
          </div>
        </div>
      ))}
    </dl>

    <a href="#experience" className="btn btn-outline btn-sm magnetic">
      See my journey
      <ArrowRight size={16} aria-hidden />
    </a>
  </section>
);

export default About;

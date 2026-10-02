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
import { btn, hoverKhaki, liveDot, ringIcon, span } from "@/lib/ui";
import { cn } from "@/lib/utils";

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
  <section
    id="about"
    className={cn("panel reveal flex flex-col items-start", span.half)}
    aria-labelledby="about-title"
  >
    <PanelHead icon={User} title="About Me" id="about-title" />

    <p className="max-w-[62ch] text-[15px] text-pretty text-fg-2">{profile.summary}</p>

    <dl className="mt-[clamp(20px,2.4vw,26px)] mb-[clamp(22px,2.6vw,28px)] grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-x-[22px] gap-y-[18px]">
      {FACTS.map(({ icon: Icon, label, value, href }) => (
        <div className="flex min-w-0 items-center gap-3" key={label}>
          <span className={cn(ringIcon, "size-9")} aria-hidden>
            <Icon size={16} strokeWidth={1.8} />
          </span>
          <div>
            <dt className="text-[12.5px] text-fg-3">{label}</dt>
            <dd
              className={cn(
                "text-[14.5px] font-medium wrap-anywhere text-fg-1",
                label === "Availability" && "flex items-center gap-2 text-leaf",
              )}
            >
              {label === "Availability" && <span className={liveDot} aria-hidden />}
              {href ? (
                <a href={href} className={hoverKhaki}>
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        </div>
      ))}
    </dl>

    <a href="#experience" className={btn("outline", "sm", "magnetic mt-auto")}>
      See my journey
      <ArrowRight size={16} aria-hidden />
    </a>
  </section>
);

export default About;

import { profile } from "@/data/profile";

import StatCounter from "./StatCounter";

const HIGHLIGHTS = [
  "Frontend developer focused on responsive, user-friendly interfaces",
  "React.js, Next.js and TypeScript for modern web applications",
  "Custom WordPress, Bricks Builder, Elementor and WooCommerce builds",
  "REST API integration and database-driven apps with PostgreSQL + Prisma",
  "Performance, SEO and cross-browser optimization as standard",
  `Studying B.Sc. in CSE — fluent in ${profile.languages.join(" and ")}`,
];

// TODO: adjust these to your real numbers before publishing.
export const STATS = [
  { count: 2, suffix: "+", label: "YEARS EXPERIENCE" },
  { count: 20, suffix: "+", label: "PROJECTS COMPLETED" },
  { count: 16, suffix: "", label: "TECHNOLOGIES USED" },
  { count: 100, suffix: "%", label: "CLIENT SATISFACTION" },
];

const About = () => {
  return (
    <section id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about-grid">
          <div>
            <p className="eyebrow reveal">
              <span className="num">01</span> {"// About Me"}
            </p>
            <h2 className="section-title reveal" id="about-title">
              Turning ideas into <span className="grad">real products</span>
            </h2>
            <p className="section-sub reveal">{profile.summary}</p>
          </div>

          <div>
            <div className="glass about-card reveal spotlight">
              <ul className="about-list">
                {HIGHLIGHTS.map((item) => (
                  <li key={item}>
                    <span className="ic" aria-hidden>
                      ▹
                    </span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="stats-grid">
              {STATS.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

"use client";

import { useEffect, useRef } from "react";

import { skillGroups } from "@/data/skills";
import { prefersReducedMotion } from "@/lib/motion";

const Skills = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Fill each bar to its level once its category card is in view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const fill = (card: Element) => {
      card.querySelectorAll<HTMLElement>(".skill-fill").forEach((bar) => {
        bar.style.width = `${bar.dataset.val}%`;
      });
    };

    if (prefersReducedMotion()) {
      grid.querySelectorAll(".skill-cat").forEach(fill);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          fill(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );

    grid.querySelectorAll<HTMLElement>(".skill-cat").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">
            <span className="num">02</span> {"// Skills"}
          </p>
          <h2 className="section-title" id="skills-title">
            Tools I build <span className="grad">with</span>
          </h2>
          <p className="section-sub">
            The languages, frameworks and platforms I reach for daily.
          </p>
        </div>

        <div className="skills-grid" id="skillsGrid" ref={gridRef}>
          {skillGroups.map((group) => (
            <div className="glass skill-cat reveal lift spotlight" key={group.cat}>
              <h3>{group.cat}</h3>
              <ul>
                {group.items.map(({ name, level }) => (
                  <li className="skill-item" key={name}>
                    <div className="skill-top">
                      <span>{name}</span>
                      <span>{level}%</span>
                    </div>
                    <div
                      className="skill-bar"
                      role="meter"
                      aria-label={name}
                      aria-valuenow={level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div className="skill-fill" data-val={level} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

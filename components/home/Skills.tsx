"use client";

import { Layers } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { skillGroups } from "@/data/skills";
import { prefersReducedMotion } from "@/lib/motion";

import PanelHead from "./PanelHead";
import TechIcon from "./TechIcon";

/**
 * One card, one group of bars at a time. Every group is rendered (inactive
 * ones `hidden`) so the bars are in the DOM for search and for the hooks.
 *
 * Bars carry their real width from the start and are scaled up from zero by a
 * CSS animation once the card is first in view (`data-filled`). A `hidden` panel
 * restarts that animation when it is shown, so switching tabs refills them.
 */
const Skills = () => {
  const [active, setActive] = useState(0);
  const [filled, setFilled] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setFilled(true);
        io.disconnect();
      },
      { threshold: prefersReducedMotion() ? 0 : 0.3 },
    );

    io.observe(card);
    return () => io.disconnect();
  }, []);

  /** Arrow keys move between tabs, as the ARIA tabs pattern expects. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = skillGroups.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="skills"
      ref={cardRef}
      // An attribute, not a class: re-rendering `className` would wipe the
      // `.in` that useReveal added and hide the panel again.
      className="panel reveal"
      data-filled={filled || undefined}
      aria-labelledby="skills-title"
    >
      <PanelHead icon={Layers} title="My Expertise" id="skills-title" />

      <div className="skill-tabs" role="tablist" aria-label="Skill groups" onKeyDown={onKeyDown}>
        {skillGroups.map((group, i) => (
          <button
            key={group.cat}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {group.cat}
          </button>
        ))}
      </div>

      {skillGroups.map((group, i) => (
        <ul
          key={group.cat}
          className="skill-list"
          role="tabpanel"
          id={`${uid}-panel-${i}`}
          aria-labelledby={`${uid}-tab-${i}`}
          hidden={i !== active}
        >
          {group.items.map(({ name, level, mark }) => (
            <li className="skill-item" key={name}>
              <span className="skill-name">
                <TechIcon mark={mark} size={15} />
                {name}
              </span>
              <span className="skill-pct">{level}%</span>
              <div
                className="skill-bar"
                role="meter"
                aria-label={name}
                aria-valuenow={level}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="skill-fill" style={{ width: `${level}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ))}
    </section>
  );
};

export default Skills;

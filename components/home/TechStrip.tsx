import { techStrip } from "@/data/skills";

import TechIcon from "./TechIcon";

/** The logos scrolling past between the hero and the first panels. */
const TechStrip = () => {
  // Doubled so the strip can loop by sliding exactly half its width.
  const strip = [...techStrip, ...techStrip];

  return (
    <div className="tech-strip" aria-label="Technologies I work with">
      <div className="tech-track-mask">
        <ul className="tech-track">
          {strip.map((skill, i) => (
            <li
              key={`${skill.name}-${i}`}
              aria-hidden={i >= techStrip.length || undefined}
            >
              <TechIcon mark={skill.mark} size={20} />
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TechStrip;

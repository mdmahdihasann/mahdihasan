import { techStrip } from "@/data/skills";

import TechIcon from "./TechIcon";

/** The logos scrolling past between the hero and the first panels. */
const TechStrip = () => {
  // Doubled so the strip can loop by sliding exactly half its width.
  const strip = [...techStrip, ...techStrip];

  return (
    <div
      className="relative z-2 pt-[clamp(18px,2.4vw,28px)] pb-[clamp(28px,3.6vw,44px)]"
      aria-label="Technologies I work with"
    >
      <div className="group/strip fade-edges-x overflow-hidden">
        <ul className="flex w-max animate-marquee gap-3 group-hover/strip:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-4">
          {strip.map((skill, i) => (
            <li
              key={`${skill.name}-${i}`}
              aria-hidden={i >= techStrip.length || undefined}
              className="group/tech flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-line bg-card py-[9px] pr-[17px] pl-[13px] text-[14px] font-medium text-fg-2 transition-[color,border-color] duration-300 hover:border-line-strong hover:text-fg-1 motion-reduce:aria-hidden:hidden"
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

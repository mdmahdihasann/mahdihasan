import {
  siBootstrap,
  siCss,
  siElementor,
  siGit,
  siHtml5,
  siJavascript,
  siLighthouse,
  siNextdotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siTailwindcss,
  siTypescript,
  siWoocommerce,
  siWordpress,
  type SimpleIcon,
} from "simple-icons";

/** A brand logo from simple-icons, or a short monogram when there isn't one. */
export type TechMark = SimpleIcon | { monogram: string };

export type Skill = { name: string; level: number; mark: TechMark };
export type SkillGroup = { cat: string; items: Skill[] };

/**
 * The skill list comes straight from the CV. The percentages are a visual
 * weighting only — tune them to how you actually rate yourself.
 *
 * Group sizes are kept close (4/4/4/3/3) on purpose: the five columns sit
 * side by side, so a lopsided group leaves a hole in the grid.
 */
export const skillGroups: SkillGroup[] = [
  {
    cat: "Frontend",
    items: [
      { name: "HTML5", level: 95, mark: siHtml5 },
      { name: "CSS3", level: 92, mark: siCss },
      { name: "JavaScript (ES6+)", level: 90, mark: siJavascript },
      { name: "TypeScript", level: 85, mark: siTypescript },
    ],
  },
  {
    cat: "Frameworks",
    items: [
      { name: "React.js", level: 88, mark: siReact },
      { name: "Next.js", level: 86, mark: siNextdotjs },
      { name: "Tailwind CSS", level: 92, mark: siTailwindcss },
      { name: "Bootstrap", level: 88, mark: siBootstrap },
    ],
  },
  {
    cat: "WordPress",
    items: [
      { name: "WordPress", level: 92, mark: siWordpress },
      { name: "Bricks Builder", level: 88, mark: { monogram: "B" } },
      { name: "Elementor", level: 87, mark: siElementor },
      { name: "WooCommerce", level: 85, mark: siWoocommerce },
    ],
  },
  {
    cat: "Backend & Data",
    items: [
      { name: "PostgreSQL", level: 80, mark: siPostgresql },
      { name: "Prisma ORM", level: 78, mark: siPrisma },
    ],
  },
  {
    cat: "Tools",
    items: [
      { name: "Git & GitHub", level: 88, mark: siGit },
      { name: "SEO", level: 85, mark: { monogram: "SEO" } },
      { name: "Performance", level: 84, mark: siLighthouse },
    ],
  },
];

/** The logos that scroll past in the strip under the hero. */
export const techStrip = skillGroups
  .flatMap((group) => group.items)
  .filter(
    (skill): skill is Skill & { mark: SimpleIcon } => "path" in skill.mark,
  );

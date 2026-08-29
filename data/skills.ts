export type Skill = { name: string; level: number };
export type SkillGroup = { cat: string; items: Skill[] };

/**
 * The skill list comes straight from the CV. The percentages are a visual
 * weighting only — tune them to how you actually rate yourself.
 *
 * Group sizes are kept close (4/4/4/3/3) on purpose: the five cards stretch to
 * the tallest one, so a lopsided group leaves dead space in its neighbours.
 */
export const skillGroups: SkillGroup[] = [
  {
    cat: "Frontend",
    items: [
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 92 },
      { name: "JavaScript (ES6+)", level: 90 },
      { name: "TypeScript", level: 85 },
    ],
  },
  {
    cat: "Frameworks",
    items: [
      { name: "React.js", level: 88 },
      { name: "Next.js", level: 86 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Bootstrap", level: 88 },
    ],
  },
  {
    cat: "WordPress",
    items: [
      { name: "WordPress", level: 92 },
      { name: "Bricks Builder", level: 88 },
      { name: "Elementor", level: 87 },
      { name: "WooCommerce", level: 85 },
    ],
  },
  {
    cat: "Backend & Data",
    items: [
      { name: "REST API", level: 86 },
      { name: "PostgreSQL", level: 80 },
      { name: "Prisma ORM", level: 78 },
    ],
  },
  {
    cat: "Tools",
    items: [
      { name: "Git & GitHub", level: 88 },
      { name: "SEO", level: 85 },
      { name: "Performance", level: 84 },
    ],
  },
];

export type TimelineEntry = {
  date: string;
  role: string;
  co: string;
  desc: string;
  /** Work and study are interleaved here, so each card says which it is. */
  kind: "work" | "education";
};

/**
 * Work history and education from the CV, newest first — the first entry is
 * rendered with the "current role" badge.
 */
export const experience: TimelineEntry[] = [
  {
    date: "Present",
    role: "Frontend Developer / Web Developer",
    co: "Client & Freelance Projects",
    kind: "work",
    desc: "Building responsive, modern web applications with React.js, Next.js and TypeScript, custom WordPress and WooCommerce sites, third-party API integrations, and PostgreSQL + Prisma back ends.",
  },
  {
    date: "2023 — 2026",
    role: "B.Sc. in Computer Science & Engineering",
    co: "Northern University Bangladesh",
    kind: "education",
    desc: "Studying computer science alongside client work — data structures, databases and software engineering feeding directly into how I build for the web.",
  },
  {
    date: "2019 — 2022",
    role: "Diploma in Computer Science",
    co: "Bhola Polytechnic Institute",
    kind: "education",
    desc: "Where the foundation was laid: programming fundamentals, web technologies and the first sites I ever shipped.",
  },
];

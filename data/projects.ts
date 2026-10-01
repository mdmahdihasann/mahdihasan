import type { ThumbVariant } from "@/components/home/ProjectThumb";

export type Project = {
  name: string;
  desc: string;
  tech: string[];
  /** Arguments passed to `linear-gradient()` behind the card artwork. */
  gradient: string;
  /** Which inline-SVG mockup to draw. Ignored when `image` is set. */
  thumb: ThumbVariant;
  /** Optional real screenshot in public/, e.g. "/projects/shop.png". */
  image?: string;
  demo?: string;
  repo?: string;
};

/**
 * ⚠️ PLACEHOLDER CONTENT — the CV lists no projects, so these are examples
 * shaped around the CV's stack, not real work. Replace every entry (and add
 * `demo` / `repo` links) before putting the site in front of anyone.
 */
export const projects: Project[] = [
  {
    name: "E-commerce Storefront",
    desc: "WooCommerce store with custom product features, a streamlined checkout and third-party integrations.",
    tech: ["WordPress", "WooCommerce", "PHP", "Custom CSS"],
    gradient: "135deg,#3f6b4f,#a9c6a2",
    thumb: "storefront",
  },
  {
    name: "Business Website",
    desc: "Custom WordPress site built in Bricks Builder, tuned for Core Web Vitals and easy self-service editing.",
    tech: ["WordPress", "Bricks Builder", "SEO"],
    gradient: "135deg,#5b6a3a,#d9d2a3",
    thumb: "cms",
  },
  {
    name: "Next.js Dashboard",
    desc: "Database-driven admin dashboard with typed data access and server-rendered pages.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    gradient: "135deg,#24402f,#7aa883",
    thumb: "dashboard",
  },
  {
    name: "React Web App",
    desc: "Component-driven single page application consuming a REST API, with reusable UI built from scratch.",
    tech: ["React.js", "REST API", "Tailwind CSS"],
    gradient: "135deg,#8f9156,#3f6b4f",
    thumb: "app",
  },
  {
    name: "Landing Page",
    desc: "Conversion-focused landing page: responsive down to small screens and fast on a slow connection.",
    tech: ["HTML5", "Tailwind CSS", "JavaScript"],
    gradient: "135deg,#7aa883,#5b6a3a",
    thumb: "landing",
  },
  {
    name: "Elementor Portfolio",
    desc: "Portfolio site for a client, assembled in Elementor with custom CSS and on-page SEO.",
    tech: ["WordPress", "Elementor", "SEO"],
    gradient: "135deg,#c9c08a,#24402f",
    thumb: "portfolio",
  },
];

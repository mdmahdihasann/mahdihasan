import {
  Code2,
  Gauge,
  LayoutTemplate,
  MonitorSmartphone,
  ShoppingBag,
  Webhook,
  type LucideIcon,
} from "lucide-react";

export type Service = { icon: LucideIcon; name: string; desc: string };

/** Drawn from the responsibilities listed on the CV. */
export const services: Service[] = [
  {
    icon: Code2,
    name: "Frontend Development",
    desc: "Responsive, modern and user-friendly interfaces built with React.js, Next.js, TypeScript and clean, reusable components.",
  },
  {
    icon: LayoutTemplate,
    name: "WordPress Development",
    desc: "Custom WordPress sites with Bricks Builder, Elementor and hand-written CSS — built to be fast and easy to update.",
  },
  {
    icon: ShoppingBag,
    name: "WooCommerce Stores",
    desc: "Online stores with product features, checkout flows, forms and the custom integrations your business actually needs.",
  },
  {
    icon: MonitorSmartphone,
    name: "Responsive UI Design",
    desc: "Layouts that hold up on every screen, built with Tailwind CSS and Bootstrap and tested across browsers.",
  },
  {
    icon: Webhook,
    name: "API Integration",
    desc: "Third-party REST API integration and database-driven applications backed by PostgreSQL and Prisma.",
  },
  {
    icon: Gauge,
    name: "SEO & Optimization",
    desc: "Performance, responsiveness, SEO and cross-browser fixes — plus troubleshooting hosting, DNS and integration issues.",
  },
];

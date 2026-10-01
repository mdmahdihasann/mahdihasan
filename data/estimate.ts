/**
 * Inputs for the project timeline estimator (`components/home/Estimate.tsx`).
 * Day counts are working days and are Mahdi's own rule-of-thumb weightings,
 * not quotes — the panel says so. There are deliberately no prices here.
 */

export type ProjectKind = {
  id: string;
  label: string;
  hint: string;
  /** Working days for the smallest version of this kind of project. */
  baseDays: number;
  /** Pages (or screens) the base days already cover. */
  includedPages: number;
  /** Working days each page beyond `includedPages` adds. */
  perPageDays: number;
  /** What one "page" is called for this kind. */
  unit: "page" | "screen";
};

export const projectKinds: ProjectKind[] = [
  { id: "landing", label: "Landing page", hint: "One page that sells one thing", baseDays: 4, includedPages: 1, perPageDays: 1.5, unit: "page" },
  { id: "business", label: "Business website", hint: "Company, agency or personal site", baseDays: 8, includedPages: 5, perPageDays: 1, unit: "page" },
  { id: "store", label: "Online store", hint: "WooCommerce or a custom shop", baseDays: 15, includedPages: 6, perPageDays: 1, unit: "page" },
  { id: "webapp", label: "Web app", hint: "Dashboard, portal or SaaS in Next.js", baseDays: 20, includedPages: 6, perPageDays: 1.5, unit: "screen" },
  { id: "redesign", label: "Redesign", hint: "Make an existing site modern and fast", baseDays: 6, includedPages: 5, perPageDays: 0.75, unit: "page" },
];

export const stacks = ["Next.js / React", "WordPress", "Not sure yet"] as const;

export type Feature = { id: string; label: string; days: number };

export const features: Feature[] = [
  { id: "cms", label: "Blog or CMS", days: 3 },
  { id: "payments", label: "Online payments", days: 4 },
  { id: "auth", label: "User accounts & login", days: 5 },
  { id: "dashboard", label: "Admin dashboard", days: 6 },
  { id: "api", label: "API integration", days: 4 },
  { id: "bilingual", label: "Bangla + English", days: 3 },
  { id: "seo", label: "SEO setup", days: 2 },
  { id: "motion", label: "Custom animations", days: 3 },
];

/** Extra planning days when the copy still has to be written. */
export const CONTENT_HELP_DAYS = 3;

export const PAGE_RANGE = { min: 1, max: 30 } as const;

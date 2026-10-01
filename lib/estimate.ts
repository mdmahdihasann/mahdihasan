import { CONTENT_HELP_DAYS, features, type ProjectKind } from "@/data/estimate";

export const PHASES = ["Discover", "Plan", "Design", "Develop", "Test", "Launch"] as const;
export type Phase = (typeof PHASES)[number];

/**
 * How each source of work spreads across the six process phases. Every row
 * sums to 1, so the phase days always add up to the total.
 */
const SPLIT: Record<"base" | "pages" | "features" | "content", Record<Phase, number>> = {
  base: { Discover: 0.08, Plan: 0.12, Design: 0.25, Develop: 0.38, Test: 0.1, Launch: 0.07 },
  pages: { Discover: 0, Plan: 0, Design: 0.45, Develop: 0.45, Test: 0.1, Launch: 0 },
  features: { Discover: 0, Plan: 0, Design: 0.15, Develop: 0.7, Test: 0.15, Launch: 0 },
  content: { Discover: 0.3, Plan: 0.7, Design: 0, Develop: 0, Test: 0, Launch: 0 },
};

/** Upper bound of the range, as a multiple of the expected days. */
const SPREAD = 1.3;

export type EstimateInput = {
  kind: ProjectKind;
  pages: number;
  featureIds: string[];
  needsContent: boolean;
};

export type Estimate = {
  /** Expected working days, unrounded — what the phases add up to. */
  days: number;
  low: number;
  high: number;
  /** "8–11 working days" or "3–4 weeks". */
  label: string;
  phases: { name: Phase; days: number }[];
};

export function estimate({ kind, pages, featureIds, needsContent }: EstimateInput): Estimate {
  const sources = {
    base: kind.baseDays,
    pages: Math.max(0, pages - kind.includedPages) * kind.perPageDays,
    features: features
      .filter((f) => featureIds.includes(f.id))
      .reduce((sum, f) => sum + f.days, 0),
    content: needsContent ? CONTENT_HELP_DAYS : 0,
  };

  const phases = PHASES.map((name) => ({
    name,
    days: (Object.keys(sources) as (keyof typeof sources)[]).reduce(
      (sum, source) => sum + sources[source] * SPLIT[source][name],
      0,
    ),
  }));

  const days = phases.reduce((sum, p) => sum + p.days, 0);
  const low = Math.max(1, Math.round(days));
  const high = Math.max(low + 1, Math.round(days * SPREAD));

  return { days, low, high, label: formatRange(low, high), phases };
}

/** Short jobs read in days; anything past two working weeks reads in weeks. */
export function formatRange(low: number, high: number) {
  if (high <= 10) return `${low}–${high} working days`;
  const from = Math.max(1, Math.round(low / 5));
  const to = Math.max(from, Math.ceil(high / 5));
  return from === to ? `About ${from} weeks` : `${from}–${to} weeks`;
}

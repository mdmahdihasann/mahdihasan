import { describe, expect, it } from "vitest";

import { projectKinds } from "@/data/estimate";
import { estimate, formatRange, PHASES } from "@/lib/estimate";

const kind = (id: string) => projectKinds.find((k) => k.id === id)!;

describe("estimate", () => {
  it("spreads the work over the six process phases, which add up to the total", () => {
    const r = estimate({ kind: kind("business"), pages: 9, featureIds: ["cms", "seo"], needsContent: true });
    expect(r.phases.map((p) => p.name)).toEqual([...PHASES]);
    const sum = r.phases.reduce((s, p) => s + p.days, 0);
    expect(sum).toBeCloseTo(r.days, 6);
    // 8 base + 4 extra pages + 5 feature days + 3 content days.
    expect(r.days).toBeCloseTo(20, 6);
  });

  it("only charges for pages beyond the ones the base covers", () => {
    const small = estimate({ kind: kind("business"), pages: 1, featureIds: [], needsContent: false });
    const covered = estimate({ kind: kind("business"), pages: 5, featureIds: [], needsContent: false });
    expect(small.days).toBe(covered.days);
  });

  it("grows with every feature picked", () => {
    const base = estimate({ kind: kind("webapp"), pages: 6, featureIds: [], needsContent: false });
    const more = estimate({ kind: kind("webapp"), pages: 6, featureIds: ["auth", "dashboard"], needsContent: false });
    expect(more.days - base.days).toBeCloseTo(11, 6);
    expect(more.high).toBeGreaterThan(more.low);
  });

  it("reads short jobs in days and longer ones in weeks", () => {
    expect(formatRange(4, 6)).toBe("4–6 working days");
    expect(formatRange(20, 26)).toBe("4–6 weeks");
    expect(formatRange(10, 13)).toBe("2–3 weeks");
  });
});

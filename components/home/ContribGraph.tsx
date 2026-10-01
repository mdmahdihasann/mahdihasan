"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { ContribDay } from "@/lib/server/github";

/** UTC on both sides of hydration, so server and browser print the same date. */
const longDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthName = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

const asDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

export const describeDay = (d: ContribDay) =>
  `${d.count === 0 ? "No" : d.count} contribution${d.count === 1 ? "" : "s"} on ${longDate.format(asDate(d.date))}`;

/**
 * The year as GitHub draws it: one column per week, Sunday on top. Pointing
 * at a day reads it out underneath; on narrow screens the strip scrolls and
 * starts at the most recent week.
 */
const ContribGraph = ({ weeks, total }: { weeks: ContribDay[][]; total: number }) => {
  const [hovered, setHovered] = useState<ContribDay | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  // A month label sits over the first week that starts in that month. When two
  // land too close to fit (a sliver of a month at the start), the later wins.
  const months: { w: number; label: string }[] = [];
  weeks.forEach((week, w) => {
    const month = asDate(week[0].date).getUTCMonth();
    const prev = w > 0 ? asDate(weeks[w - 1][0].date).getUTCMonth() : -1;
    if (month === prev) return;
    const last = months[months.length - 1];
    if (last && w - last.w < 3) months.pop();
    months.push({ w, label: monthName.format(asDate(week[0].date)) });
  });

  return (
    <div className="gh-graph-wrap">
      <div className="gh-scroll" ref={scrollRef}>
        <div
          className="gh-graph"
          role="img"
          aria-label={`Contribution calendar: ${total} contributions in the last year`}
          style={{ "--weeks": weeks.length } as CSSProperties}
          onMouseLeave={() => setHovered(null)}
        >
          {months.map(({ w, label }) => (
            <span key={`m-${w}`} className="gh-month" style={{ gridColumn: w + 1 }} aria-hidden>
              {label}
            </span>
          ))}
          {weeks.map((week, w) =>
            week.map((day) => (
              <span
                key={day.date}
                className="gh-day"
                data-level={day.level}
                style={
                  {
                    gridColumn: w + 1,
                    gridRow: asDate(day.date).getUTCDay() + 2,
                    "--w": w,
                  } as CSSProperties
                }
                onMouseEnter={() => setHovered(day)}
              />
            )),
          )}
        </div>
      </div>

      <div className="gh-graph-foot">
        <p className="gh-readout" aria-hidden>
          {hovered ? describeDay(hovered) : "Point at a day to see what happened"}
        </p>
        <div className="gh-legend" aria-hidden>
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="gh-day" data-level={l} />
          ))}
          More
        </div>
      </div>
    </div>
  );
};

export default ContribGraph;

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { ContribDay } from "@/lib/server/github";
import { cn } from "@/lib/utils";

/** One square of the calendar, shaded by its contribution level (0–4). */
const dayCell =
  "aspect-square rounded-[3px] bg-fg-1/6 data-[level='1']:bg-leaf/26 data-[level='2']:bg-leaf/48 data-[level='3']:bg-leaf/74 data-[level='4']:bg-leaf";

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
    <div>
      <div
        className="overflow-x-auto pb-1.5 [scrollbar-color:var(--color-olive)_transparent] [scrollbar-width:thin]"
        ref={scrollRef}
      >
        <div
          className="grid min-w-[calc(var(--weeks)*13px)] grid-cols-[repeat(var(--weeks),minmax(10px,1fr))] gap-[3px]"
          role="img"
          aria-label={`Contribution calendar: ${total} contributions in the last year`}
          style={{ "--weeks": weeks.length } as CSSProperties}
          onMouseLeave={() => setHovered(null)}
        >
          {months.map(({ w, label }) => (
            <span key={`m-${w}`} className="row-start-1 pb-[3px] text-[11px] whitespace-nowrap text-fg-3" style={{ gridColumn: w + 1 }} aria-hidden>
              {label}
            </span>
          ))}
          {weeks.map((week, w) =>
            week.map((day) => (
              <span
                key={day.date}
                className={cn(
                  dayCell,
                  "outline outline-offset-1 outline-transparent transition-[outline-color] duration-150 hover:outline-khaki",
                  // The year sweeps in week by week, oldest first.
                  "revealed:animate-[dayIn_.5s_var(--ease-spring)_calc(.15s_+_var(--w)*11ms)_backwards]",
                )}
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

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <p className="min-h-[1.6em] text-[13px] text-fg-2 tabular-nums" aria-hidden>
          {hovered ? describeDay(hovered) : "Point at a day to see what happened"}
        </p>
        <div className="flex items-center gap-1 text-[12px] text-fg-3" aria-hidden>
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className={cn(dayCell, "w-[11px] first-of-type:ml-1 last-of-type:mr-1")}
              data-level={l}
            />
          ))}
          More
        </div>
      </div>
    </div>
  );
};

export default ContribGraph;

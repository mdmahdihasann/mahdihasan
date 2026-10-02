import { experience } from "@/data/experience";
import { cn } from "@/lib/utils";

const KIND_LABEL = { work: "Work", education: "Education" } as const;

/**
 * Work and study on one rail down the left, newest first. The first entry is
 * the current role and gets the live node.
 */
const Timeline = () => (
  <ol className="relative">
    {experience.map((entry, i) => {
      const isCurrent = i === 0;

      return (
        <li
          data-kind={entry.kind}
          data-current={isCurrent || undefined}
          className={cn(
            "relative pb-[22px] pl-[30px] last:pb-0",
            // Rail from this node down to the next one; nothing hangs off the last.
            "before:absolute before:top-3.5 before:-bottom-1.5 before:left-1.5 before:w-px before:bg-[linear-gradient(180deg,rgba(217,210,163,.5),rgba(169,198,162,.25))] last:before:content-none",
          )}
          key={entry.role + entry.date}
        >
          <span
            className={cn(
              "absolute top-1.5 left-0 size-[13px] rounded-full border-2 bg-bg-deep",
              isCurrent
                ? "border-leaf bg-leaf shadow-[0_0_0_4px_rgba(155,209,139,.15),0_0_14px_rgba(155,209,139,.5)]"
                : entry.kind === "work"
                  ? "border-khaki"
                  : "border-sage",
            )}
            aria-hidden
          />
          <div className="mb-2 flex items-center justify-between gap-3">
            <p
              data-slot="tl-chip"
              data-current={isCurrent || undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[12px] font-semibold whitespace-nowrap",
                isCurrent
                  ? "border-leaf/32 bg-leaf/10 text-leaf"
                  : "border-sage/28 bg-sage/10 text-sage",
              )}
            >
              {isCurrent && <span className="size-1.5 rounded-full bg-leaf" aria-hidden />}
              {isCurrent ? "Current role" : KIND_LABEL[entry.kind]}
            </p>
            <p className="text-[12.5px] whitespace-nowrap text-fg-3 tabular-nums">{entry.date}</p>
          </div>
          <h3 className="text-[16.5px] leading-[1.3] text-balance">{entry.role}</h3>
          <p className="mt-0.5 mb-1.5 text-[13.5px] font-medium text-khaki">{entry.co}</p>
          <p className="text-[14px] text-pretty text-fg-2">{entry.desc}</p>
        </li>
      );
    })}
  </ol>
);

export default Timeline;

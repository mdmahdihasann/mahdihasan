import { experience } from "@/data/experience";

const KIND_LABEL = { work: "Work", education: "Education" } as const;

/**
 * Work and study on one rail down the left, newest first. The first entry is
 * the current role and gets the live node.
 */
const Timeline = () => (
  <ol className="timeline">
    {experience.map((entry, i) => {
      const isCurrent = i === 0;

      return (
        <li
          className={`tl-item ${entry.kind}${isCurrent ? " current" : ""}`}
          key={entry.role + entry.date}
        >
          <span className="tl-node" aria-hidden />
          <div className="tl-head">
            <p className={`tl-chip ${entry.kind}${isCurrent ? " current" : ""}`}>
              {isCurrent && <span className="dot" aria-hidden />}
              {isCurrent ? "Current role" : KIND_LABEL[entry.kind]}
            </p>
            <p className="tl-date">{entry.date}</p>
          </div>
          <h3>{entry.role}</h3>
          <p className="co">{entry.co}</p>
          <p className="tl-desc">{entry.desc}</p>
        </li>
      );
    })}
  </ol>
);

export default Timeline;

import { experience } from "@/data/experience";

const KIND_LABEL = { work: "Work", education: "Education" } as const;

/**
 * Alternating left/right career timeline. The first entry is the current role.
 *
 * The reveal sits on the card and the node, not on the row: the row draws the
 * rail segment down to the next node, and a row that slid in on scroll would
 * drag the rail sideways with it.
 */
const Timeline = () => {
  const total = experience.length;

  return (
    <ol className="timeline" id="timeline">
      {experience.map((entry, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        const isCurrent = i === 0;

        return (
          <li
            className={`tl-item ${side}`}
            key={entry.role + entry.date}
          >
            <div className="tl-card-wrap">
              <article className="glass tl-card reveal lift spotlight">
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
              </article>
            </div>

            <div className="tl-node" aria-hidden>
              <div
                className={`tl-node-inner reveal-scale ${entry.kind}${
                  isCurrent ? " current" : ""
                }`}
              >
                {String(total - i).padStart(2, "0")}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;

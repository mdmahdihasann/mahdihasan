"use client";

import { useCallback, useEffect, useState } from "react";

import { testimonials } from "@/data/testimonials";

const AUTOPLAY_MS = 4500;
const COUNT = testimonials.length;

/** Which stage position a card sits in, relative to the active index. */
function stageClass(index: number, active: number) {
  const diff = (index - active + COUNT) % COUNT;
  if (diff === 0) return "state-active";
  if (diff === COUNT - 1) return "state-prev";
  if (diff === 1) return "state-next";
  return "state-hidden";
}

const Testimonials = () => {
  const [active, setActive] = useState(0);
  // Bumped on every manual interaction to restart the autoplay timer.
  const [tick, setTick] = useState(0);

  const go = useCallback((next: number) => {
    setActive((next + COUNT) % COUNT);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setActive((current) => (current + 1) % COUNT),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [tick]);

  return (
    <section id="testimonials">
      <div className="wrap">
        <div
          className="section-head reveal"
          style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
        >
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            <span className="num">06</span> {"// Kind Words"}
          </div>
          <h2 className="section-title">
            Client <span className="grad">Testimonials</span>
          </h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            What people say after we&apos;ve shipped something together.
          </p>
        </div>

        <div className="testi-stage-wrap reveal">
          <button
            type="button"
            className="testi-arrow prev-arrow"
            id="testiPrev"
            aria-label="Previous testimonial"
            onClick={() => go(active - 1)}
          >
            ‹
          </button>

          <div className="testi-stage" id="testiStage">
            {testimonials.map((t, i) => (
              <div
                className={`glass testi-card2 ${stageClass(i, active)}`}
                key={t.name}
                aria-hidden={i !== active}
              >
                <div className="testi-quote-mark">&ldquo;</div>
                <p className="testi-quote">{t.quote}</p>
                <div className="testi-avatar">{t.initials}</div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="testi-arrow next-arrow"
            id="testiNext"
            aria-label="Next testimonial"
            onClick={() => go(active + 1)}
          >
            ›
          </button>

          <div className="testi-dots" id="testiDots">
            {testimonials.map((t, i) => (
              <button
                type="button"
                key={t.name}
                className={i === active ? "active" : undefined}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

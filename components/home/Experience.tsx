import Timeline from "./Timeline";

const Experience = () => {
  return (
    <section id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">
            <span className="num">04</span> {"// Journey"}
          </p>
          <h2 className="section-title" id="experience-title">
            Experience <span className="grad">Timeline</span>
          </h2>
          <p className="section-sub">
            Where I&apos;ve worked and what I&apos;ve built along the way.
          </p>
        </div>

        <Timeline />
      </div>
    </section>
  );
};

export default Experience;

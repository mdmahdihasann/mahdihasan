import { profile } from "@/data/profile";

import CodeEditor from "./CodeEditor";

/** Short proof points under the buttons — the CV's headline facts. */
const META = [profile.location, profile.languages.join(" · "), "B.Sc. CSE"];

const Hero = () => {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div>
          <p className="hero-eyebrow reveal">
            <span className="dot" />
            {profile.availability.toUpperCase()}
          </p>

          <h1 className="reveal" id="hero-title">
            <span className="hi">Hi, I&apos;m</span>
            <span className="name">{profile.name}</span>
          </h1>

          <p className="hero-role reveal">
            {profile.role}
            <span className="cursor" aria-hidden />
          </p>

          <p className="hero-desc reveal">{profile.tagline}</p>

          <div className="hero-btns reveal">
            <a href="#projects" className="btn btn-primary magnetic">
              View Projects
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="btn btn-outline magnetic"
            >
              Download Resume
            </a>
            <a href="#contact" className="btn btn-outline magnetic">
              Contact Me
            </a>
          </div>

          <ul className="hero-meta reveal">
            {META.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <CodeEditor />
      </div>

      <div className="scroll-indicator" aria-hidden>
        <span>SCROLL</span>
        <div className="line" />
      </div>
    </section>
  );
};

export default Hero;

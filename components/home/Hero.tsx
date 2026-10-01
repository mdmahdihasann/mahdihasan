import { ArrowRight, Code2, MessageCircle } from "lucide-react";

import { profile } from "@/data/profile";
import { stats } from "@/data/stats";

import HeroPortrait from "./HeroPortrait";
import RoleCycler from "./RoleCycler";
import Socials from "./Socials";
import StatCounter from "./StatCounter";

/** What the coloured middle line of the headline types out, one after another. */
const BUILDS = ["Websites", "Web apps", "Stores", "Dashboards"];

/** The three stat cards stacked down the portrait's right edge. */
const HERO_STATS = [stats[0], stats[1], stats[3]];

/** The floating chip over the portrait: what he builds with. */
const STACK = ["React & Next.js", "WordPress & Bricks", "WooCommerce"];

/**
 * Text on the left, the portrait on the right in front of a lit sphere, with
 * stat cards and a stack chip floating over it. The page-load sequence is pure
 * CSS — see the HERO block in globals.css — so nothing here is a `.reveal`.
 */
const Hero = () => (
  <section className="hero" id="home" aria-labelledby="hero-title">
    <div className="wrap hero-stage">
      <div className="hero-copy">
        <p className="hero-status">
          <span className="dot" aria-hidden />
          {profile.availability}
        </p>

        <h1 id="hero-title">
          <span className="line">
            <span>I build</span>
          </span>{" "}
          <span className="line">
            <RoleCycler words={BUILDS} />
          </span>{" "}
          <span className="line">
            <span>that perform.</span>
          </span>
        </h1>

        <p className="hero-desc">
          I&apos;m <strong>{profile.name}</strong>, a {profile.role.toLowerCase()}{" "}
          in Dhaka. {profile.tagline}
        </p>

        <div className="hero-btns">
          <a href="#projects" className="btn btn-primary magnetic">
            View Projects
            <ArrowRight size={17} aria-hidden />
          </a>
          <a href="#contact" className="btn btn-outline magnetic">
            Contact Me
            <MessageCircle size={17} aria-hidden />
          </a>
        </div>

        <div className="hero-foot">
          <Socials compact />
          <a href={profile.resumeUrl} download className="hero-resume">
            Download Resume
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <HeroPortrait name={profile.name} />

        <div className="hero-stats">
          {HERO_STATS.map(({ icon: Icon, ...stat }) => (
            <StatCounter key={stat.label} {...stat} icon={<Icon size={20} />} />
          ))}
        </div>

        <div className="hero-chip">
          <span className="chip-icon" aria-hidden>
            <Code2 size={22} />
          </span>
          <ul>
            {STACK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="chip-live" aria-hidden />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

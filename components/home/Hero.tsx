import { ArrowRight, Code2, MessageCircle } from "lucide-react";

import { profile } from "@/data/profile";
import { stats } from "@/data/stats";
import { btn, floatingPane, khakiTile, liveDot, wrap } from "@/lib/ui";
import { cn } from "@/lib/utils";

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

/** Each headline line is its own mask; the inner span slides up through it. */
const line = "block overflow-hidden pb-[.07em]";

/**
 * Text on the left, the portrait on the right in front of a lit sphere, with
 * stat cards and a stack chip floating over it. One load sequence, all CSS
 * animation delays, so nothing here is a `.reveal`:
 *   0ms    the sphere blooms
 *   150ms  the portrait rises into it
 *   250ms  the headline lines slide up out of their masks
 *   700ms  copy, buttons and the floating cards settle in
 * After that the only motion is the orbit on the ring and the typing.
 * Phones put the portrait above the copy.
 */
const Hero = () => (
  <section
    className="relative z-2 isolate flex min-h-svh flex-col justify-end overflow-hidden"
    id="home"
    aria-labelledby="hero-title"
  >
    <div
      className={cn(
        wrap,
        "grid min-h-svh grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] items-end gap-x-[clamp(16px,3vw,48px)] pt-(--nav-h)",
        "max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:gap-y-[clamp(8px,3vw,24px)] max-[900px]:pt-[calc(var(--nav-h)_+_28px)]",
        "max-[600px]:gap-y-0 max-[600px]:pt-[calc(var(--nav-h)_+_4px)]",
      )}
    >
      <div className="relative z-3 self-center-safe pt-[clamp(16px,4svh,48px)] pb-[clamp(28px,6svh,72px)] max-[900px]:p-0 max-[600px]:pt-[18px] max-[600px]:pb-7">
        <p className="inline-flex animate-[fadeIn_.8s_var(--ease-smooth)_.2s_both] items-center gap-2.5 rounded-full border border-sage/22 bg-sage/8 py-[7px] pr-4 pl-3 text-[13.5px] font-medium text-fg-1">
          <span className={cn(liveDot, "size-2")} aria-hidden />
          {profile.availability}
        </p>

        <h1
          id="hero-title"
          className="mt-[clamp(16px,2.6svh,30px)] text-[clamp(44px,min(5.6vw,10.5svh),88px)] leading-[.98] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_96] max-[600px]:mt-4 max-[600px]:text-[clamp(40px,12.4vw,52px)]"
        >
          <span className={line}>
            <span className="block animate-[lineUp_1.1s_var(--ease-smooth)_.25s_both]">I build</span>
          </span>{" "}
          <span className={line}>
            <RoleCycler words={BUILDS} />
          </span>{" "}
          <span className={line}>
            <span className="block animate-[lineUp_1.1s_var(--ease-smooth)_.47s_both]">
              that perform.
            </span>
          </span>
        </h1>

        <p className="mt-[clamp(16px,2.6svh,28px)] mb-[clamp(20px,3.6svh,36px)] max-w-[50ch] animate-[fadeUp_1s_var(--ease-smooth)_.7s_both] text-[clamp(15px,1.15vw,16.5px)] text-pretty text-fg-2 max-[600px]:mt-4 max-[600px]:mb-[22px] max-[600px]:text-[15px]">
          I&apos;m <strong className="font-semibold text-fg-1">{profile.name}</strong>, a{" "}
          {profile.role.toLowerCase()} in Dhaka. {profile.tagline}
        </p>

        <div className="flex animate-[fadeUp_1s_var(--ease-smooth)_.8s_both] flex-wrap gap-3">
          <a
            href="#projects"
            className={btn("primary", "md", "magnetic rounded-[14px] max-[620px]:flex-1")}
          >
            View Projects
            <ArrowRight size={17} aria-hidden />
          </a>
          <a
            href="#contact"
            className={btn("outline", "md", "magnetic rounded-[14px] bg-fg-1/3 max-[620px]:flex-1")}
          >
            Contact Me
            <MessageCircle size={17} aria-hidden />
          </a>
        </div>

        <div className="mt-[clamp(18px,3svh,32px)] flex animate-[fadeIn_1s_var(--ease-smooth)_.95s_both] flex-wrap items-center gap-x-[22px] gap-y-3.5 max-[600px]:gap-x-[18px] max-[600px]:gap-y-3">
          {/* Square tiles here, round everywhere else. */}
          <Socials compact iconClassName="rounded-xl bg-fg-1/3" />
          <a
            href={profile.resumeUrl}
            download
            className="text-[14px] font-medium text-fg-2 underline decoration-fg-1/25 underline-offset-[5px] transition-[color,text-decoration-color] duration-[250ms] hover:text-fg-1 hover:decoration-khaki"
          >
            Download Resume
          </a>
        </div>
      </div>

      <div className="relative flex min-h-[min(calc(100svh_-_var(--nav-h)),760px)] items-end justify-center self-stretch max-[900px]:min-h-0 max-[900px]:flex-col max-[900px]:items-center max-[600px]:-order-1">
        <HeroPortrait name={profile.name} />

        <div
          className={cn(
            "absolute top-[clamp(20px,7%,72px)] right-0 z-2 flex w-[clamp(150px,13vw,178px)] animate-[fadeUp_1s_var(--ease-smooth)_.85s_both] flex-col gap-3.5",
            "[&>:nth-child(2)]:mr-[clamp(12px,1.6vw,24px)] max-[1100px]:[&>:nth-child(2)]:mr-0",
            // Stacked: the stats become a row under the portrait.
            "max-[900px]:relative max-[900px]:top-auto max-[900px]:right-auto max-[900px]:-mt-[14%] max-[900px]:mb-[clamp(40px,10vw,72px)] max-[900px]:w-full max-[900px]:max-w-[520px] max-[900px]:flex-row max-[900px]:gap-2.5",
            "max-[600px]:-mt-[16%] max-[600px]:mb-1.5 max-[600px]:gap-2",
          )}
        >
          {HERO_STATS.map(({ icon: Icon, ...stat }) => (
            <StatCounter key={stat.label} {...stat} icon={<Icon size={17} />} variant="hero" />
          ))}
        </div>

        <div
          className={cn(
            floatingPane,
            "absolute bottom-[clamp(40px,12%,110px)] left-[clamp(0px,4%,40px)] z-2 flex animate-[fadeUp_1s_var(--ease-smooth)_1s_both] items-center gap-4 py-4 pr-[22px] pl-[18px]",
            "max-[900px]:top-[12%] max-[900px]:bottom-auto max-[900px]:left-0 max-[900px]:gap-3 max-[900px]:py-3 max-[900px]:pr-4 max-[900px]:pl-3 max-[480px]:hidden",
          )}
        >
          <span
            className={cn(khakiTile, "size-11 rounded-xl bg-khaki/10 max-[900px]:size-9")}
            aria-hidden
          >
            <Code2 size={22} />
          </span>
          <ul className="grid gap-[3px] text-[13.5px] text-fg-1 max-[900px]:text-[12.5px]">
            {STACK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className={cn(liveDot, "absolute top-3 right-3")} aria-hidden />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

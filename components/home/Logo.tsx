import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Plain text instead of a home link (the menu sheet, which has its own). */
  decorative?: boolean;
};

/** The wordmark, used by the nav, the phone menu sheet and the footer. */
const Logo = ({ className, decorative = false }: LogoProps) => {
  const classes = cn(
    "font-display text-[21px] font-extrabold tracking-[-0.03em] whitespace-nowrap text-fg-1",
    className,
  );
  const mark = (
    <>
      {profile.logo.text}
      <span className="text-khaki">{profile.logo.accent}</span>
    </>
  );

  return decorative ? (
    <span className={classes} aria-hidden>
      {mark}
    </span>
  ) : (
    <a href="#home" className={classes} aria-label={`${profile.name}, home`}>
      {mark}
    </a>
  );
};

export default Logo;

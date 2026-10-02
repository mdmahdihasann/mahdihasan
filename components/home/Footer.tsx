import { profile } from "@/data/profile";
import { hoverKhaki, wrap } from "@/lib/ui";
import { cn } from "@/lib/utils";

import Logo from "./Logo";

const FOOTER_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

/** One quiet row: logo, copyright, links. */
const Footer = () => (
  <footer className="relative z-2 pt-[clamp(18px,2.4vw,28px)] pb-[clamp(22px,3vw,34px)] max-[960px]:pb-[calc(104px_+_env(safe-area-inset-bottom))]">
    <div
      className={cn(
        wrap,
        "flex flex-wrap items-center justify-between gap-x-7 gap-y-4 border-t border-line pt-[clamp(18px,2.4vw,26px)] max-[700px]:justify-center max-[700px]:text-center",
      )}
    >
      <Logo />

      <p className="text-[13.5px] text-fg-3">
        © {new Date().getFullYear()} {profile.name}. Designed and built in Dhaka.
      </p>

      <ul className="flex flex-wrap gap-6 text-[14px] text-fg-2">
        {FOOTER_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className={hoverKhaki}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;

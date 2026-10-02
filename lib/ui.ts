import { cn } from "@/lib/utils";

/**
 * Tailwind class strings shared by more than one section. Section-specific
 * styling stays inline in each component; these are the site's vocabulary.
 */

/** Page container. */
export const wrap = "mx-auto w-full max-w-[1320px] px-[clamp(20px,4vw,32px)] max-[600px]:px-3.5";

type BtnVariant = "primary" | "outline" | "ghost";
type BtnSize = "md" | "sm";

const BTN_BASE =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-body font-semibold " +
  "transition-[transform,box-shadow,border-color,background-color,color,text-decoration-color] duration-300 ease-smooth " +
  "[&:not(.magnetic)]:active:scale-96";

const BTN_VARIANT: Record<BtnVariant, string> = {
  primary:
    "bg-khaki text-ink shadow-[0_10px_30px_-14px_rgba(217,210,163,.6)] " +
    "hover:bg-khaki-hi hover:shadow-[0_14px_36px_-12px_rgba(217,210,163,.7)]",
  outline: "border border-line-strong text-fg-1 hover:border-sage hover:bg-sage/8",
  ghost:
    "text-fg-2 underline decoration-fg-1/25 underline-offset-[5px] hover:text-fg-1 hover:decoration-khaki",
};

const BTN_SIZE: Record<BtnSize, string> = {
  md: "rounded-full px-6 py-3.5 text-[14.5px]",
  sm: "rounded-xl px-[18px] py-[11px] text-[14px]",
};

/** `.btn` + variant + size. Add `magnetic` for the pointer pull. */
export const btn = (variant: BtnVariant, size: BtnSize = "md", extra?: string) =>
  cn(BTN_BASE, BTN_SIZE[size], BTN_VARIANT[variant], variant === "ghost" && "px-3.5", extra);

/** Square khaki icon tile (panel heads, services, stats, the hero chip). */
export const khakiTile =
  "flex shrink-0 items-center justify-center border border-khaki/20 bg-khaki/8 text-khaki";

/** Round outlined icon (about facts, contact rows). */
export const ringIcon =
  "flex shrink-0 items-center justify-center rounded-full border border-line-strong text-sage";

/** Small green dot that pulses: "available now". */
export const liveDot = "size-[7px] shrink-0 rounded-full bg-leaf animate-live-ping";

/** Text link that turns khaki on hover. */
export const hoverKhaki = "transition-colors duration-[250ms] hover:text-khaki";

/** Panel spans on the 12-column grid. Pairs share a row above 980px. */
export const span = {
  full: "col-span-12",
  half: "col-span-12 min-[981px]:col-span-6",
  wide: "col-span-12 min-[981px]:col-span-7",
  narrow: "col-span-12 min-[981px]:col-span-5",
};

/** The hero's floating panes share one surface with the stack chip. */
export const floatingPane =
  "rounded-2xl border border-sage/20 bg-[linear-gradient(180deg,rgba(32,48,42,.82),rgba(20,31,24,.78))] shadow-[inset_0_1px_0_rgba(238,240,228,.08),0_18px_40px_-18px_rgba(0,0,0,.55)] backdrop-blur-[14px]";

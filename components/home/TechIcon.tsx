import type { TechMark } from "@/data/skills";

/**
 * Draws a skill's logo. Brand colours are exposed as `--brand` so CSS can keep
 * the logos in the site palette and only light them up on hover. Near-black
 * marks (Next.js, Prisma) would vanish on the green, so they fall back to the
 * text colour.
 */
const TechIcon = ({ mark, size = 20 }: { mark: TechMark; size?: number }) => {
  if ("monogram" in mark) {
    return (
      <span className="tech-mono" aria-hidden>
        {mark.monogram}
      </span>
    );
  }

  const [r, g, b] = [0, 2, 4].map((i) =>
    parseInt(mark.hex.slice(i, i + 2), 16),
  );
  const dark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 70;

  return (
    <svg
      className="tech-svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={
        {
          "--brand": dark ? "var(--text-1)" : `#${mark.hex}`,
        } as React.CSSProperties
      }
    >
      <path d={mark.path} />
    </svg>
  );
};

export default TechIcon;

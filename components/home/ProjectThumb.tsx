export type ThumbVariant =
  | "storefront"
  | "cms"
  | "dashboard"
  | "app"
  | "landing"
  | "portfolio";

/**
 * Stylised UI mockups drawn as inline SVG, so project cards get real artwork
 * without shipping image files. Everything is painted in translucent white over
 * the card's own gradient, which keeps every variant on-palette.
 */

const W = 400;
const H = 200;

const glass = "rgba(255,255,255,0.16)";
const glassSoft = "rgba(255,255,255,0.09)";
const glassStrong = "rgba(255,255,255,0.30)";
const ink = "rgba(3,8,20,0.28)";

/** Browser chrome shared by every variant. */
const Chrome = () => (
  <>
    <rect x="0" y="0" width={W} height="26" fill={ink} />
    <circle cx="16" cy="13" r="3.5" fill="rgba(255,255,255,0.42)" />
    <circle cx="28" cy="13" r="3.5" fill="rgba(255,255,255,0.28)" />
    <circle cx="40" cy="13" r="3.5" fill="rgba(255,255,255,0.28)" />
    <rect
      x="56"
      y="7"
      width="120"
      height="12"
      rx="6"
      fill="rgba(255,255,255,0.14)"
    />
  </>
);

const scenes: Record<ThumbVariant, React.ReactNode> = {
  // Product grid with a price row underneath each card.
  storefront: (
    <>
      <rect x="20" y="42" width="90" height="10" rx="5" fill={glassStrong} />
      {[20, 148, 276].map((x) => (
        <g key={x}>
          <rect x={x} y="66" width="104" height="66" rx="10" fill={glass} />
          <rect
            x={x + 12}
            y={82}
            width="80"
            height="34"
            rx="6"
            fill="rgba(255,255,255,0.22)"
          />
          <rect
            x={x}
            y="140"
            width="62"
            height="7"
            rx="3.5"
            fill={glassSoft}
          />
          <rect
            x={x}
            y="153"
            width="38"
            height="7"
            rx="3.5"
            fill="rgba(255,255,255,0.22)"
          />
        </g>
      ))}
    </>
  ),

  // Sidebar plus stacked content blocks — a builder/CMS canvas.
  cms: (
    <>
      <rect x="0" y="26" width="96" height={H - 26} fill={ink} />
      {[44, 66, 88, 110, 132].map((y) => (
        <rect
          key={y}
          x="16"
          y={y}
          width={y === 44 ? 64 : 52}
          height="8"
          rx="4"
          fill={y === 44 ? glassStrong : glassSoft}
        />
      ))}
      <rect x="116" y="44" width="264" height="52" rx="10" fill={glass} />
      <rect x="116" y="108" width="126" height="58" rx="10" fill={glassSoft} />
      <rect x="254" y="108" width="126" height="58" rx="10" fill={glassSoft} />
    </>
  ),

  // KPI row, bar chart and a trend line.
  dashboard: (
    <>
      {[20, 148, 276].map((x) => (
        <rect key={x} x={x} y="42" width="104" height="34" rx="8" fill={glass} />
      ))}
      <rect x="20" y="88" width="212" height="90" rx="10" fill={glassSoft} />
      {[
        [36, 40],
        [68, 62],
        [100, 30],
        [132, 74],
        [164, 52],
        [196, 66],
      ].map(([x, h]) => (
        <rect
          key={x}
          x={x}
          y={168 - h}
          width="18"
          height={h}
          rx="4"
          fill={glassStrong}
        />
      ))}
      <rect x="248" y="88" width="132" height="90" rx="10" fill={glassSoft} />
      <polyline
        points="262,158 288,132 312,144 336,110 366,120"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),

  // List rows with a floating action button.
  app: (
    <>
      <rect x="20" y="42" width="132" height="10" rx="5" fill={glassStrong} />
      {[66, 100, 134].map((y) => (
        <g key={y}>
          <rect x="20" y={y} width="300" height="26" rx="8" fill={glass} />
          <circle cx="36" cy={y + 13} r="7" fill="rgba(255,255,255,0.34)" />
          <rect
            x="52"
            y={y + 9}
            width="120"
            height="8"
            rx="4"
            fill={glassSoft}
          />
        </g>
      ))}
      <circle cx="352" cy="152" r="22" fill="rgba(255,255,255,0.34)" />
      <path
        d="M352 143v18M343 152h18"
        stroke="rgba(3,8,20,0.5)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),

  // Headline, copy and a call-to-action beside a hero panel.
  landing: (
    <>
      <rect x="20" y="50" width="168" height="14" rx="7" fill={glassStrong} />
      <rect x="20" y="74" width="130" height="14" rx="7" fill={glassStrong} />
      <rect x="20" y="102" width="164" height="7" rx="3.5" fill={glassSoft} />
      <rect x="20" y="116" width="140" height="7" rx="3.5" fill={glassSoft} />
      <rect
        x="20"
        y="138"
        width="84"
        height="26"
        rx="13"
        fill="rgba(255,255,255,0.36)"
      />
      <rect x="114" y="138" width="70" height="26" rx="13" fill={glassSoft} />
      <rect x="216" y="46" width="164" height="122" rx="14" fill={glass} />
      <circle cx="298" cy="94" r="24" fill="rgba(255,255,255,0.26)" />
      <rect x="240" y="130" width="116" height="8" rx="4" fill={glassSoft} />
      <rect x="240" y="146" width="80" height="8" rx="4" fill={glassSoft} />
    </>
  ),

  // Masonry-style gallery of work.
  portfolio: (
    <>
      <rect x="20" y="42" width="72" height="10" rx="5" fill={glassStrong} />
      <rect x="20" y="66" width="168" height="100" rx="10" fill={glass} />
      <circle cx="104" cy="110" r="22" fill="rgba(255,255,255,0.24)" />
      <rect x="200" y="66" width="88" height="46" rx="10" fill={glassSoft} />
      <rect x="296" y="66" width="84" height="46" rx="10" fill={glassSoft} />
      <rect x="200" y="120" width="180" height="46" rx="10" fill={glassSoft} />
    </>
  ),
};

const ProjectThumb = ({ variant }: { variant: ThumbVariant }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    role="presentation"
    aria-hidden
  >
    <Chrome />
    {scenes[variant]}
  </svg>
);

export default ProjectThumb;

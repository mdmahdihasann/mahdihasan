"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Dhaka",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** A per-minute clock; every subscriber shares one interval. */
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
};
const getSnapshot = () => format.format(new Date());
/** The server can't know the visitor's "now", so it renders a placeholder. */
const getServerSnapshot = () => "--:--";

const DhakaTime = () => {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <p className="flex items-baseline gap-2 font-display text-[clamp(30px,2.8vw,40px)] leading-none font-bold tracking-[-0.03em] text-fg-1 tabular-nums">
      <time suppressHydrationWarning>{time}</time>
      <span className="font-body text-[13px] font-medium tracking-normal text-sage">GMT+6</span>
    </p>
  );
};

export default DhakaTime;

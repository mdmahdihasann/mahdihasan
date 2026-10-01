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
    <p className="local-time">
      <time suppressHydrationWarning>{time}</time>
      <span className="tz">GMT+6</span>
    </p>
  );
};

export default DhakaTime;

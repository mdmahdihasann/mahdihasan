"use client";

import { ArrowRight, CalendarClock, Check } from "lucide-react";
import { useId, useState, type CSSProperties } from "react";

import {
  features,
  PAGE_RANGE,
  projectKinds,
  stacks,
} from "@/data/estimate";
import { estimate } from "@/lib/estimate";
import { emit, PREFILL_CONTACT, type ContactPrefill } from "@/lib/events";
import { btn, span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import PanelHead from "./PanelHead";

const CONTENT_OPTIONS = [
  { id: "ready", label: "I have it ready" },
  { id: "help", label: "Help me write it" },
] as const;

/** One colour per process phase, shared by the bar and its legend. */
const PHASE_COLORS = ["#6f8f74", "var(--color-sage)", "#c9cf9e", "var(--color-khaki)", "var(--color-olive)", "var(--color-leaf)"];

/** Real radios and checkboxes stay in the tab order, just out of sight. */
const hiddenInput = "absolute size-px opacity-0 pointer-events-none";
const legend = "mb-3 flex w-full items-baseline justify-between gap-3 font-display text-[15.5px] font-semibold text-fg-1";
const seg = "inline-flex flex-wrap gap-1 rounded-[14px] border border-line bg-bg-deep/45 p-1";
const segLabel = "group/opt relative cursor-pointer rounded-[10px] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-khaki";
const segSpan = "block rounded-[10px] px-3.5 py-2 text-[13.5px] font-semibold text-fg-2 transition-[color,background-color] duration-[250ms] group-hover/opt:text-fg-1 group-has-checked/opt:bg-khaki group-has-checked/opt:text-ink";

/**
 * Timeline-only estimator: pick what you're building and the six process
 * phases resize live. "Send this plan" hands the answers to the contact form.
 */
const Estimate = () => {
  const uid = useId();
  const [kindId, setKindId] = useState(projectKinds[1].id);
  const [pages, setPages] = useState(5);
  const [stack, setStack] = useState<string>(stacks[0]);
  const [picked, setPicked] = useState<string[]>([]);
  const [content, setContent] = useState<string>(CONTENT_OPTIONS[0].id);

  const kind = projectKinds.find((k) => k.id === kindId) ?? projectKinds[0];
  const result = estimate({
    kind,
    pages,
    featureIds: picked,
    needsContent: content === "help",
  });
  const inWeeks = !result.label.includes("days");
  const unitLabel = `${pages} ${kind.unit}${pages === 1 ? "" : "s"}`;

  const toggleFeature = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const sendPlan = () => {
    const needs = features.filter((f) => picked.includes(f.id)).map((f) => f.label);
    const message = [
      `Hi Mahdi, I'm planning a ${kind.label.toLowerCase()} (${unitLabel}), built with ${stack}.`,
      `It needs: ${needs.length ? needs.join(", ") : "just the essentials"}.`,
      `Content: ${content === "help" ? "I need help writing it" : "I have it ready"}.`,
      `Your estimator suggested ${result.label.toLowerCase()}.`,
      "",
      "A bit more about the project: ",
    ].join("\n");
    emit<ContactPrefill>(PREFILL_CONTACT, {
      subject: `${kind.label} — project plan`,
      message,
    });
  };

  return (
    <section id="estimate" className={cn("panel reveal", span.full)} aria-labelledby="estimate-title">
      <PanelHead icon={CalendarClock} title="Plan Your Project" id="estimate-title" />
      <p className="-mt-1 mb-[clamp(18px,2.2vw,24px)] max-w-[62ch] text-[15px] text-fg-2">
        Pick what you&apos;re building and see how long it usually takes, phase by phase.
      </p>

      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start gap-[clamp(18px,2.4vw,32px)] max-[900px]:grid-cols-1">
        <form className="grid gap-[clamp(18px,2.2vw,24px)]" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="min-w-0">
            <legend className={legend}>What are you building?</legend>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,168px),1fr))] gap-2.5">
              {projectKinds.map((k) => (
                <label
                  className="group/kind relative flex cursor-pointer flex-col gap-1 rounded-[14px] border border-line bg-bg-deep/35 px-3.5 py-[13px] transition-[border-color,background-color,box-shadow] duration-[250ms] hover:border-line-strong has-checked:border-khaki/55 has-checked:bg-khaki/7 has-checked:shadow-[0_12px_26px_-18px_rgba(217,210,163,.6)] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-khaki"
                  key={k.id}
                >
                  <input
                    type="radio"
                    className={hiddenInput}
                    name={`${uid}-kind`}
                    value={k.id}
                    checked={kindId === k.id}
                    onChange={() => {
                      setKindId(k.id);
                      setPages(Math.max(k.includedPages, PAGE_RANGE.min));
                    }}
                  />
                  <span className="text-[14.5px] font-semibold text-fg-1">{k.label}</span>
                  <span className="text-[12.5px] leading-[1.45] text-fg-3 group-has-checked/kind:text-fg-2">{k.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className={legend}>
              How many {kind.unit}s?
              <output className="font-body text-[13.5px] font-semibold text-khaki tabular-nums" htmlFor={`${uid}-pages`}>
                {unitLabel}
              </output>
            </legend>
            <input
              id={`${uid}-pages`}
              className="range-khaki"
              type="range"
              min={PAGE_RANGE.min}
              max={PAGE_RANGE.max}
              value={pages}
              aria-label={`Number of ${kind.unit}s`}
              aria-valuetext={unitLabel}
              onChange={(e) => setPages(Number(e.target.value))}
              style={
                {
                  "--fill": `${((pages - PAGE_RANGE.min) / (PAGE_RANGE.max - PAGE_RANGE.min)) * 100}%`,
                } as CSSProperties
              }
            />
          </fieldset>

          <fieldset className="min-w-0">
            <legend className={legend}>Built with</legend>
            <div className={seg}>
              {stacks.map((s) => (
                <label key={s} className={segLabel}>
                  <input
                    className={hiddenInput}
                    type="radio"
                    name={`${uid}-stack`}
                    value={s}
                    checked={stack === s}
                    onChange={() => setStack(s)}
                  />
                  <span className={segSpan}>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className={legend}>What does it need?</legend>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => {
                const on = picked.includes(f.id);
                return (
                  <label className="group/chip relative cursor-pointer rounded-full has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-khaki" key={f.id}>
                    <input
                      type="checkbox"
                      className={hiddenInput}
                      checked={on}
                      onChange={() => toggleFeature(f.id)}
                    />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[13.5px] font-medium text-fg-2 transition-[color,background-color,border-color] duration-[250ms] group-hover/chip:border-line-strong group-hover/chip:text-fg-1 group-has-checked/chip:border-leaf/45 group-has-checked/chip:bg-leaf/10 group-has-checked/chip:pl-[11px] group-has-checked/chip:text-fg-1">
                      <Check
                        size={14}
                        strokeWidth={2.4}
                        aria-hidden
                        className="hidden animate-tick-in text-leaf group-has-checked/chip:block"
                      />
                      {f.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className={legend}>Content</legend>
            <div className={seg}>
              {CONTENT_OPTIONS.map((o) => (
                <label key={o.id} className={segLabel}>
                  <input
                    className={hiddenInput}
                    type="radio"
                    name={`${uid}-content`}
                    value={o.id}
                    checked={content === o.id}
                    onChange={() => setContent(o.id)}
                  />
                  <span className={segSpan}>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside
          className="sticky top-[calc(var(--nav-h)_+_12px)] flex flex-col rounded-[18px] border border-khaki/20 bg-[radial-gradient(120%_90%_at_100%_0%,rgba(217,210,163,.08),transparent_60%),rgba(20,31,24,.6)] p-[clamp(18px,2.2vw,26px)] max-[900px]:static" aria-labelledby={`${uid}-result`}>
          <h3 className="font-body text-[13.5px] font-semibold text-fg-2" id={`${uid}-result`}>
            Estimated timeline
          </h3>
          <div aria-live="polite" aria-atomic>
            {/* Keyed so a new answer replays the settle-in, not just swaps text. */}
            <p
              data-slot="est-figure"
              className="mt-2 mb-1.5 animate-figure-in font-display text-[clamp(30px,3.2vw,42px)] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-fg-1 tabular-nums"
              key={result.label}
            >
              {result.label}
            </p>
            <p className="text-[13.5px] text-fg-3">
              {inWeeks
                ? `${result.low}–${result.high} working days, kickoff to launch`
                : "Kickoff to launch"}
            </p>
          </div>

          <div className="mt-[22px] mb-3.5 flex h-2.5 gap-[3px]" aria-hidden>
            {result.phases.map((p, i) => (
              <span
                key={p.name}
                className="min-w-1 basis-0 rounded bg-(--ph) transition-[flex-grow] duration-600 ease-spring revealed:animate-[barIn_.7s_var(--ease-spring)_calc(.2s_+_var(--i)*70ms)_backwards]"
                style={{ flexGrow: p.days, "--i": i, "--ph": PHASE_COLORS[i] } as CSSProperties}
              />
            ))}
          </div>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13.5px] text-fg-2">
            {result.phases.map((p, i) => (
              <li key={p.name} className="flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-[3px]"
                  style={{ background: PHASE_COLORS[i] }}
                  aria-hidden
                />
                {p.name}
                <span className="ml-auto text-fg-3 tabular-nums">
                  {p.days < 1 ? "<1" : `~${Math.round(p.days)}`} d
                </span>
              </li>
            ))}
          </ol>

          <a href="#contact" className={btn("primary", "sm", "magnetic mt-[22px] self-start")} onClick={sendPlan}>
            Send this plan
            <ArrowRight size={16} aria-hidden />
          </a>
          <p className="mt-3 text-[12.5px] text-pretty text-fg-3">
            A starting point, not a quote. I&apos;ll confirm the real timeline after a short call.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Estimate;

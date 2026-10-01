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

import PanelHead from "./PanelHead";

const CONTENT_OPTIONS = [
  { id: "ready", label: "I have it ready" },
  { id: "help", label: "Help me write it" },
] as const;

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
    <section id="estimate" className="panel reveal" aria-labelledby="estimate-title">
      <PanelHead icon={CalendarClock} title="Plan Your Project" id="estimate-title" />
      <p className="est-intro">
        Pick what you&apos;re building and see how long it usually takes, phase by phase.
      </p>

      <div className="est-grid">
        <form className="est-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="est-q">
            <legend>What are you building?</legend>
            <div className="est-kinds">
              {projectKinds.map((k) => (
                <label className="est-kind" key={k.id}>
                  <input
                    type="radio"
                    name={`${uid}-kind`}
                    value={k.id}
                    checked={kindId === k.id}
                    onChange={() => {
                      setKindId(k.id);
                      setPages(Math.max(k.includedPages, PAGE_RANGE.min));
                    }}
                  />
                  <span className="est-kind-label">{k.label}</span>
                  <span className="est-kind-hint">{k.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="est-q">
            <legend>
              How many {kind.unit}s?
              <output className="est-count" htmlFor={`${uid}-pages`}>
                {unitLabel}
              </output>
            </legend>
            <input
              id={`${uid}-pages`}
              className="est-range"
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

          <fieldset className="est-q">
            <legend>Built with</legend>
            <div className="est-seg">
              {stacks.map((s) => (
                <label key={s}>
                  <input
                    type="radio"
                    name={`${uid}-stack`}
                    value={s}
                    checked={stack === s}
                    onChange={() => setStack(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="est-q">
            <legend>What does it need?</legend>
            <div className="est-chips">
              {features.map((f) => {
                const on = picked.includes(f.id);
                return (
                  <label className="est-chip" key={f.id}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleFeature(f.id)}
                    />
                    <span>
                      <Check size={14} strokeWidth={2.4} aria-hidden className="est-tick" />
                      {f.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="est-q">
            <legend>Content</legend>
            <div className="est-seg">
              {CONTENT_OPTIONS.map((o) => (
                <label key={o.id}>
                  <input
                    type="radio"
                    name={`${uid}-content`}
                    value={o.id}
                    checked={content === o.id}
                    onChange={() => setContent(o.id)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="est-result" aria-labelledby={`${uid}-result`}>
          <h3 className="est-result-label" id={`${uid}-result`}>
            Estimated timeline
          </h3>
          <div aria-live="polite" aria-atomic>
            {/* Keyed so a new answer replays the settle-in, not just swaps text. */}
            <p className="est-figure" key={result.label}>
              {result.label}
            </p>
            <p className="est-sub">
              {inWeeks
                ? `${result.low}–${result.high} working days, kickoff to launch`
                : "Kickoff to launch"}
            </p>
          </div>

          <div className="est-bar" aria-hidden>
            {result.phases.map((p, i) => (
              <span
                key={p.name}
                style={{ flexGrow: p.days, "--i": i } as CSSProperties}
              />
            ))}
          </div>
          <ol className="est-phases">
            {result.phases.map((p, i) => (
              <li key={p.name} style={{ "--i": i } as CSSProperties}>
                <span className="est-dot" aria-hidden />
                {p.name}
                <span className="est-days">
                  {p.days < 1 ? "<1" : `~${Math.round(p.days)}`} d
                </span>
              </li>
            ))}
          </ol>

          <a href="#contact" className="btn btn-primary btn-sm magnetic est-send" onClick={sendPlan}>
            Send this plan
            <ArrowRight size={16} aria-hidden />
          </a>
          <p className="est-note">
            A starting point, not a quote. I&apos;ll confirm the real timeline after a short call.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Estimate;

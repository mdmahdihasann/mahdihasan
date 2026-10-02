"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Check,
  Clock,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import {
  cloneElement,
  useEffect,
  useId,
  useState,
  type BaseSyntheticEvent,
  type ReactElement,
} from "react";
import { useForm } from "react-hook-form";

import { profile } from "@/data/profile";
import { contactSchema, type ContactValues } from "@/lib/contactSchema";
import { PREFILL_CONTACT, type ContactPrefill } from "@/lib/events";
import { sendContact } from "@/lib/sendContact";
import { btn, hoverKhaki, khakiTile, liveDot, ringIcon, span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import Socials from "./Socials";

/**
 * A boxed field whose label rides the top edge once it is filled or focused
 * (the `placeholder=" "` on each control is what `:placeholder-shown` reads).
 * Bottom padding reserves the error line, so a message never overlaps the
 * field below. `id` names the error; the control gets `${id}-input`.
 */
const Field = ({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactElement<{ id?: string; className?: string }>;
}) => (
  <div className="relative pb-[18px]">
    {cloneElement(children, {
      id: `${id}-input`,
      className:
        "peer block w-full resize-none rounded-[10px] border border-line-strong bg-fg-1/3 px-3.5 pt-[13px] pb-[11px] font-body text-[14.5px] text-fg-1 caret-khaki transition-[border-color,background-color] duration-[250ms] hover:border-sage/35 focus:border-khaki focus:bg-khaki/4 focus:outline-none aria-invalid:border-danger aria-invalid:focus:border-danger [textarea&]:min-h-[104px]",
    })}
    <label
      htmlFor={`${id}-input`}
      className="pointer-events-none absolute top-3 left-[11px] rounded px-1 text-[14.5px] text-fg-3 transition-[top,font-size,color,background-color] duration-[250ms] ease-smooth peer-focus:-top-2 peer-focus:bg-[#18241c] peer-focus:text-[11.5px] peer-focus:text-khaki peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:bg-[#18241c] peer-[:not(:placeholder-shown)]:text-[11.5px] peer-[:not(:placeholder-shown)]:text-khaki"
    >
      {label}
    </label>
    {error && (
      <span className="absolute bottom-px left-1 text-[12px] text-danger" id={id}>
        {error}
      </span>
    )}
  </div>
);

export { contactSchema, type ContactValues };

type Detail = { icon: LucideIcon; label: string; value: string; href?: string };

const DETAILS: Detail[] = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone}`,
  },
  { icon: MapPin, label: "Location", value: profile.location },
  { icon: Clock, label: "Availability", value: profile.availability },
];

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const errId = useId();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  // The estimator's "Send this plan" fills the subject and message, then
  // parks the caret at the end of the message so the visitor can add to it.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { subject, message } = (e as CustomEvent<ContactPrefill>).detail;
      setValue("subject", subject, { shouldDirty: true });
      setValue("message", message, { shouldDirty: true });
      setSent(false);
      setSendError(null);
      window.setTimeout(() => {
        const box = document.getElementById(`${errId}-message-input`) as HTMLTextAreaElement | null;
        if (!box) return;
        box.focus({ preventScroll: true });
        box.setSelectionRange(box.value.length, box.value.length);
      }, 700);
    };
    window.addEventListener(PREFILL_CONTACT, onPrefill);
    return () => window.removeEventListener(PREFILL_CONTACT, onPrefill);
  }, [setValue, errId]);

  const onSubmit = async (values: ContactValues, event?: BaseSyntheticEvent) => {
    const form = event?.target instanceof HTMLFormElement ? event.target : null;
    const website = form ? String(new FormData(form).get("website") ?? "") : "";
    setSendError(null);
    try {
      await sendContact({ ...values, website });
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "The message couldn't be sent.");
      return;
    }
    reset();
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };

  /** Same message, handed to the visitor's own mail app when sending fails. */
  const mailtoFallback = (values: Partial<ContactValues>) =>
    `mailto:${profile.email}?subject=${encodeURIComponent(values.subject ?? "Hello")}&body=${encodeURIComponent(
      `${values.message ?? ""}

— ${values.name ?? ""} (${values.email ?? ""})`,
    )}`;

  const ArrowIcon = isSubmitting ? LoaderCircle : sent ? Check : ArrowRight;

  /** Wires each input to its error message for assistive tech. */
  const fieldProps = (field: keyof ContactValues) => ({
    ...register(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${errId}-${field}` : undefined,
  });

  return (
    <section id="contact" className={cn("panel reveal", span.full)} aria-labelledby="contact-title">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,.9fr)_minmax(0,1.35fr)] items-stretch gap-[clamp(20px,3vw,40px)] max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
        <div className="flex flex-col items-start gap-3.5">
          <span
            data-slot="panel-icon"
            className={cn(khakiTile, "size-11 rounded-[13px] border-khaki/22")}
            aria-hidden
          >
            <Send size={20} strokeWidth={1.8} />
          </span>
          <h2
            className="mt-1 text-[clamp(22px,2vw,28px)] leading-[1.15] font-bold tracking-[-0.025em] text-balance"
            id="contact-title"
          >
            Let&apos;s build something great
          </h2>
          <p className="max-w-[38ch] text-[14.5px] text-fg-2">
            Have a project in mind or want to collaborate? Tell me what you
            need and I&apos;ll reply within a day.
          </p>
          <a href={`mailto:${profile.email}`} className={btn("primary", "sm", "magnetic mt-1")}>
            Email me
            <ArrowRight size={16} aria-hidden />
          </a>
          <Socials compact className="mt-auto pt-2" iconClassName="rounded-[11px]" />
        </div>

        <ul className="flex flex-col justify-center border-l border-line pl-[clamp(20px,3vw,40px)] max-[700px]:border-t max-[700px]:border-l-0 max-[700px]:pt-2 max-[700px]:pl-0">
          {DETAILS.map(({ icon: Icon, ...row }) => {
            const live = row.label === "Availability";
            return (
              <li className="flex items-center gap-3.5 py-3" key={row.label}>
                <span className={cn(ringIcon, "size-[38px]")} aria-hidden>
                  <Icon size={17} strokeWidth={1.75} />
                </span>
                <div>
                  <div className="text-[12.5px] text-fg-3">{row.label}</div>
                  <div
                    className={cn(
                      "text-[14.5px] font-medium wrap-anywhere text-fg-1",
                      live && "flex items-center gap-2 text-leaf",
                    )}
                  >
                    {live && <span className={liveDot} aria-hidden />}
                    {row.href ? (
                      <a href={row.href} className={hoverKhaki}>
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* The one card with the travelling edge light. */}
        <div className="glow-border rounded-2xl bg-bg-deep/60 p-[clamp(16px,1.8vw,22px)] max-[1100px]:col-span-full">
          <form id="contactForm" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Honeypot: hidden from people and assistive tech, filled by bots. */}
            <input
              type="text"
              name="website"
              className="pointer-events-none absolute -left-[9999px] size-px opacity-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <div className="grid grid-cols-2 gap-x-3 max-[700px]:grid-cols-1">
              <Field id={`${errId}-name`} label="Name" error={errors.name?.message}>
                <input type="text" placeholder=" " autoComplete="name" {...fieldProps("name")} />
              </Field>
              <Field id={`${errId}-email`} label="Email" error={errors.email?.message}>
                <input type="email" placeholder=" " autoComplete="email" {...fieldProps("email")} />
              </Field>
            </div>

            <Field id={`${errId}-subject`} label="Subject" error={errors.subject?.message}>
              <input type="text" placeholder=" " {...fieldProps("subject")} />
            </Field>

            <Field id={`${errId}-message`} label="Message" error={errors.message?.message}>
              <textarea rows={5} placeholder=" " {...fieldProps("message")} />
            </Field>

            <button
              type="submit"
              className={btn(
                "primary",
                "md",
                "group/send magnetic w-full rounded-xl p-3.5 disabled:cursor-wait disabled:opacity-70",
              )}
              id="sendBtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending" : "Send Message"}{" "}
              <ArrowIcon
                id="sendArrow"
                size={17}
                aria-hidden
                className={cn(
                  "shrink-0 transition-transform duration-300 ease-smooth group-enabled/send:group-hover/send:translate-x-[3px]",
                  isSubmitting && "animate-spin-icon",
                )}
              />
            </button>

            <p
              className={cn(
                "mt-2.5 min-h-[18px] text-[13.5px] [&_a]:text-fg-1 [&_a]:underline [&_a]:underline-offset-[3px]",
                sendError ? "text-danger" : "text-leaf",
              )}
              role="status"
              aria-live="polite"
            >
              {sent && "Message sent — thanks! It's in my inbox and I'll reply within a day."}
              {sendError && (
                <>
                  {sendError}{" "}
                  <a href={mailtoFallback(getValues())}>Send it from your mail app instead</a>.
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

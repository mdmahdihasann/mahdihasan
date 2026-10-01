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
import { useId, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";

import { profile } from "@/data/profile";
import { contactSchema, type ContactValues } from "@/lib/contactSchema";
import { sendContact } from "@/lib/sendContact";

import Socials from "./Socials";

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
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

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
    <section id="contact" className="panel reveal" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div className="contact-cta">
          <span className="panel-icon lg" aria-hidden>
            <Send size={20} strokeWidth={1.8} />
          </span>
          <h2 className="contact-title" id="contact-title">
            Let&apos;s build something great
          </h2>
          <p>
            Have a project in mind or want to collaborate? Tell me what you
            need and I&apos;ll reply within a day.
          </p>
          <a href={`mailto:${profile.email}`} className="btn btn-primary btn-sm magnetic">
            Email me
            <ArrowRight size={16} aria-hidden />
          </a>
          <Socials compact />
        </div>

        <ul className="contact-details">
          {DETAILS.map(({ icon: Icon, ...row }) => (
            <li className="contact-detail-row" key={row.label}>
              <span className="cd-icon" aria-hidden>
                <Icon size={17} strokeWidth={1.75} />
              </span>
              <div>
                <div className="cd-label">{row.label}</div>
                <div className={`cd-value${row.label === "Availability" ? " is-live" : ""}`}>
                  {row.href ? <a href={row.href}>{row.value}</a> : row.value}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="form-card glow-border">
          <form id="contactForm" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Honeypot: hidden from people and assistive tech, filled by bots. */}
            <input
              type="text"
              name="website"
              className="hp-field"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <div className="form-row2">
              <div className="field2">
                <input
                  id={`${errId}-name-input`}
                  type="text"
                  placeholder=" "
                  autoComplete="name"
                  {...fieldProps("name")}
                />
                <label htmlFor={`${errId}-name-input`}>Name</label>
                <div className="underline" aria-hidden />
                {errors.name && (
                  <span className="field-err" id={`${errId}-name`}>
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="field2">
                <input
                  id={`${errId}-email-input`}
                  type="email"
                  placeholder=" "
                  autoComplete="email"
                  {...fieldProps("email")}
                />
                <label htmlFor={`${errId}-email-input`}>Email</label>
                <div className="underline" aria-hidden />
                {errors.email && (
                  <span className="field-err" id={`${errId}-email`}>
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="field2">
              <input
                id={`${errId}-subject-input`}
                type="text"
                placeholder=" "
                {...fieldProps("subject")}
              />
              <label htmlFor={`${errId}-subject-input`}>Subject</label>
              <div className="underline" aria-hidden />
              {errors.subject && (
                <span className="field-err" id={`${errId}-subject`}>
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div className="field2">
              <textarea
                id={`${errId}-message-input`}
                rows={5}
                placeholder=" "
                {...fieldProps("message")}
              />
              <label htmlFor={`${errId}-message-input`}>Message</label>
              <div className="underline" aria-hidden />
              {errors.message && (
                <span className="field-err" id={`${errId}-message`}>
                  {errors.message.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary send-btn magnetic"
              id="sendBtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending" : "Send Message"}{" "}
              <ArrowIcon
                id="sendArrow"
                size={17}
                aria-hidden
                className={isSubmitting ? "spin-icon" : undefined}
              />
            </button>

            <p
              className={`form-msg${sendError ? " error" : ""}`}
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

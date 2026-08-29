"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { profile } from "@/data/profile";

import Socials from "./Socials";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email"),
  subject: z.string().min(3, "Please add a subject"),
  message: z.string().min(10, "Tell me a little more (10+ characters)"),
});

export type ContactValues = z.infer<typeof contactSchema>;

type Detail = { icon: string; label: string; value: string; href?: string };

const DETAILS: Detail[] = [
  {
    icon: "✉",
    label: "EMAIL",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: "☎",
    label: "PHONE",
    value: profile.phone,
    href: `tel:${profile.phone}`,
  },
  { icon: "◎", label: "LOCATION", value: profile.location },
  { icon: "◆", label: "AVAILABILITY", value: profile.availability },
];

const Contact = () => {
  const [sent, setSent] = useState(false);
  const errId = useId();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactValues) => {
    // TODO: wire this to a real sender (EmailJS or an app/api route) — until
    // then the message is only logged and the success state is cosmetic.
    console.log("[contact] submitted", values);
    await new Promise((resolve) => setTimeout(resolve, 900));
    reset();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const arrow = isSubmitting ? "…" : sent ? "✓" : "→";

  /** Wires each input to its error message for assistive tech. */
  const fieldProps = (field: keyof ContactValues) => ({
    ...register(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${errId}-${field}` : undefined,
  });

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">
            <span className="num">06</span> {"// Get In Touch"}
          </p>
          <h2 className="section-title" id="contact-title">
            Let&apos;s build something <span className="grad">great</span>
          </h2>
          <p className="section-sub">
            Have a project in mind? Tell me about it — I usually reply within a
            day.
          </p>
        </div>

        <div className="contact-grid">
          <div className="glass contact-info-card reveal spotlight">
            <h3>Contact Information</h3>
            <p>
              Prefer email, phone or socials? I&apos;m just as reachable there —
              based in Dhaka, working with clients anywhere.
            </p>

            <div className="contact-details">
              {DETAILS.map((row) => (
                <div className="contact-detail-row" key={row.label}>
                  <div className="cd-icon" aria-hidden>
                    {row.icon}
                  </div>
                  <div>
                    <div className="cd-label">{row.label}</div>
                    <div className="cd-value">
                      {row.href ? <a href={row.href}>{row.value}</a> : row.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Socials />
          </div>

          <div className="glass form-card reveal">
            <form id="contactForm" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-row2">
                <div className="field2">
                  <input
                    id={`${errId}-name-input`}
                    type="text"
                    placeholder=" "
                    autoComplete="name"
                    {...fieldProps("name")}
                  />
                  <label htmlFor={`${errId}-name-input`}>NAME</label>
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
                  <label htmlFor={`${errId}-email-input`}>EMAIL</label>
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
                <label htmlFor={`${errId}-subject-input`}>SUBJECT</label>
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
                <label htmlFor={`${errId}-message-input`}>MESSAGE</label>
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
                <span id="sendArrow" aria-hidden>
                  {arrow}
                </span>
              </button>

              <p className="form-msg" role="status" aria-live="polite">
                {sent && "Message sent — thanks! I'll get back to you soon."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

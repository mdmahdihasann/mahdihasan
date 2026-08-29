import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Contact, { contactSchema } from "@/components/home/Contact";
import { profile } from "@/data/profile";

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "New site",
  message: "I would like a five page marketing site built in Next.js.",
};

describe("contactSchema", () => {
  it("accepts a well-formed message", () => {
    expect(contactSchema.safeParse(VALID).success).toBe(true);
  });

  it.each([
    ["name", { ...VALID, name: "A" }],
    ["email", { ...VALID, email: "not-an-email" }],
    ["subject", { ...VALID, subject: "hi" }],
    ["message", { ...VALID, message: "too short" }],
  ])("rejects a bad %s", (_field, values) => {
    expect(contactSchema.safeParse(values).success).toBe(false);
  });
});

describe("Contact", () => {
  it("shows the contact details from the profile data", () => {
    render(<Contact />);

    expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole("link", { name: profile.phone })).toHaveAttribute(
      "href",
      `tel:${profile.phone}`,
    );
    expect(screen.getByText(profile.location)).toBeInTheDocument();
  });

  it("is numbered 06 now that the testimonials section is gone", () => {
    render(<Contact />);
    expect(screen.getByText("06")).toBeInTheDocument();
  });

  it("blocks an empty submit and reports every field", async () => {
    const user = userEvent.setup();
    const onLog = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Please enter your name")).toBeVisible();
    expect(screen.getByText("Please enter a valid email")).toBeVisible();
    expect(screen.getByText("Please add a subject")).toBeVisible();
    expect(
      screen.getByText("Tell me a little more (10+ characters)"),
    ).toBeVisible();
    expect(onLog).not.toHaveBeenCalled();
  });

  it("marks invalid fields for assistive tech", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "log").mockImplementation(() => {});
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    const email = await screen.findByLabelText("EMAIL");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Please enter a valid email");
  });

  it("submits a valid message and confirms it", async () => {
    const user = userEvent.setup();
    const onLog = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<Contact />);

    await user.type(screen.getByLabelText("NAME"), VALID.name);
    await user.type(screen.getByLabelText("EMAIL"), VALID.email);
    await user.type(screen.getByLabelText("SUBJECT"), VALID.subject);
    await user.type(screen.getByLabelText("MESSAGE"), VALID.message);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(
      () => expect(screen.getByRole("status")).toHaveTextContent(/message sent/i),
      { timeout: 4000 },
    );

    expect(onLog).toHaveBeenCalledWith("[contact] submitted", VALID);
    // The form empties itself so a second message starts clean.
    expect(screen.getByLabelText("NAME")).toHaveValue("");
  });
});

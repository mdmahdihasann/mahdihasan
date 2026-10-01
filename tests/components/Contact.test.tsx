import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import Contact, { contactSchema } from "@/components/home/Contact";
import { profile } from "@/data/profile";
import { CONTACT_API, CONTACT_ENDPOINT } from "@/lib/sendContact";

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

/**
 * Stands in for both channels: FormSubmit (email) answers with `body`, and
 * `/api/contact` (Telegram) answers with `telegram` — "unconfigured" by default.
 */
const mockRelay = (
  body: object,
  ok = true,
  telegram: { ok: boolean; body: object } = { ok: false, body: { ok: false, configured: false } },
) => {
  const fetchMock = vi.fn().mockImplementation(async (url: string) =>
    url === CONTACT_API
      ? { ok: telegram.ok, json: async () => telegram.body }
      : { ok, json: async () => body },
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const callTo = (fetchMock: ReturnType<typeof vi.fn>, url: string) =>
  fetchMock.mock.calls.find(([u]) => u === url);

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("Name"), VALID.name);
  await user.type(screen.getByLabelText("Email", { selector: "input" }), VALID.email);
  await user.type(screen.getByLabelText("Subject"), VALID.subject);
  await user.type(screen.getByLabelText("Message"), VALID.message);
  await user.click(screen.getByRole("button", { name: /send message/i }));
};

afterEach(() => {
  vi.unstubAllGlobals();
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

  it("leads with its own heading and a direct email link", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { level: 2, name: /let's build something great/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email me/i })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
  });

  it("blocks an empty submit and reports every field", async () => {
    const user = userEvent.setup();
    const fetchMock = mockRelay({ success: "true" });
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Please enter your name")).toBeVisible();
    expect(screen.getByText("Please enter a valid email")).toBeVisible();
    expect(screen.getByText("Please add a subject")).toBeVisible();
    expect(
      screen.getByText("Tell me a little more (10+ characters)"),
    ).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("marks invalid fields for assistive tech", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    const email = await screen.findByLabelText("Email", { selector: "input" });
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Please enter a valid email");
  });

  it("emails a valid message through the relay and confirms it", async () => {
    const user = userEvent.setup();
    const fetchMock = mockRelay({ success: "true" });
    render(<Contact />);

    await fillForm(user);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/message sent/i),
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [, init] = callTo(fetchMock, CONTACT_ENDPOINT)!;
    expect(CONTACT_ENDPOINT).toContain(profile.email);
    expect(JSON.parse(init.body)).toMatchObject({
      name: VALID.name,
      email: VALID.email,
      message: VALID.message,
      _replyto: VALID.email,
      _subject: `Portfolio: ${VALID.subject}`,
    });
    // The form empties itself so a second message starts clean.
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("keeps the message and offers a mail-app fallback when sending fails", async () => {
    const user = userEvent.setup();
    mockRelay({ success: "false", message: "This form needs Activation." });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Contact />);

    await fillForm(user);

    const status = screen.getByRole("status");
    // The visitor gets a plain notice, not FormSubmit's setup message.
    await waitFor(() => expect(status).toHaveTextContent(/form is offline/i));
    expect(status).not.toHaveTextContent(/activation/i);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    expect(status).not.toHaveTextContent(/message sent/i);
    expect(
      screen.getByRole("link", { name: /send it from your mail app/i }),
    ).toHaveAttribute("href", expect.stringContaining(`mailto:${profile.email}`));
    // Nothing the visitor typed is thrown away.
    expect(screen.getByLabelText("Name")).toHaveValue(VALID.name);
  });

  it("sends the same message to Telegram through /api/contact", async () => {
    const user = userEvent.setup();
    const fetchMock = mockRelay({ success: "true" });
    render(<Contact />);

    await fillForm(user);
    await waitFor(() => expect(callTo(fetchMock, CONTACT_API)).toBeDefined());

    const [, init] = callTo(fetchMock, CONTACT_API)!;
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toMatchObject({ ...VALID, website: "" });
  });

  it("counts the message as sent when Telegram delivers but email isn't activated yet", async () => {
    const user = userEvent.setup();
    mockRelay({ success: "false", message: "This form needs Activation." }, true, {
      ok: true,
      body: { ok: true },
    });
    render(<Contact />);

    await fillForm(user);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/message sent/i),
    );
  });

  it("hides a honeypot field from people", () => {
    const { container } = render(<Contact />);
    const trap = container.querySelector('input[name="website"]');
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap).toHaveAttribute("aria-hidden", "true");
  });
});

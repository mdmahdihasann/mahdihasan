import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import ChatBot, { CHAT_API } from "@/components/home/ChatBot";
import { profile } from "@/data/profile";

afterEach(() => {
  vi.unstubAllGlobals();
});

const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /ask about mahdi/i }));
  return screen.getByRole("dialog");
};

describe("ChatBot", () => {
  it("opens with a greeting and suggested questions, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    const dialog = await open(user);
    expect(dialog).toHaveTextContent(/assistant/i);
    expect(screen.getByRole("button", { name: "I want to hire him" })).toBeInTheDocument();
    expect(screen.getByLabelText("Your question")).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("sends the conversation to the chat API and shows the answer with its buttons", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        text: `Please email ${profile.email}.`,
        actions: [{ label: "Email Mahdi", href: `mailto:${profile.email}` }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<ChatBot />);
    await open(user);

    await user.type(screen.getByLabelText("Your question"), "Can I hire him?{Enter}");

    expect(await screen.findByRole("link", { name: "Email Mahdi" })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(CHAT_API);
    // The canned greeting isn't sent — the conversation starts with the visitor.
    expect(JSON.parse(init.body).messages).toEqual([{ role: "user", content: "Can I hire him?" }]);
  });

  it("answers locally when the server can't be reached", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    render(<ChatBot />);
    await open(user);

    await user.click(screen.getByRole("button", { name: "I want to hire him" }));

    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Open contact form" })).toHaveAttribute(
        "href",
        "#contact",
      ),
    );
  });
});

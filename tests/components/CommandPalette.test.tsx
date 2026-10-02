import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CommandPalette from "@/components/home/CommandPalette";
import { emit, OPEN_CHAT, OPEN_PALETTE } from "@/lib/events";

const openWithShortcut = () => fireEvent.keyDown(window, { key: "k", ctrlKey: true });
const dialog = () => document.querySelector("[data-slot=palette]");

describe("CommandPalette", () => {
  it("opens on Ctrl+K, focuses the search box and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    expect(dialog()).not.toHaveClass("open");

    openWithShortcut();
    expect(dialog()).toHaveClass("open");
    const box = screen.getByRole("combobox");
    expect(box).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(dialog()).not.toHaveClass("open");
  });

  it("opens from the nav button's event", () => {
    render(<CommandPalette />);
    act(() => emit(OPEN_PALETTE));
    expect(dialog()).toHaveClass("open");
  });

  it("filters as you type and runs the highlighted command on Enter", async () => {
    const user = userEvent.setup();
    const onChat = vi.fn();
    window.addEventListener(OPEN_CHAT, onChat);
    render(<CommandPalette />);
    openWithShortcut();

    await user.keyboard("assist");
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveTextContent("Ask the assistant");
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");
    expect(onChat).toHaveBeenCalledTimes(1);
    expect(dialog()).not.toHaveClass("open");
    window.removeEventListener(OPEN_CHAT, onChat);
  });

  it("matches loose abbreviations and says so when nothing matches", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    openWithShortcut();

    await user.keyboard("dcv");
    expect(screen.getAllByRole("option")[0]).toHaveTextContent("Download CV");

    await user.clear(screen.getByRole("combobox"));
    await user.keyboard("zzzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
  });

  it("moves the highlight with the arrow keys and wraps around", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    openWithShortcut();

    await user.keyboard("{ArrowUp}");
    const options = screen.getAllByRole("option");
    expect(options[options.length - 1]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });
});

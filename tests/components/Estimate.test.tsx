import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Contact from "@/components/home/Contact";
import Estimate from "@/components/home/Estimate";

describe("Estimate", () => {
  it("updates the timeline as answers change", async () => {
    const user = userEvent.setup();
    render(<Estimate />);

    const figure = () => document.querySelector(".est-figure")?.textContent;
    const before = figure();

    await user.click(screen.getByRole("radio", { name: /web app/i }));
    await user.click(screen.getByRole("checkbox", { name: /admin dashboard/i }));
    await user.click(screen.getByRole("checkbox", { name: /user accounts/i }));

    expect(figure()).not.toBe(before);
    expect(figure()).toMatch(/weeks/);
    expect(screen.getByRole("checkbox", { name: /admin dashboard/i })).toBeChecked();
  });

  it("never shows a price", () => {
    const { container } = render(<Estimate />);
    expect(container.textContent).not.toMatch(/[$৳]|price|cost|bdt|usd/i);
  });

  it("hands the plan to the contact form", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Estimate />
        <Contact />
      </>,
    );

    await user.click(screen.getByRole("radio", { name: /online store/i }));
    await user.click(screen.getByRole("checkbox", { name: /online payments/i }));
    await user.click(screen.getByRole("link", { name: /send this plan/i }));

    await waitFor(() => expect(screen.getByLabelText("Subject")).toHaveValue("Online store — project plan"));
    const message = (screen.getByLabelText("Message") as HTMLTextAreaElement).value;
    expect(message).toMatch(/online store/);
    expect(message).toMatch(/Online payments/);
    expect(message).toMatch(/estimator suggested/);
  });
});

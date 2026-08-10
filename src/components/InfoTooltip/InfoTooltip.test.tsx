import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoTooltip } from "./InfoTooltip";

describe("InfoTooltip", () => {
  it("shows and hides the tooltip when the icon is clicked", async () => {
    const user = userEvent.setup();
    render(<InfoTooltip text="Helpful tip" />);

    expect(screen.queryByText("Helpful tip")).not.toBeInTheDocument();

    await user.click(screen.getByText("ⓘ"));
    expect(screen.getByText("Helpful tip")).toBeInTheDocument();

    await user.click(screen.getByText("ⓘ"));
    expect(screen.queryByText("Helpful tip")).not.toBeInTheDocument();
  });
});

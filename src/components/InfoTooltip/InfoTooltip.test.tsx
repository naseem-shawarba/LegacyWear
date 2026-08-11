import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoTooltip } from "./InfoTooltip";

describe("InfoTooltip", () => {
  describe("Rendering", () => {
    it("renders the icon and hides the tooltip initially", () => {
      render(<InfoTooltip text="Helpful tip" />);

      expect(screen.getByText("ⓘ")).toBeInTheDocument();
      expect(screen.queryByText("Helpful tip")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("toggles the tooltip visibility when the icon is clicked", async () => {
      const user = userEvent.setup();
      render(<InfoTooltip text="Helpful tip" />);

      const icon = screen.getByText("ⓘ");

      await user.click(icon);
      expect(screen.getByText("Helpful tip")).toBeInTheDocument();

      await user.click(icon);
      expect(screen.queryByText("Helpful tip")).not.toBeInTheDocument();
    });

    it("stops event propagation when the icon is clicked", async () => {
      const user = userEvent.setup();
      const handleParentClick = jest.fn();

      render(
        <div onClick={handleParentClick}>
          <InfoTooltip text="Propagation test" />
        </div>,
      );

      await user.click(screen.getByText("ⓘ"));

      expect(handleParentClick).not.toHaveBeenCalled();
      expect(screen.getByText("Propagation test")).toBeInTheDocument();
    });
  });
});

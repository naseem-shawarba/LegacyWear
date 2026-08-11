import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  describe("Interactions and Attributes", () => {
    it("renders children and forwards button props", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button type="submit" onClick={handleClick} disabled>
          Save
        </Button>,
      );

      const button = screen.getByRole("button", { name: /save/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("type", "submit");

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("is enabled by default and calls onClick", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Save</Button>);

      const button = screen.getByRole("button", { name: /save/i });
      expect(button).toBeEnabled();

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Variants and Styling", () => {
    it("applies the default variant classes when no variant is provided", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button", { name: /default/i });

      expect(button.className).toMatch(/button/i);
      expect(button.className).toMatch(/default/i);
    });

    it("applies the primary variant class", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button", { name: /primary/i });

      expect(button.className).toMatch(/primary/i);
    });

    it("applies the danger variant class", () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole("button", { name: /danger/i });

      expect(button.className).toMatch(/danger/i);
    });

    it("merges custom classNames correctly", () => {
      render(<Button className="custom-test-class">Custom</Button>);
      const button = screen.getByRole("button", { name: /custom/i });

      expect(button.className).toContain("custom-test-class");
      expect(button.className).toMatch(/default/i);
    });
  });
});

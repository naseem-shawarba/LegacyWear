import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
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
    expect(handleClick).toHaveBeenCalledTimes(0);
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

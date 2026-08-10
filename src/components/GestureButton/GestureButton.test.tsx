import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GestureButton } from "./GestureButton";

describe("GestureButton", () => {
  it("renders disabled state by default with slash line and enable title", () => {
    render(<GestureButton />);

    const button = screen.getByRole("button", { name: "Enable Gestures" });
    expect(button).toBeInTheDocument();

    const line = button.querySelector("line");
    expect(line).toBeInTheDocument();
  });

  it("renders active state when isListeningToGestures is true", () => {
    render(<GestureButton isListeningToGestures={true} />);

    const button = screen.getByRole("button", { name: "Disable Gestures" });
    expect(button).toBeInTheDocument();

    const line = button.querySelector("line");
    expect(line).not.toBeInTheDocument();
  });

  it("triggers onClick when clicked", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<GestureButton onClick={handleClick} />);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("stops click propagation to parent elements", async () => {
    const handleParentClick = jest.fn();
    const handleButtonClick = jest.fn();
    const user = userEvent.setup();

    render(
      <div onClick={handleParentClick}>
        <GestureButton onClick={handleButtonClick} />
      </div>,
    );

    await user.click(screen.getByRole("button"));

    expect(handleButtonClick).toHaveBeenCalledTimes(1);
    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it("handles click safely when onClick is not provided", async () => {
    const user = userEvent.setup();
    render(<GestureButton />);

    await expect(user.click(screen.getByRole("button"))).resolves.not.toThrow();
  });
});

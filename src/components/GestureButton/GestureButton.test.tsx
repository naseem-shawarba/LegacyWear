import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GestureButton } from "./GestureButton";
import React from "react";

describe("GestureButton", () => {
  describe("Rendering and Styling", () => {
    it("renders default state with slash line and enable title", () => {
      render(<GestureButton />);
      const button = screen.getByRole("button", { name: "Enable Gestures" });

      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      expect(button.querySelector("line")).toBeInTheDocument();
      expect(button.className).not.toContain("gestureActive");
    });

    it("renders active state when isListeningToGestures is true", () => {
      render(<GestureButton isListeningToGestures={true} />);
      const button = screen.getByRole("button", { name: "Disable Gestures" });

      expect(button).toBeInTheDocument();
      expect(button.querySelector("line")).not.toBeInTheDocument();
      expect(button.className).toContain("gestureActive");
    });

    it("applies the disabled attribute and class when isDisabled is true", () => {
      render(<GestureButton isDisabled={true} />);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
      expect(button.className).toContain("disabled");
    });
  });

  describe("Interactions", () => {
    it("triggers onClick when clicked", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<GestureButton onClick={handleClick} />);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not trigger onClick when disabled", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<GestureButton onClick={handleClick} isDisabled={true} />);

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
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

      await expect(
        user.click(screen.getByRole("button")),
      ).resolves.not.toThrow();
    });
  });
});

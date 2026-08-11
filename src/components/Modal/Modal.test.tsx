import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  describe("Visibility and Rendering", () => {
    it("returns null when isOpen is false", () => {
      const { container } = render(
        <Modal isOpen={false} onClick={jest.fn()} buttonLabel="Continue">
          <span>Hidden</span>
        </Modal>,
      );

      expect(container).toBeEmptyDOMElement();
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    });

    it("renders children and the dynamic button label when isOpen is true", () => {
      render(
        <Modal isOpen={true} onClick={jest.fn()} buttonLabel="Accept Terms">
          <p>Modal body content</p>
        </Modal>,
      );

      expect(screen.getByText("Modal body content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /accept terms/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls the onClick action handler when the button is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Modal isOpen={true} onClick={handleClick} buttonLabel="Continue">
          <p>Modal body</p>
        </Modal>,
      );

      await user.click(screen.getByRole("button", { name: /continue/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

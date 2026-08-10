import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders its children and calls the action handler", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Modal isOpen={true} onClick={onClick} buttonLabel="Continue">
        <p>Modal body</p>
      </Modal>,
    );

    expect(screen.getByText("Modal body")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("returns null when closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClick={jest.fn()} buttonLabel="Continue">
        <span>Hidden</span>
      </Modal>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

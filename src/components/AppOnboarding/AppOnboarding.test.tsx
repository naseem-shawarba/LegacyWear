import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppOnboarding } from "./AppOnboarding";

describe("AppOnboarding", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the onboarding modal when the disclaimer has not been accepted", async () => {
    render(<AppOnboarding />);

    expect(await screen.findByText("Important Notice")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /i understand & accept/i }),
    ).toBeInTheDocument();
  });

  it("does not render when the disclaimer has already been accepted", () => {
    window.localStorage.setItem("disclaimerAccepted_v_0.1.0", "true");

    const { container } = render(<AppOnboarding />);

    expect(container).toBeEmptyDOMElement();
  });

  it("hides the modal after accepting the disclaimer", async () => {
    const user = userEvent.setup();
    render(<AppOnboarding />);

    await user.click(
      screen.getByRole("button", { name: /i understand & accept/i }),
    );

    expect(screen.queryByText("Important Notice")).not.toBeInTheDocument();
    expect(window.localStorage.getItem("disclaimerAccepted_v_0.1.0")).toBe(
      "true",
    );
  });
});

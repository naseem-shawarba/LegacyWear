import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppOnboarding } from "./AppOnboarding";

jest.mock("../../../package.json", () => ({
  version: "99.9.9",
}));

const STORAGE_KEY = "disclaimerAccepted_v_99.9.9";

describe("AppOnboarding", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe("Initial Render Status", () => {
    it("shows the onboarding modal when the disclaimer has not been accepted", async () => {
      render(<AppOnboarding />);
      expect(await screen.findByText("Important Notice")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /i understand & accept/i }),
      ).toBeInTheDocument();
    });

    it("does not render when the disclaimer has already been accepted", () => {
      window.localStorage.setItem(STORAGE_KEY, "true");
      const { container } = render(<AppOnboarding />);
      expect(container).toBeEmptyDOMElement();
    });

    it("shows the modal if the local storage value exists but is not 'true'", async () => {
      window.localStorage.setItem(STORAGE_KEY, "false");
      render(<AppOnboarding />);
      expect(
        screen.getByRole("button", { name: /i understand & accept/i }),
      ).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("hides the modal and updates localStorage after clicking accept", async () => {
      const user = userEvent.setup();
      render(<AppOnboarding />);

      await user.click(
        screen.getByRole("button", { name: /i understand & accept/i }),
      );

      expect(screen.queryByText("Important Notice")).not.toBeInTheDocument();
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe("true");
    });
  });
});

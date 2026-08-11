import { render, screen } from "@testing-library/react";
import { About } from "./About";

jest.mock("../../components", () => ({
  AppInfo: () => <div data-testid="app-info" />,
}));

describe("About", () => {
  describe("Rendering", () => {
    it("renders the app info content", () => {
      render(<About />);

      expect(screen.getByTestId("app-info")).toBeInTheDocument();
    });
  });
});

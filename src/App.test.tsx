import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./hooks", () => ({
  useGoatCounter: jest.fn(),
}));

jest.mock("./components", () => ({
  Header: () => <div data-testid="header" />,
  AppOnboarding: () => null,
}));

jest.mock("./pages", () => ({
  Home: () => <div>Home page</div>,
  About: () => <div>About page</div>,
}));

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");

    return {
      BrowserRouter: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Routes: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Route: ({ element }: { element: React.ReactNode }) => <>{element}</>,
    };
  },
  { virtual: true },
);

describe("App", () => {
  describe("Footer Links", () => {
    it("renders the footer hyperlinks to the GitHub and Reddit profiles", () => {
      render(<App />);

      expect(
        screen.getByText(/developed by naseem shawarba/i),
      ).toBeInTheDocument();

      const githubLink = document.querySelector(
        'a[href="https://github.com/naseem-shawarba/legacy-wear"]',
      );
      const redditLink = document.querySelector(
        'a[href="https://www.reddit.com/user/shinysn0w/"]',
      );

      expect(githubLink).toBeInTheDocument();
      expect(redditLink).toBeInTheDocument();
    });
  });
});

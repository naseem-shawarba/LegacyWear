import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";
import React from "react";

jest.mock("../../../package.json", () => ({
  version: "99.9.9",
}));

jest.mock(
  "react-router-dom",
  () => ({
    NavLink: ({
      children,
      to,
      onClick,
    }: {
      children: React.ReactNode;
      to: string;
      onClick?: () => void;
    }) => (
      <a href={to} onClick={onClick}>
        {children}
      </a>
    ),
  }),
  { virtual: true },
);

describe("Header", () => {
  describe("Initial Render", () => {
    it("renders the navigation links, the closed menu, and the app version", () => {
      const { container } = render(<Header />);
      const nav = container.querySelector("nav");

      expect(nav?.className).not.toContain("open");
      expect(screen.getByText("version: 99.9.9")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });
  });

  describe("Menu Interactions", () => {
    it("toggles the menu open and closed using the burger button", async () => {
      const user = userEvent.setup();
      const { container } = render(<Header />);
      const button = screen.getByRole("button");
      const nav = container.querySelector("nav");

      await user.click(button);
      expect(nav?.className).toContain("open");

      await user.click(button);
      expect(nav?.className).not.toContain("open");
    });

    it("closes the menu when clicking the overlay", async () => {
      const user = userEvent.setup();
      const { container } = render(<Header />);
      const button = screen.getByRole("button");
      const nav = container.querySelector("nav");

      await user.click(button);

      const overlay = container.querySelector(
        'div[class*="overlay"]',
      ) as HTMLElement;
      await user.click(overlay);

      expect(nav?.className).not.toContain("open");
    });

    it("closes the menu when clicking a navigation link", async () => {
      const user = userEvent.setup();
      const { container } = render(<Header />);
      const button = screen.getByRole("button");
      const nav = container.querySelector("nav");

      await user.click(button);
      await user.click(screen.getByText("Dashboard"));

      expect(nav?.className).not.toContain("open");
    });
  });
});

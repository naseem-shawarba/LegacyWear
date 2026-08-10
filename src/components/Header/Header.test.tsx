import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock(
  "react-router-dom",
  () => ({
    NavLink: ({ children, to, onClick, style }: any) => (
      <a href={to} onClick={onClick} style={style?.({ isActive: false })}>
        {children}
      </a>
    ),
  }),
  { virtual: true },
);

import { Header } from "./Header";

describe("Header", () => {
  it("renders navigation links and toggles the menu", async () => {
    const user = userEvent.setup();
    const { container } = render(<Header />);

    const button = screen.getByRole("button");
    const nav = container.querySelector("nav");
    expect(nav?.className).not.toContain("open");

    await user.click(button);

    expect(nav?.className).toContain("open");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});

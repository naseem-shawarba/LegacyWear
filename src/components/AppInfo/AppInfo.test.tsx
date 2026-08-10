import { render, screen } from "@testing-library/react";
import { AppInfo } from "./AppInfo";

describe("AppInfo", () => {
  it("renders the important notice copy and external links", () => {
    render(<AppInfo />);

    expect(
      screen.getByRole("heading", { name: /important notice/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/legacy wear/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /readme on github/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/naseem-shawarba/LegacyWear#supported-devices",
    );
    expect(
      screen.getByRole("link", { name: /web bluetooth/i }),
    ).toHaveAttribute("href", "https://web.dev/bluetooth/");
  });
});

import { render } from "@testing-library/react";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders a divider element", () => {
    const { container } = render(<Divider />);

    expect(container.firstChild).toBeInTheDocument();
  });
});

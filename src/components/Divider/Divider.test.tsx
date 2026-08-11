import { render } from "@testing-library/react";
import { Divider } from "./Divider";
import React from "react";

describe("Divider", () => {
  describe("Rendering", () => {
    it("renders successfully in the document", () => {
      const { container } = render(<Divider />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("applies the divider CSS class", () => {
      const { container } = render(<Divider />);
      const dividerElement = container.firstChild as HTMLElement;

      expect(dividerElement.className).toContain("divider");
    });
  });
});

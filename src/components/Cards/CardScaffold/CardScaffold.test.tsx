import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardScaffold } from "./CardScaffold";
import React from "react";

jest.mock("../../InfoTooltip", () => ({
  InfoTooltip: ({ text }: { text: string }) => (
    <span data-testid="info-tooltip">{text}</span>
  ),
}));

describe("CardScaffold", () => {
  const defaultProps = {
    id: "card-1",
    title: "Test Title",
    isOpen: true,
    onOpenCardClick: jest.fn(),
    children: <div>Child Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders title and children when open", () => {
      render(<CardScaffold {...defaultProps} />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("hides children and applies collapsed class when isOpen is false", () => {
      const { container } = render(
        <CardScaffold {...defaultProps} isOpen={false} />,
      );
      expect(screen.queryByText("Child Content")).not.toBeInTheDocument();
      expect(container.firstChild).toHaveClass("collapsed");
    });
  });

  describe("Interactions & Accessibility", () => {
    it("calls onOpenCardClick with id when the header is clicked", async () => {
      const user = userEvent.setup();
      render(<CardScaffold {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Test Title" }));
      expect(defaultProps.onOpenCardClick).toHaveBeenCalledWith("card-1");
    });

    it("calls onOpenCardClick with id when the chevron is clicked", async () => {
      const user = userEvent.setup();
      render(<CardScaffold {...defaultProps} />);

      await user.click(screen.getByText("▾"));
      expect(defaultProps.onOpenCardClick).toHaveBeenCalledWith("card-1");
    });

    it("exposes the header as a keyboard-operable expand control", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<CardScaffold {...defaultProps} />);

      const toggle = screen.getByRole("button", { name: "Test Title" });
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      expect(toggle).toHaveAttribute("aria-controls", "card-1-content");

      await user.tab();
      expect(toggle).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(defaultProps.onOpenCardClick).toHaveBeenCalledWith("card-1");

      await user.keyboard(" ");
      expect(defaultProps.onOpenCardClick).toHaveBeenCalledTimes(2);

      rerender(<CardScaffold {...defaultProps} isOpen={false} />);
      expect(
        screen.getByRole("button", { name: "Test Title" }),
      ).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Optional Properties", () => {
    it("renders hint tooltip when provided", () => {
      render(<CardScaffold {...defaultProps} hint="Helpful hint" />);
      expect(screen.getByTestId("info-tooltip")).toHaveTextContent(
        "Helpful hint",
      );
    });

    it("renders unsupported message, badge, and applies unsupported class when isUnsupported is true", () => {
      const { container } = render(
        <CardScaffold {...defaultProps} isUnsupported={true} />,
      );

      expect(container.firstChild).toHaveClass("unsupported");
      expect(screen.getByText("Not supported")).toBeInTheDocument();
      expect(
        screen.getByText(/This feature is not supported on this device/i),
      ).toBeInTheDocument();
    });

    it("shows the unsupported badge but hides the message when closed", () => {
      render(
        <CardScaffold {...defaultProps} isUnsupported={true} isOpen={false} />,
      );

      expect(screen.getByText("Not supported")).toBeInTheDocument();
      expect(
        screen.queryByText(/This feature is not supported on this device/i),
      ).not.toBeInTheDocument();
    });
  });
});

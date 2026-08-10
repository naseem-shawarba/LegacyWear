import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardScaffold } from "./CardScaffold";

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

  it("renders title and children when open", () => {
    render(<CardScaffold {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("calls onOpenCardClick with id when the header is clicked", async () => {
    const user = userEvent.setup();
    render(<CardScaffold {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Test Title" }));
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
    expect(screen.getByRole("button", { name: "Test Title" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("hides children when isOpen is false", () => {
    render(<CardScaffold {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Child Content")).not.toBeInTheDocument();
  });

  it("renders hint tooltip when provided", () => {
    render(<CardScaffold {...defaultProps} hint="Helpful hint" />);

    expect(screen.getByTestId("info-tooltip")).toHaveTextContent(
      "Helpful hint",
    );
  });

  it("renders unsupported message and badge when isUnsupported is true", () => {
    render(<CardScaffold {...defaultProps} isUnsupported={true} />);

    expect(screen.getByText("Not supported")).toBeInTheDocument();
    expect(
      screen.getByText(/This feature is not supported on this device/i),
    ).toBeInTheDocument();
  });
});

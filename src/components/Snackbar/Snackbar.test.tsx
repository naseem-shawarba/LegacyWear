import { render, screen, act } from "@testing-library/react";
import { Snackbar } from "./Snackbar";

describe("Snackbar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders the provided message initially", () => {
      render(<Snackbar message="Success saved!" />);
      expect(screen.getByText("Success saved!")).toBeInTheDocument();
    });
  });

  describe("Timeout Behavior", () => {
    it("hides the snackbar after the default 9000ms duration", () => {
      render(<Snackbar message="Timeout test" />);

      expect(screen.getByText("Timeout test")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(9000);
      });

      expect(screen.queryByText("Timeout test")).not.toBeInTheDocument();
    });

    it("hides the snackbar after a custom duration", () => {
      render(<Snackbar message="Custom timeout" duration={3000} />);

      act(() => {
        jest.advanceTimersByTime(2999);
      });
      // Should still be visible right before timeout
      expect(screen.getByText("Custom timeout")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      // Should disappear exactly at 3000ms
      expect(screen.queryByText("Custom timeout")).not.toBeInTheDocument();
    });
  });
});

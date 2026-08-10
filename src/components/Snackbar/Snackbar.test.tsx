import { act } from "react";
import { render, screen } from "@testing-library/react";
import { Snackbar } from "./Snackbar";

describe("Snackbar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the message and removes itself after the duration", () => {
    render(<Snackbar message="Saved" duration={1000} />);

    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });
});

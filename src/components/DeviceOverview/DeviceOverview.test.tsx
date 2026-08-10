import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceOverview } from "./DeviceOverview";

describe("DeviceOverview", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });
  });

  it("shows the placeholder state when no device is connected", () => {
    render(
      <DeviceOverview
        isConnected={false}
        isSyncing={false}
        isPairing={false}
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByText("No Device")).toBeInTheDocument();
    expect(screen.getByText("Click to connect")).toBeInTheDocument();
  });

  it("renders connected device information and calls the handler", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <DeviceOverview
        deviceInfo={{
          name: "Legacy Watch",
          batteryLevel: 82,
          activityPoints: 1200,
        }}
        isConnected={true}
        isSyncing={false}
        isPairing={false}
        onClick={onClick}
      />,
    );

    expect(screen.getByText("Legacy Watch")).toBeInTheDocument();
    expect(screen.getByText("1200 points")).toBeInTheDocument();
    expect(screen.getByText("Click to refresh")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

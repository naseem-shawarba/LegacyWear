import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceOverview } from "./DeviceOverview";

// Mock the BatteryIcon to isolate the component test
jest.mock("../Icons", () => ({
  BatteryIcon: () => <div data-testid="battery-icon" />,
}));

const mockDeviceInfo = {
  name: "Test Tracker",
  batteryLevel: 75,
  activityPoints: 1200,
};

describe("DeviceOverview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to desktop width before each test
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe("Render States", () => {
    it("renders disconnected state with no device", () => {
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
      expect(screen.queryByTestId("battery-icon")).not.toBeInTheDocument();
      expect(screen.queryByText(/points/)).not.toBeInTheDocument();
    });

    it("renders connected state with device details", () => {
      render(
        <DeviceOverview
          isConnected={true}
          deviceInfo={mockDeviceInfo}
          isSyncing={false}
          isPairing={false}
          onClick={jest.fn()}
        />,
      );

      expect(screen.getByText("Test Tracker")).toBeInTheDocument();
      expect(screen.getByText("1200 points")).toBeInTheDocument();
      expect(screen.getByText("Click to refresh")).toBeInTheDocument();
      expect(screen.getByTestId("battery-icon")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior (Mobile vs Desktop)", () => {
    it("displays 'Tap' on mobile screens initially", () => {
      Object.defineProperty(window, "innerWidth", { value: 500 });
      render(
        <DeviceOverview
          isConnected={false}
          isSyncing={false}
          isPairing={false}
          onClick={jest.fn()}
        />,
      );

      expect(screen.getByText("Tap to connect")).toBeInTheDocument();
    });

    it("updates text from 'Click' to 'Tap' on window resize", () => {
      render(
        <DeviceOverview
          isConnected={false}
          isSyncing={false}
          isPairing={false}
          onClick={jest.fn()}
        />,
      );

      expect(screen.getByText("Click to connect")).toBeInTheDocument();

      act(() => {
        Object.defineProperty(window, "innerWidth", { value: 500 });
        window.dispatchEvent(new Event("resize"));
      });

      expect(screen.getByText("Tap to connect")).toBeInTheDocument();
    });
  });

  describe("Interactions and Accessibility", () => {
    it("calls onClick when the container is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <DeviceOverview
          isConnected={false}
          isSyncing={false}
          isPairing={false}
          onClick={handleClick}
        />,
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disables interaction and sets tabIndex to -1 when syncing", () => {
      render(
        <DeviceOverview
          isConnected={false}
          isSyncing={true}
          isPairing={false}
          onClick={jest.fn()}
        />,
      );

      expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
    });

    it("disables interaction and sets tabIndex to -1 when pairing", () => {
      render(
        <DeviceOverview
          isConnected={false}
          isSyncing={false}
          isPairing={true}
          onClick={jest.fn()}
        />,
      );

      expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
    });
  });
});

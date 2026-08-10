import { render, screen } from "@testing-library/react";
import { BatteryIcon } from "./BatteryIcon";

const levelClassOf = (container: HTMLElement) =>
  container.querySelector('[class*="batteryLevel"]')?.className ?? "";

describe("BatteryIcon", () => {
  it("defaults to an empty battery", () => {
    const { container } = render(<BatteryIcon />);

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(levelClassOf(container)).toContain("levelCritical");
  });

  it.each([
    [10, "levelCritical"],
    [20, "levelCritical"],
    [21, "levelWarning"],
    [50, "levelWarning"],
    [51, "levelHealthy"],
    [100, "levelHealthy"],
  ])("renders %i%% as %s", (batteryLevel, expectedClass) => {
    const { container } = render(<BatteryIcon batteryLevel={batteryLevel} />);

    expect(screen.getByText(`${batteryLevel}%`)).toBeInTheDocument();
    expect(levelClassOf(container)).toContain(expectedClass);
  });

  it("scales the fill to the charge level", () => {
    const { container } = render(<BatteryIcon batteryLevel={64} />);

    expect(
      container.querySelector<HTMLElement>('[class*="batteryLevel"]')?.style
        .height,
    ).toBe("64%");
  });
});

import { render, screen } from "@testing-library/react";
import { BatteryIcon } from "./BatteryIcon";

const getBatteryFillElement = (container: HTMLElement): HTMLElement | null =>
  container.querySelector('[class*="batteryLevel"]');

const levelClassOf = (container: HTMLElement): string =>
  getBatteryFillElement(container)?.className ?? "";

describe("BatteryIcon", () => {
  describe("Default Rendering", () => {
    it("defaults to an empty battery (0%) when no prop is provided", () => {
      const { container } = render(<BatteryIcon />);

      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(levelClassOf(container)).toContain("levelCritical");
      expect(getBatteryFillElement(container)?.style.height).toBe("0%");
    });
  });

  describe("Status Classes (Thresholds)", () => {
    it.each([
      [0, "levelCritical"],
      [10, "levelCritical"],
      [20, "levelCritical"],
      [21, "levelWarning"],
      [50, "levelWarning"],
      [51, "levelHealthy"],
      [100, "levelHealthy"],
    ])(
      "renders %i%% battery level with the %s class",
      (batteryLevel: number, expectedClass: string) => {
        const { container } = render(
          <BatteryIcon batteryLevel={batteryLevel} />,
        );

        expect(screen.getByText(`${batteryLevel}%`)).toBeInTheDocument();
        expect(levelClassOf(container)).toContain(expectedClass);
      },
    );
  });

  describe("Dynamic Styling", () => {
    it("scales the fill height to match the charge level", () => {
      const { container } = render(<BatteryIcon batteryLevel={64} />);

      expect(getBatteryFillElement(container)?.style.height).toBe("64%");
    });
  });
});

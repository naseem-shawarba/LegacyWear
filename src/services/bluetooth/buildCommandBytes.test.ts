import type { FormValues } from "../../hooks/useSettings";
import type { Options } from "./payloads";

jest.mock("./payloads", () => ({
  setCurrentTimePayload: { computeValue: jest.fn() },
  setAlarmPayload: { computeValue: jest.fn() },
  enableAlarmPayload: { value: [21] },
  disableAlarmPayload: { value: [22] },
  setMoveNudgePayload: { computeValue: jest.fn() },
  setDailyActivityPointsGoalPayload: { computeValue: jest.fn() },
  enableTimePayload: { value: [50] },
  disableTimePayload: { value: [51] },
  showTimeThenProgressPayload: { value: [52] },
  showProgressThenTimePayload: { value: [53] },
  enableTripleTapPayload: { value: [60] },
  disableTripleTapPayload: { value: [61] },
}));

const { buildCommandBytes } = require("./buildCommandBytes");
const payloads = require("./payloads");

const formValues: FormValues = {
  alarm: { time: "07:30", repeat: true, enabled: true },
  nudgeMove: {
    startTime: "09:00",
    endTime: "17:00",
    interval: 30,
    isEnabled: true,
  },
  dailyActivityGoal: { points: 1200 },
  preferences: {
    showTime: true,
    showTimeFirst: true,
    isTripleTapEnabled: false,
  },
};

const allSupported: Options = {
  isNudgeMoveUnsupported: false,
  isAlarmUnsupported: false,
  isDailyActivityGoalUnsupported: false,
  isPreferencesUnsupported: false,
};

const build = (
  values: Partial<FormValues> = {},
  options: Partial<Options> = {},
) =>
  buildCommandBytes(
    { ...formValues, ...values },
    { ...allSupported, ...options },
  );

describe("buildCommandBytes", () => {
  beforeEach(() => {
    payloads.setCurrentTimePayload.computeValue.mockReturnValue([10]);
    payloads.setAlarmPayload.computeValue.mockReturnValue([20]);
    payloads.setMoveNudgePayload.computeValue.mockReturnValue([30]);
    payloads.setDailyActivityPointsGoalPayload.computeValue.mockReturnValue([
      40,
    ]);
  });

  describe("Time", () => {
    it("always leads with the current time", () => {
      expect(build()[0]).toEqual([10]);
    });
  });

  describe("Alarm", () => {
    it("includes alarm commands and forwards the alarm settings", () => {
      const bytesList = build();

      expect(payloads.setAlarmPayload.computeValue).toHaveBeenCalledWith({
        time: "07:30",
        repeat: true,
      });
      expect(bytesList).toContainEqual([20]);
      expect(bytesList).toContainEqual([21]);
    });

    it("disables the alarm when it is switched off", () => {
      const bytesList = build({
        alarm: { time: "07:30", repeat: true, enabled: false },
      });

      expect(bytesList).toContainEqual([22]);
      expect(bytesList).not.toContainEqual([21]);
    });

    it("omits alarm commands entirely when the device does not support them", () => {
      const bytesList = build({}, { isAlarmUnsupported: true });

      expect(payloads.setAlarmPayload.computeValue).not.toHaveBeenCalled();
      expect(bytesList).not.toContainEqual([20]);
      expect(bytesList).not.toContainEqual([21]);
      expect(bytesList).not.toContainEqual([22]);
    });
  });

  describe("Nudge Move", () => {
    it("omits nudge move commands when the device does not support them", () => {
      expect(build()).toContainEqual([30]);

      const bytesList = build({}, { isNudgeMoveUnsupported: true });

      expect(bytesList).not.toContainEqual([30]);
    });
  });

  describe("Daily Activity Goal", () => {
    it("forwards the daily activity goal", () => {
      build();

      expect(
        payloads.setDailyActivityPointsGoalPayload.computeValue,
      ).toHaveBeenCalledWith({ points: 1200 });
    });
  });

  describe("Preferences", () => {
    it("picks the display order when the time is shown", () => {
      expect(build()).toEqual(expect.arrayContaining([[50], [52]]));

      const progressFirst = build({
        preferences: {
          showTime: true,
          showTimeFirst: false,
          isTripleTapEnabled: false,
        },
      });

      expect(progressFirst).toContainEqual([53]);
      expect(progressFirst).not.toContainEqual([52]);
    });

    it("skips the display order entirely when the time is hidden", () => {
      const bytesList = build({
        preferences: {
          showTime: false,
          showTimeFirst: true,
          isTripleTapEnabled: false,
        },
      });

      expect(bytesList).toContainEqual([51]);
      expect(bytesList).not.toContainEqual([50]);
      expect(bytesList).not.toContainEqual([52]);
      expect(bytesList).not.toContainEqual([53]);
    });

    it("toggles triple tap", () => {
      expect(build()).toContainEqual([61]);

      const enabled = build({
        preferences: {
          showTime: true,
          showTimeFirst: true,
          isTripleTapEnabled: true,
        },
      });

      expect(enabled).toContainEqual([60]);
      expect(enabled).not.toContainEqual([61]);
    });
  });
});

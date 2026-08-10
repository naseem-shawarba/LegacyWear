import type { FormValues } from "./types";

export const LOCAL_STORAGE_KEY = "settings";

export const FORM_DEFAULT_VALUES: FormValues = {
  alarm: { time: "07:00", repeat: false, enabled: false },
  nudgeMove: {
    startTime: "09:00",
    endTime: "18:00",
    interval: 30,
    isEnabled: false,
  },
  dailyActivityGoal: {
    points: 1000,
  },
  preferences: {
    showTime: true,
    showTimeFirst: true,
    isTripleTapEnabled: false,
  },
};

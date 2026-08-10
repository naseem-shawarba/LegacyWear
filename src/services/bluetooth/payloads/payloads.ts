import type { Payload, SimpleValuePayload, ComputeValuePayload } from "./types";
import {
  encodeCurrentDateAndTime,
  encodeAlarmTime,
  encodeMoveNudge,
  encodeDailyActivityPointsGoal,
} from "./utils";
import { isDevToolsEnabled } from "../../../utils";

export const startSyncIndicatorPayload: SimpleValuePayload = {
  id: "start_sync_indicator",
  name: "Start Sync Indicator",
  category: "visuals",
  value: [],
};

export const stopSyncIndicatorPayload: SimpleValuePayload = {
  id: "stop_sync_indicator",
  name: "Stop SyncIndicator",
  category: "visuals",
  value: [],
};

export const setCurrentTimePayload: ComputeValuePayload = {
  id: "set_current_time",
  name: "Set Current Time",
  category: "time",
  computeValue: encodeCurrentDateAndTime,
};

export const setAlarmPayload: ComputeValuePayload = {
  id: "set_alarm",
  name: "Set Alarm",
  category: "alarm",
  computeValue: encodeAlarmTime,
};

export const enableAlarmPayload: SimpleValuePayload = {
  id: "enable_alarm",
  name: "Enable Alarm",
  category: "alarm",
  value: [],
};
export const disableAlarmPayload: SimpleValuePayload = {
  id: "disable_alarm",
  name: "Disable Alarm",
  category: "alarm",
  value: [],
};

export const enableTimePayload: SimpleValuePayload = {
  id: "enable_time",
  name: "Enable Time",
  category: "visibility",
  value: [],
};
export const disableTimePayload: SimpleValuePayload = {
  id: "disable_time",
  name: "Disable Time",
  category: "visibility",
  value: [],
};

export const setMoveNudgePayload: ComputeValuePayload = {
  id: "set_move_nudge",
  name: "Set Move Nudge",
  category: "nudge",
  computeValue: encodeMoveNudge,
};

export const disableMoveNudgePayload: SimpleValuePayload = {
  id: "disable_move_nudge",
  name: "disable Move Nudge",
  category: "nudge",
  value: [],
};
export const setDailyActivityPointsGoalPayload: ComputeValuePayload = {
  id: "set_daily_activity_points_goal",
  name: "Set Daily Activity Points Goal",
  category: "dailyActivityPoints",
  computeValue: encodeDailyActivityPointsGoal,
};

export const showTimeThenProgressPayload: SimpleValuePayload = {
  id: "show_time_then_progress",
  name: "Show Time Then Progress",
  category: "visibility",
  value: [],
};

export const showProgressThenTimePayload: SimpleValuePayload = {
  id: "show_progress_then_time",
  name: "Show Progress Then Time",
  category: "visibility",
  value: [],
};

export const enableTripleTapPayload: SimpleValuePayload = {
  id: "enable_triple_tap",
  name: "Enable Triple Tap",
  category: "visibility",
  value: [],
};

export const disableTripleTapPayload: SimpleValuePayload = {
  id: "disable_triple_tap",
  name: "Disable Triple Tap",
  category: "visibility",
  value: [],
};

export const getBatteryPercentagePayload: SimpleValuePayload = {
  id: "get_battery_percentage",
  name: "Get Battery Percentage",
  category: "settings",
  value: [],
};

export const getDailyActivityPointsPayload: SimpleValuePayload = {
  id: "get_daily_activity_points",
  name: "Set Daily Activity Points",
  category: "dailyActivityPoints",
  value: [],
};

declare global {
  interface Window {
    payloads?: Record<string, Payload>;
  }
}

const allPayloads: Record<string, Payload> = {
  startSyncIndicatorPayload,
  stopSyncIndicatorPayload,
  setCurrentTimePayload,
  setAlarmPayload,
  enableAlarmPayload,
  disableAlarmPayload,
  enableTimePayload,
  disableTimePayload,
  setMoveNudgePayload,
  disableMoveNudgePayload,
  setDailyActivityPointsGoalPayload,
  showTimeThenProgressPayload,
  showProgressThenTimePayload,
  enableTripleTapPayload,
  disableTripleTapPayload,
  getBatteryPercentagePayload,
  getDailyActivityPointsPayload,
};

if (isDevToolsEnabled()) {
  window.payloads = allPayloads;
}

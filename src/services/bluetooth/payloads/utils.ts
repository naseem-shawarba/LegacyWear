import type { DeviceInfo } from "../../../types";
import type {
  EncodeAlarmTimeFn,
  EncodeMoveNudgeTn,
  EncodeDailyActivityPointsFn,
} from "./types";

export const unSupportedPayloadCategories = (
  deviceInfo?: DeviceInfo | null,
) => {
  const isNudgeMoveUnsupported = false;
  const isAlarmUnsupported = false;
  const isDailyActivityGoalUnsupported = false;
  const isPreferencesUnsupported = false;

  return {
    isNudgeMoveUnsupported,
    isAlarmUnsupported,
    isDailyActivityGoalUnsupported,
    isPreferencesUnsupported,
  };
};

// const _encodeDateAndTime = (date: Date) => {
//   return undefined;
// };

export const encodeDemoDateAndTime = () => {
  return undefined;
};

export const encodeCurrentDateAndTime = () => {
  return undefined;
};

export const encodeAlarmTime: EncodeAlarmTimeFn = ({ time, repeat }) => {
  return undefined;
};

export const encodeMoveNudge: EncodeMoveNudgeTn = ({
  startTime,
  endTime,
  interval,
  isEnabled,
}) => {
  return undefined;
};

export const encodeDailyActivityPointsGoal: EncodeDailyActivityPointsFn = ({
  points,
}) => {
  return undefined;
};

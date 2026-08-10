import {
  disableAlarmPayload,
  disableTimePayload,
  disableTripleTapPayload,
  enableAlarmPayload,
  enableTimePayload,
  enableTripleTapPayload,
  setAlarmPayload,
  setCurrentTimePayload,
  setDailyActivityPointsGoalPayload,
  setMoveNudgePayload,
  showProgressThenTimePayload,
  showTimeThenProgressPayload,
} from "./payloads";
import type { BuildCommandBytesFn } from "./types";

export const buildCommandBytes: BuildCommandBytesFn = (
  formValues,
  { isNudgeMoveUnsupported, isAlarmUnsupported },
) => {
  const bytesList: (number[] | Uint8Array | undefined)[] = [];

  // Time
  bytesList.push(setCurrentTimePayload.computeValue());

  // Alarm Commands
  if (!isAlarmUnsupported) {
    bytesList.push(
      setAlarmPayload.computeValue({
        time: formValues.alarm.time,
        repeat: formValues.alarm.repeat,
      }),
    );
    if (formValues.alarm.enabled) {
      bytesList.push(enableAlarmPayload.value);
    } else {
      bytesList.push(disableAlarmPayload.value);
    }
  }

  // Nudge Move Commands
  if (!isNudgeMoveUnsupported) {
    bytesList.push(setMoveNudgePayload.computeValue(formValues.nudgeMove));
  }

  // Daily Activity Goal Commands
  bytesList.push(
    setDailyActivityPointsGoalPayload.computeValue({
      points: formValues.dailyActivityGoal.points,
    }),
  );

  // Preferences Commands
  if (formValues.preferences.showTime) {
    bytesList.push(enableTimePayload.value);
    if (formValues.preferences.showTimeFirst) {
      bytesList.push(showTimeThenProgressPayload.value);
    } else {
      bytesList.push(showProgressThenTimePayload.value);
    }
  } else {
    bytesList.push(disableTimePayload.value);
  }

  if (formValues.preferences.isTripleTapEnabled) {
    bytesList.push(enableTripleTapPayload.value);
  } else {
    bytesList.push(disableTripleTapPayload.value);
  }

  return bytesList;
};

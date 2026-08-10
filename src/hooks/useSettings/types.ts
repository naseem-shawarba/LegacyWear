export type FormValues = {
  alarm: Alarm;
  nudgeMove: NudgeMove;
  dailyActivityGoal: DailyActivityGoal;
  preferences: Preferences;
};

type Alarm = {
  time: string;
  repeat: boolean;
  enabled: boolean;
};

type NudgeMove = {
  startTime: string;
  endTime: string;
  interval: number;
  isEnabled: boolean;
};

type DailyActivityGoal = {
  points: number;
};

type Preferences = {
  showTime: boolean;
  showTimeFirst: boolean;
  isTripleTapEnabled: boolean;
};

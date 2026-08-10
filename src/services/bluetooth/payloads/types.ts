export type Payload = SimpleValuePayload | ComputeValuePayload;

export type SimpleValuePayload = BasePayload & {
  value: number[] | Uint8Array;
  computeValue?: never;
};

export type ComputeValuePayload = BasePayload & {
  value?: never;
  computeValue: (params?: any) => number[] | Uint8Array | undefined;
};

type BasePayload = {
  id: string;
  name: string;
  category: string;
  supportedOnlyDevices?: string[];
};

export type EncodeAlarmTimeFn = (params: {
  time: string;
  repeat: boolean;
}) => Uint8Array | undefined;

export type EncodeMoveNudgeTn = (params: {
  startTime: string;
  endTime: string;
  interval: number;
  isEnabled: boolean;
}) => Uint8Array | undefined;

export type EncodeDailyActivityPointsFn = (params: {
  points: number;
}) => Uint8Array | undefined;

export type Options = {
  isNudgeMoveUnsupported: boolean;
  isAlarmUnsupported: boolean;
  isDailyActivityGoalUnsupported: boolean;
  isPreferencesUnsupported: boolean;
};

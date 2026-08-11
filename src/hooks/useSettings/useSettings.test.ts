import { act, renderHook } from "@testing-library/react";
import { useSettings } from "./useSettings";
import { FORM_DEFAULT_VALUES, LOCAL_STORAGE_KEY } from "./constants";

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("falls back to the defaults when nothing is persisted", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.methods.getValues()).toEqual(FORM_DEFAULT_VALUES);
  });

  it("restores persisted settings", () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        ...FORM_DEFAULT_VALUES,
        dailyActivityGoal: { points: 4200 },
      }),
    );

    const { result } = renderHook(() => useSettings());

    expect(result.current.methods.getValues("dailyActivityGoal.points")).toBe(
      4200,
    );
  });

  it("fills in fields missing from an older persisted schema", () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ alarm: { time: "05:15" } }),
    );

    const { result } = renderHook(() => useSettings());
    const values = result.current.methods.getValues();

    expect(values.alarm.time).toBe("05:15");
    expect(values.alarm.enabled).toBe(FORM_DEFAULT_VALUES.alarm.enabled);
    expect(values.nudgeMove).toEqual(FORM_DEFAULT_VALUES.nudgeMove);
    expect(values.preferences).toEqual(FORM_DEFAULT_VALUES.preferences);
  });

  it("does not blow up on corrupted storage", () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem(LOCAL_STORAGE_KEY, "{not json");

    const { result } = renderHook(() => useSettings());

    expect(result.current.methods.getValues()).toEqual(FORM_DEFAULT_VALUES);
    expect(console.warn).toHaveBeenCalled();
  });

  it("handles localStorage.getItem throwing an error on read", () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    const { result } = renderHook(() => useSettings());

    expect(result.current.methods.getValues()).toEqual(FORM_DEFAULT_VALUES);
    expect(console.warn).toHaveBeenCalledWith(
      "Discarding unreadable persisted settings",
      expect.any(Error),
    );
  });

  it("handles non-object JSON values in localStorage", () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "12345");

    const { result } = renderHook(() => useSettings());

    expect(result.current.methods.getValues()).toEqual(FORM_DEFAULT_VALUES);
  });

  it("persists and resets the dirty state after a successful send", () => {
    const { result } = renderHook(() => {
      const settings = useSettings();
      return { ...settings, isDirty: settings.methods.formState.isDirty };
    });

    act(() => {
      result.current.methods.setValue("dailyActivityGoal.points", 3000, {
        shouldDirty: true,
      });
    });
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.handleSuccessfulSend();
    });

    expect(result.current.isDirty).toBe(false);
    expect(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) as string)
        .dailyActivityGoal.points,
    ).toBe(3000);
  });

  it("survives a storage write being rejected", () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const { result } = renderHook(() => useSettings());

    expect(() =>
      act(() => result.current.handleSuccessfulSend()),
    ).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });
});

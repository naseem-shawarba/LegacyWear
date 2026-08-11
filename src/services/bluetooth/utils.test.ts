import { delay } from "./utils";

describe("delay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resolves after the specified duration", async () => {
    const spy = jest.fn();

    delay(100).then(spy);

    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    await Promise.resolve();
    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await Promise.resolve();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("resolves after the default duration of 50ms when no argument is provided", async () => {
    const spy = jest.fn();

    delay().then(spy);

    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(49);
    await Promise.resolve();
    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await Promise.resolve();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

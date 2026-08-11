import { isDevToolsEnabled } from "./devTools";

describe("isDevToolsEnabled", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      originalNodeEnv;
    window.history.pushState({}, "", window.location.pathname);
  });

  it("returns true when NODE_ENV is development", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    expect(isDevToolsEnabled()).toBe(true);
  });

  it.each(["devTools=1", "devTools=true", "dev=1", "dev=true"])(
    "returns true when query parameter %s is present",
    (query) => {
      (process.env as Record<string, string | undefined>).NODE_ENV =
        "production";
      window.history.pushState({}, "", `/?${query}`);
      expect(isDevToolsEnabled()).toBe(true);
    },
  );

  it.each(["devTools=0", "devTools=false", "other=1", ""])(
    "returns false when query parameter is %s or absent in production",
    (query) => {
      (process.env as Record<string, string | undefined>).NODE_ENV =
        "production";
      window.history.pushState({}, "", query ? `/?${query}` : "/");
      expect(isDevToolsEnabled()).toBe(false);
    },
  );
});

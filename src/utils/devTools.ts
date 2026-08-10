const DEV_TOOLS_QUERY_KEYS = ["devTools", "dev"];
const TRUTHY_QUERY_VALUES = ["1", "true"];

export const isDevToolsEnabled = () => {
  if (process.env.NODE_ENV === "development") return true;

  const searchParams = new URLSearchParams(window.location.search);
  return DEV_TOOLS_QUERY_KEYS.some((key) =>
    TRUTHY_QUERY_VALUES.includes(searchParams.get(key) ?? ""),
  );
};

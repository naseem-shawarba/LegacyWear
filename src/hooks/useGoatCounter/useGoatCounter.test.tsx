import { renderHook } from "@testing-library/react";
import { useGoatCounter } from "./useGoatCounter";

const mockUseLocation = jest.fn();

jest.mock(
  "react-router-dom",
  () => ({
    useLocation: () => mockUseLocation(),
  }),
  { virtual: true },
);

describe("useGoatCounter", () => {
  beforeEach(() => {
    document.getElementById("goatcounter-script")?.remove();
    delete (window as any).goatcounter;
    mockUseLocation.mockReturnValue({ pathname: "/test", search: "?param=1" });
  });

  it("injects the script tag with correct attributes", () => {
    renderHook(() => useGoatCounter({ name: "my-site" }));

    const script = document.getElementById(
      "goatcounter-script",
    ) as HTMLScriptElement;

    expect(script).toBeInTheDocument();
    expect(script.src).toContain("//gc.zgo.at/count.js");
    expect(script.getAttribute("data-goatcounter")).toBe(
      "https://my-site.goatcounter.com/count",
    );
  });

  it("does not inject a duplicate script if it already exists", () => {
    const existingScript = document.createElement("script");
    existingScript.id = "goatcounter-script";
    document.body.appendChild(existingScript);

    renderHook(() => useGoatCounter({ name: "my-site" }));

    expect(document.querySelectorAll("#goatcounter-script")).toHaveLength(1);
  });

  it("calls window.goatcounter.count with pathname and search", () => {
    const mockCount = jest.fn();
    window.goatcounter = { count: mockCount };
    mockUseLocation.mockReturnValue({
      pathname: "/dashboard",
      search: "?user=123",
    });

    renderHook(() => useGoatCounter({ name: "my-site" }));

    expect(mockCount).toHaveBeenCalledWith({ path: "/dashboard?user=123" });
  });
});

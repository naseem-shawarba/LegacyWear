import { parseBytes, toHexPreview } from "./parseBytes";

describe("parseBytes", () => {
  describe("hex", () => {
    const hex = (input: string) => parseBytes(input, "hex");

    it.each([
      ["01 FF A0", [1, 255, 160]],
      ["01,FF,A0", [1, 255, 160]],
      ["0x01, 0xFF", [1, 255]],
      ["#01 #ff", [1, 255]],
      ["[01 ff a0]", [1, 255, 160]],
      ["01ffa0", [1, 255, 160]],
      ["1 f", [1, 15]],
      ["  0A\n0B\t0C ", [10, 11, 12]],
    ])("parses %s", (input, expected) => {
      expect(hex(input)).toEqual({ ok: true, bytes: expected });
    });

    it("treats an empty input as no bytes", () => {
      expect(hex("   ")).toEqual({ ok: true, bytes: [] });
    });

    it("rejects non-hex tokens", () => {
      expect(hex("01 zz")).toEqual({
        ok: false,
        error: '"zz" is not a hex value',
      });
    });

    it("rejects an odd-length packed run", () => {
      expect(hex("01ffa")).toEqual({
        ok: false,
        error: '"01ffa" has an odd number of hex digits',
      });
    });
  });

  describe("decimal", () => {
    const decimal = (input: string) => parseBytes(input, "decimal");

    it.each([
      ["1, 255, 160", [1, 255, 160]],
      ["1 255 160", [1, 255, 160]],
      ["[0, 128]", [0, 128]],
    ])("parses %s", (input, expected) => {
      expect(decimal(input)).toEqual({ ok: true, bytes: expected });
    });

    it("rejects values above a byte", () => {
      expect(decimal("1, 256")).toEqual({
        ok: false,
        error: '"256" is outside the 0-255 range',
      });
    });

    it.each(["1, ff", "1, -2", "1, 2.5"])("rejects %s", (input) => {
      expect(decimal(input).ok).toBe(false);
    });
  });
});

describe("toHexPreview", () => {
  it("pads and upper-cases each byte", () => {
    expect(toHexPreview([1, 255, 160, 0])).toBe("01 FF A0 00");
  });

  it("renders an empty list as an empty string", () => {
    expect(toHexPreview([])).toBe("");
  });
});

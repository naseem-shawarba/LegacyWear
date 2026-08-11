// useBluetooth.test.ts
import { act, renderHook } from "@testing-library/react";
import { useBluetooth } from "./useBluetooth";
import { bluetoothManager, buildCommandBytes } from "../../services/bluetooth";
import { unSupportedPayloadCategories } from "../../services/bluetooth/payloads";

jest.mock("../../services/bluetooth", () => ({
  bluetoothManager: {
    connect: jest.fn(),
    getDeviceInfo: jest.fn(),
    sendMultipleWithAnimation: jest.fn(),
    listenToGestures: jest.fn(),
    stopListeningToGestures: jest.fn(),
    disconnect: jest.fn(),
    onConnectionChange: null,
  },
  buildCommandBytes: jest.fn(),
}));

jest.mock("../../services/bluetooth/payloads", () => ({
  unSupportedPayloadCategories: jest.fn(),
}));

describe("useBluetooth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    bluetoothManager.onConnectionChange = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns default initial state", () => {
    const { result } = renderHook(() => useBluetooth());

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isPairing).toBe(false);
    expect(result.current.isSyncing).toBe(false);
    expect(result.current.deviceInfo).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isListeningToGestures).toBe(false);
  });

  describe("setupDevice", () => {
    it("successfully completes full setup including applying settings", async () => {
      const mockDeviceInfo = { model: "Band 1" } as any;
      const mockFormValues = { alarm: {} } as any;
      const mockOptions = { disableAlarm: true } as any;
      const mockBytes = [[1, 2, 3]];

      (bluetoothManager.connect as jest.Mock).mockResolvedValue(undefined);
      (bluetoothManager.getDeviceInfo as jest.Mock).mockResolvedValue(
        mockDeviceInfo,
      );
      (unSupportedPayloadCategories as jest.Mock).mockReturnValue(mockOptions);
      (buildCommandBytes as jest.Mock).mockReturnValue(mockBytes);
      (
        bluetoothManager.sendMultipleWithAnimation as jest.Mock
      ).mockResolvedValue(undefined);

      const { result } = renderHook(() => useBluetooth());

      let res: { ok: boolean };
      await act(async () => {
        res = await result.current.setupDevice(mockFormValues);
      });

      expect(res!.ok).toBe(true);
      expect(bluetoothManager.connect).toHaveBeenCalled();
      expect(bluetoothManager.getDeviceInfo).toHaveBeenCalled();
      expect(unSupportedPayloadCategories).toHaveBeenCalledWith(mockDeviceInfo);
      expect(buildCommandBytes).toHaveBeenCalledWith(
        mockFormValues,
        mockOptions,
      );
      expect(bluetoothManager.sendMultipleWithAnimation).toHaveBeenCalledWith(
        mockBytes,
      );
      expect(result.current.isConnected).toBe(true);
      expect(result.current.deviceInfo).toEqual(mockDeviceInfo);
    });

    it("bails early if pairing fails", async () => {
      const err = new Error("Connection failed");
      (bluetoothManager.connect as jest.Mock).mockRejectedValue(err);

      const { result } = renderHook(() => useBluetooth());

      let res: { ok: boolean };
      await act(async () => {
        res = await result.current.setupDevice();
      });

      expect(res!.ok).toBe(false);
      expect(result.current.isConnected).toBe(false);
      expect(result.current.error).toBe(err);
      expect(bluetoothManager.getDeviceInfo).not.toHaveBeenCalled();
    });

    it("bails early if syncing fails", async () => {
      const err = new Error("Sync failed");
      (bluetoothManager.connect as jest.Mock).mockResolvedValue(undefined);
      (bluetoothManager.getDeviceInfo as jest.Mock).mockRejectedValue(err);

      const { result } = renderHook(() => useBluetooth());

      let res: { ok: boolean };
      await act(async () => {
        res = await result.current.setupDevice();
      });

      expect(res!.ok).toBe(false);
      expect(result.current.isConnected).toBe(true);
      expect(result.current.error).toBe(err);
    });
  });

  describe("gesture controls", () => {
    it("handles listening and stopping listening to gestures", async () => {
      (bluetoothManager.listenToGestures as jest.Mock).mockResolvedValue(
        undefined,
      );
      (bluetoothManager.stopListeningToGestures as jest.Mock).mockResolvedValue(
        undefined,
      );

      const { result } = renderHook(() => useBluetooth());

      await act(async () => {
        await result.current.listenToGestures();
      });
      expect(result.current.isListeningToGestures).toBe(true);

      await act(async () => {
        await result.current.stopListeningToGestures();
      });
      expect(result.current.isListeningToGestures).toBe(false);
    });

    it("handles gesture listener errors", async () => {
      const err = new Error("Gesture error");
      (bluetoothManager.listenToGestures as jest.Mock).mockRejectedValue(err);

      const { result } = renderHook(() => useBluetooth());

      await act(async () => {
        await result.current.listenToGestures();
      });

      expect(result.current.isListeningToGestures).toBe(false);
      expect(result.current.error).toBe(err);
    });
  });

  describe("disconnect", () => {
    it("stops gesture listener if active and disconnects", async () => {
      (bluetoothManager.listenToGestures as jest.Mock).mockResolvedValue(
        undefined,
      );
      (bluetoothManager.stopListeningToGestures as jest.Mock).mockResolvedValue(
        undefined,
      );

      const { result } = renderHook(() => useBluetooth());

      await act(async () => {
        await result.current.listenToGestures();
      });

      await act(async () => {
        await result.current.disconnect();
      });

      expect(bluetoothManager.stopListeningToGestures).toHaveBeenCalled();
      expect(bluetoothManager.disconnect).toHaveBeenCalled();
      expect(result.current.isConnected).toBe(false);
      expect(result.current.deviceInfo).toBeNull();
    });
  });

  describe("onConnectionChange callback", () => {
    it("updates state when connection status changes externally", () => {
      const { result } = renderHook(() => useBluetooth());

      expect(typeof bluetoothManager.onConnectionChange).toBe("function");

      act(() => {
        bluetoothManager.onConnectionChange?.(true);
      });
      expect(result.current.isConnected).toBe(true);

      act(() => {
        bluetoothManager.onConnectionChange?.(false);
      });
      expect(result.current.isConnected).toBe(false);
      expect(result.current.deviceInfo).toBeNull();
      expect(result.current.isListeningToGestures).toBe(false);
    });

    it("clears onConnectionChange handler on unmount", () => {
      const { unmount } = renderHook(() => useBluetooth());
      unmount();
      expect(bluetoothManager.onConnectionChange).toBeNull();
    });
  });
});

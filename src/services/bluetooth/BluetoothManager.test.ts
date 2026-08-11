import { TextEncoder, TextDecoder } from "util";
import { bluetoothManager } from "./BluetoothManager";

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

jest.mock("./payloads", () => ({
  getBatteryPercentagePayload: { value: [0x01] },
  getDailyActivityPointsPayload: { value: [0x02] },
  startSyncIndicatorPayload: { value: [0x03] },
  stopSyncIndicatorPayload: { value: [0x04] },
}));

jest.mock("./utils", () => ({
  delay: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../utils", () => ({
  isDevToolsEnabled: jest.fn().mockReturnValue(false),
}));

describe("BluetoothManager", () => {
  let mockCharacteristic: any;
  let mockService: any;
  let mockGatt: any;
  let mockDevice: any;

  beforeEach(() => {
    jest.useFakeTimers();

    mockCharacteristic = {
      startNotifications: jest.fn().mockResolvedValue(undefined),
      stopNotifications: jest.fn().mockResolvedValue(undefined),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      writeValue: jest.fn().mockResolvedValue(undefined),
      readValue: jest.fn(),
    };

    mockService = {
      getCharacteristic: jest.fn().mockResolvedValue(mockCharacteristic),
    };

    mockGatt = {
      connect: jest.fn().mockResolvedValue({
        getPrimaryService: jest.fn().mockResolvedValue(mockService),
      }),
      disconnect: jest.fn(),
      getPrimaryService: jest.fn().mockResolvedValue(mockService),
      connected: true,
    };

    mockDevice = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      gatt: mockGatt,
      name: "Test Device",
    };

    (global.navigator as any).bluetooth = {
      requestDevice: jest.fn().mockResolvedValue(mockDevice),
    };
  });

  afterEach(() => {
    bluetoothManager.disconnect();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("Connection & Setup", () => {
    it("throws if primary service is missing", async () => {
      mockGatt.connect.mockResolvedValueOnce({
        getPrimaryService: jest
          .fn()
          .mockRejectedValue(new Error("Primary service not found")),
      });

      await expect(bluetoothManager.connect()).rejects.toThrow(
        "Primary service not found",
      );

      bluetoothManager.disconnect();
      expect(bluetoothManager.isConnected()).toBe(false);
    });

    it("triggers onConnectionChange when GATT server disconnects", async () => {
      const onChange = jest.fn();
      bluetoothManager.onConnectionChange = onChange;

      await bluetoothManager.connect();

      const disconnectHandler = mockDevice.addEventListener.mock.calls.find(
        (c: any) => c[0] === "gattserverdisconnected",
      )[1];

      disconnectHandler();
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it("cleans up resources on disconnect", async () => {
      await bluetoothManager.connect();
      bluetoothManager.disconnect();

      expect(mockCharacteristic.stopNotifications).toHaveBeenCalled();
      expect(mockCharacteristic.removeEventListener).toHaveBeenCalled();
      expect(mockGatt.disconnect).toHaveBeenCalled();
      expect(bluetoothManager.isConnected()).toBe(false);
    });
  });

  describe("Data Transmission", () => {
    it("sends single byte payload via send()", async () => {
      await bluetoothManager.connect();
      await bluetoothManager.send([0x01]);
      expect(mockCharacteristic.writeValue).toHaveBeenCalledWith(
        new Uint8Array([0x01]),
      );
    });

    it("throws if trying to send while disconnected", async () => {
      await expect(bluetoothManager.send([0x01])).rejects.toThrow(
        "Device is not connected",
      );
    });

    it("wraps multiple payloads with sync indicators in sendMultipleWithAnimation", async () => {
      await bluetoothManager.connect();
      await bluetoothManager.sendMultipleWithAnimation([[0x09]]);

      expect(mockCharacteristic.writeValue).toHaveBeenNthCalledWith(
        1,
        new Uint8Array([0x03]),
      );
      expect(mockCharacteristic.writeValue).toHaveBeenNthCalledWith(
        2,
        new Uint8Array([0x09]),
      );
      expect(mockCharacteristic.writeValue).toHaveBeenNthCalledWith(
        3,
        new Uint8Array([0x04]),
      );
    });
  });

  describe("Data Retrieval (sendCommandAndWait)", () => {
    it("resolves when notification response is received", async () => {
      await bluetoothManager.connect();
      const promise = bluetoothManager.sendCommandAndWait([0x01]);

      const callback = mockCharacteristic.addEventListener.mock.calls.find(
        (c: any) => c[0] === "characteristicvaluechanged",
      )[1];

      callback({
        target: { value: new DataView(new Uint8Array([0x99]).buffer) },
      });

      const result = await promise;
      expect(result[0]).toEqual(new Uint8Array([0x99]));
    });

    it("times out if no response is received", async () => {
      await bluetoothManager.connect();
      const promise = bluetoothManager.sendCommandAndWait([0x01], 100);

      jest.advanceTimersByTime(150);

      await expect(promise).rejects.toThrow("BLE response timeout");
    });
  });

  describe("Device Info Parsing", () => {
    it("parses battery level correctly", async () => {
      await bluetoothManager.connect();
      const promise = bluetoothManager.getBatteryLevel();

      const callback = mockCharacteristic.addEventListener.mock.calls.find(
        (c: any) => c[0] === "characteristicvaluechanged",
      )[1];

      callback({
        target: {
          value: new DataView(new Uint8Array([0x00, 0x00, 85]).buffer),
        },
      });

      const level = await promise;
      expect(level).toBe(85);
    });

    it("parses daily activity points correctly", async () => {
      await bluetoothManager.connect();
      const promise = bluetoothManager.getDailyActivityPoints();

      const callback = mockCharacteristic.addEventListener.mock.calls.find(
        (c: any) => c[0] === "characteristicvaluechanged",
      )[1];

      callback({
        target: {
          value: new DataView(
            new Uint8Array([0x00, 0x00, 0x00, 0x71, 0x02]).buffer,
          ),
        },
      });

      const points = await promise;
      expect(points).toBe(250);
    });

    it("reads device name from standard BLE characteristic", async () => {
      await bluetoothManager.connect();

      const encoder = new TextEncoder();
      const nameBuffer = encoder.encode("My Wearable").buffer;
      mockCharacteristic.readValue.mockResolvedValue(new DataView(nameBuffer));

      const name = await bluetoothManager.getDeviceName();
      expect(name).toBe("My Wearable");
    });
  });
});

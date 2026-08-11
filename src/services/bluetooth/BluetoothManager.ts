import {
  getBatteryPercentagePayload,
  getDailyActivityPointsPayload,
  startSyncIndicatorPayload,
  stopSyncIndicatorPayload,
} from "./payloads";
import { delay } from "./utils";
import { isDevToolsEnabled } from "../../utils";
import { COMMAND_CHARACTERISTIC_UUID, PRIMARY_SERVICE_UUID } from "./constants";

type PendingCommand = {
  resolve: (data: Uint8Array[]) => void;
  reject: (err: Error) => void;
  packets: Uint8Array[];
  timeout: number;
};

class BluetoothManager {
  device: BluetoothDevice | null = null;
  server: BluetoothRemoteGATTServer | null = null;
  service: any;
  commandCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private pendingCommand?: PendingCommand;

  onConnectionChange: ((connected: boolean) => void) | null = null;

  async connect() {
    this.disconnect();
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [PRIMARY_SERVICE_UUID] }],
      optionalServices: [0x180f, 0x1800],
    });

    this.device.addEventListener(
      "gattserverdisconnected",
      this.handleDisconnected,
    );

    this.server = await this.device.gatt!.connect();
    await this.initializeCommandCharacteristic();

    // CRITICAL: Give the GATT server a moment to discover all services
    // before the hook immediately calls getDeviceInfo
    await delay(500);
  }

  async initializeCommandCharacteristic() {
    if (!this.server) throw new Error("No GATT server");

    this.service = await this.server.getPrimaryService(PRIMARY_SERVICE_UUID);
    if (!this.service) throw new Error("Primary service not found");
    this.commandCharacteristic = await this.service.getCharacteristic(
      COMMAND_CHARACTERISTIC_UUID,
    );

    await this.commandCharacteristic!.startNotifications();

    this.commandCharacteristic!.addEventListener(
      "characteristicvaluechanged",
      this.handleValueChange,
    );
  }

  async listenToGestures() {}
  async stopListeningToGestures() {}

  isConnected() {
    return !!this.device?.gatt?.connected;
  }

  disconnect() {
    if (this.device) {
      this.device.removeEventListener(
        "gattserverdisconnected",
        this.handleDisconnected,
      );
    }

    if (this.commandCharacteristic) {
      this.commandCharacteristic.removeEventListener(
        "characteristicvaluechanged",
        this.handleValueChange,
      );
      this.commandCharacteristic.stopNotifications().catch(() => {});
    }

    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }

    this.device = null;
    this.server = null;
    this.service = null;
    this.commandCharacteristic = null;
    this.failPendingCommand(
      new Error("Disconnected before a response arrived"),
    );
  }

  private failPendingCommand(error: Error) {
    const pending = this.pendingCommand;
    if (!pending) return;

    clearTimeout(pending.timeout);
    this.pendingCommand = undefined;
    pending.reject(error);
  }

  async sendCommandAndWait(
    bytes: number[] | Uint8Array,
    timeoutMs = 10000,
  ): Promise<Uint8Array[]> {
    const characteristic = this.commandCharacteristic;

    if (!characteristic) {
      throw new Error("Characteristic not initialized");
    }

    if (this.pendingCommand) {
      throw new Error("Another command already in progress");
    }

    let resolve!: (data: Uint8Array[]) => void;
    let reject!: (err: Error) => void;
    const response = new Promise<Uint8Array[]>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const timeout = window.setTimeout(() => {
      this.pendingCommand = undefined;
      reject(new Error("BLE response timeout"));
    }, timeoutMs);

    this.pendingCommand = { resolve, reject, packets: [], timeout };

    try {
      await characteristic.writeValue(new Uint8Array(bytes));
    } catch (err) {
      clearTimeout(timeout);
      this.pendingCommand = undefined;
      throw err;
    }

    return response;
  }

  async send(bytes: number[] | Uint8Array) {
    if (!this.isConnected() || !this.commandCharacteristic) {
      throw new Error("Device is not connected");
    }
    if (!bytes?.length) {
      throw new Error("payload is empty");
    }
    await this.commandCharacteristic.writeValue(new Uint8Array(bytes));
  }

  // Send multiple payloads
  async sendMultipleWithAnimation(
    bytesList: (number[] | Uint8Array | undefined)[],
  ) {
    if (!this.commandCharacteristic) {
      throw new Error("Characteristic not initialized");
    }
    if (!bytesList?.length) {
      throw new Error("payloads array is empty");
    }

    const bytesListToSend = [
      startSyncIndicatorPayload.value,
      ...bytesList,
      stopSyncIndicatorPayload.value,
    ];

    for (const bytes of bytesListToSend) {
      if (!bytes) {
        throw new Error("Undefined payload encountered");
      }
      await this.commandCharacteristic.writeValue(new Uint8Array(bytes));
    }
  }

  async getDailyActivityPoints(): Promise<number> {
    try {
      const packets = await this.sendCommandAndWait(
        getDailyActivityPointsPayload.value,
      );

      const data = packets[0];

      const bytes = new Uint8Array(data.slice(3, 5));
      const value = new DataView(bytes.buffer).getUint16(0, true);
      const points = Math.floor(value / 2.5);

      return points;
    } catch {
      return 0;
    }
  }
  async getBatteryLevel(): Promise<number> {
    try {
      const packets = await this.sendCommandAndWait(
        getBatteryPercentagePayload.value,
      );

      const data = packets[0];
      const bytes = new Uint8Array(data.slice(2, 3));
      const batteryLevel = new DataView(bytes.buffer).getUint8(0);
      return batteryLevel;
    } catch {
      return 0;
    }
  }

  async getDeviceName() {
    const nameDataView = await this.readFromDevice(0x1800, 0x2a00);
    const decoder = new TextDecoder("utf-8");
    if (nameDataView) {
      return decoder.decode(nameDataView);
    } else if (this.device?.name) {
      return this.device.name;
    } else {
      return "UNKNOWN";
    }
  }

  async readFromDevice(serviceUUID: number, characteristicUUID: number) {
    if (!this.server) {
      throw new Error("Server not initialized");
    }
    try {
      const primaryService = await this.server.getPrimaryService(serviceUUID);
      const targetCharacteristic =
        await primaryService.getCharacteristic(characteristicUUID);
      const DataView = await targetCharacteristic.readValue();
      return DataView;
    } catch (error) {
      console.error("unable to read", serviceUUID, characteristicUUID, error);
      return null;
    }
  }

  async getDeviceInfo() {
    const batteryLevel = await this.getBatteryLevel();
    const activityPoints = await this.getDailyActivityPoints();
    const name = await this.getDeviceName();

    return {
      batteryLevel,
      name,
      activityPoints,
    };
  }

  private handleDisconnected = () => {
    this.onConnectionChange?.(false);
  };

  private handleValueChange = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    if (!characteristic?.value || !this.pendingCommand) return;

    const packet = new Uint8Array(characteristic.value.buffer);

    this.pendingCommand.packets.push(packet);

    clearTimeout(this.pendingCommand.timeout);
    this.pendingCommand.resolve(this.pendingCommand.packets);
    this.pendingCommand = undefined;
  };
}

export const bluetoothManager = new BluetoothManager();

declare global {
  interface Window {
    sendMultipleWithAnimation?: (
      bytesList: (number[] | Uint8Array | undefined)[],
    ) => void;
    send?: (bytesList: number[] | Uint8Array) => void;
  }
}

if (isDevToolsEnabled()) {
  window.sendMultipleWithAnimation =
    bluetoothManager.sendMultipleWithAnimation.bind(bluetoothManager);
  window.send = bluetoothManager.send.bind(bluetoothManager);
}

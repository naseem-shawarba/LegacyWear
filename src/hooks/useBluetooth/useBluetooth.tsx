import { useEffect, useState } from "react";
import type { FormValues } from "../useSettings";
import type { DeviceInfo } from "../../types";
import { bluetoothManager, buildCommandBytes } from "../../services/bluetooth";
import type { Options } from "../../services/bluetooth/payloads";

import { unSupportedPayloadCategories } from "../../services/bluetooth/payloads";

export function useBluetooth() {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isPairing, setIsPairing] = useState(false); // Hardware link phase
  const [isSyncing, setIsSyncing] = useState(false); // Data exchange phase
  const [isListeningToGestures, setIsListeningToGestures] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pairDevice = async () => {
    setIsPairing(true);
    setError(null);
    try {
      await bluetoothManager.connect();
      setIsConnected(true);
      return { ok: true };
    } catch (err) {
      console.error("Device connection failed", err);
      setError(err as Error);
      setIsConnected(false);
      return { ok: false };
    } finally {
      setIsPairing(false);
    }
  };

  const syncDeviceData = async () => {
    setIsSyncing(true);
    try {
      const info = await bluetoothManager.getDeviceInfo();
      setDeviceInfo(info);
      return { ok: true, info };
    } catch (err) {
      console.error("Sync failed", err);
      setError(err as Error);
      return { ok: false, info: null };
    } finally {
      setIsSyncing(false);
    }
  };

  const sendPayloads = async (
    bytesList: (number[] | Uint8Array | undefined)[],
  ) => {
    setIsSyncing(true);
    try {
      await bluetoothManager.sendMultipleWithAnimation(bytesList);
      return { ok: true };
    } catch (err) {
      console.error("Sending payloads failed", err);
      setError(err as Error);
      return { ok: false, error: err as Error };
    } finally {
      setIsSyncing(false);
    }
  };

  const applySettings = async (data: FormValues, options: Options) =>
    sendPayloads(buildCommandBytes(data, options));

  const setupDevice = async (formValues?: FormValues) => {
    const { ok: isPaired } = await pairDevice();
    if (!isPaired) return { ok: false };

    const { ok: isSynced, info } = await syncDeviceData();
    if (!isSynced) return { ok: false };

    if (formValues && isSynced && info) {
      const options = unSupportedPayloadCategories(info);
      const { ok: settingsApplied } = await applySettings(formValues, options);
      if (!settingsApplied) return { ok: false };
    }

    return { ok: true };
  };

  const listenToGestures = async () => {
    try {
      await bluetoothManager.listenToGestures();
      setIsListeningToGestures(true);
      return { ok: true };
    } catch (err) {
      console.error("Failed to listen to gestures", err);
      setError(err as Error);
      return { ok: false };
    }
  };

  const stopListeningToGestures = async () => {
    try {
      await bluetoothManager.stopListeningToGestures();
      setIsListeningToGestures(false);
      return { ok: true };
    } catch (err) {
      console.error("Failed to stop listening to gestures", err);
      setError(err as Error);
      return { ok: false };
    }
  };

  const disconnect = async () => {
    try {
      if (isListeningToGestures) await stopListeningToGestures();
      bluetoothManager.disconnect();
      setIsConnected(false);
      setDeviceInfo(null);
      return { ok: true };
    } catch (err) {
      setError(err as Error);
      return { ok: false };
    }
  };

  useEffect(() => {
    bluetoothManager.onConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
      if (!connected) {
        setDeviceInfo(null);
        setIsListeningToGestures(false);
      }
    };
    return () => {
      bluetoothManager.onConnectionChange = null;
    };
  }, []);

  return {
    /* Actions */
    setupDevice,
    refreshDeviceInfo: syncDeviceData,
    applySettings,
    sendPayloads,
    disconnect,
    listenToGestures,
    stopListeningToGestures,

    /* State */
    isConnected,
    isPairing,
    isSyncing,
    deviceInfo,
    error,
    isListeningToGestures,
  };
}

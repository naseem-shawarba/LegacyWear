import { useEffect, useState } from "react";
import type { DeviceInfo } from "../../types";
import { BatteryIcon } from "../Icons";
import styles from "./DeviceOverview.module.css";
// import { GestureButton } from "../GestureButton";

type DeviceInfoProps = {
  deviceInfo?: DeviceInfo | null;
  isConnected: boolean;
  isSyncing: boolean;
  isPairing: boolean;
  isListeningToGestures?: boolean;
  showLoadingSpinner?: boolean;
  onClick: () => void;
  onGestureBtnClick?: () => void;
};

export const DeviceOverview = ({
  deviceInfo,
  isConnected,
  isSyncing,
  isPairing,
  isListeningToGestures,
  onClick,
  onGestureBtnClick,
}: DeviceInfoProps) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  const showDeviceDetails = isConnected && !!deviceInfo;

  const deviceName = showDeviceDetails ? deviceInfo.name : "No Device";

  const activityPointsText = `${showDeviceDetails ? deviceInfo.activityPoints : "-"} points`;

  const actionText = isMobile ? "Tap" : "Click";

  const statusText = isConnected
    ? `${actionText} to refresh`
    : `${actionText} to connect`;

  const isDisabled = isPairing || isSyncing;

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      className={`${styles.deviceInfoContainer} ${styles.clickable} ${isDisabled ? styles.disabled : ""}`}
      onClick={onClick}
    >
      {isSyncing && <div className={styles.syncingSpinner}></div>}
      <div
        className={`${styles.statusDot} ${isConnected ? styles.connected : ""} ${isPairing ? styles.pairing : ""} ${isListeningToGestures || isPairing ? styles.pulsing : ""}`}
      ></div>

      <div className={styles.deviceInfoContent}>
        <div className={styles.deviceName}>{deviceName}</div>
        {showDeviceDetails && (
          <>
            <div className={styles.batteryIcon}>
              <BatteryIcon batteryLevel={deviceInfo.batteryLevel} />
            </div>

            <div className={styles.activityPoints}>{activityPointsText}</div>
          </>
        )}
        <div className={styles.statusText}>{statusText}</div>
      </div>

      {/* <div className={styles.gestureBtnContainer}>
        <GestureButton
          onClick={onGestureBtnClick}
          isListeningToGestures={isListeningToGestures}
          isDisabled={isDisabled || !isConnected}
        />
      </div> */}
    </div>
  );
};

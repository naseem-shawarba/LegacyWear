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
  isDisabled?: boolean;
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
  isDisabled = false,
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

  const isBusy = isPairing || isSyncing;
  const shouldDisable = isDisabled || isBusy;

  const handleClick = () => {
    if (shouldDisable) return;
    onClick();
  };
  return (
    <div
      role="button"
      tabIndex={shouldDisable ? -1 : 0}
      className={`${styles.deviceInfoContainer} ${styles.clickable} ${shouldDisable ? styles.disabled : ""}`}
      onClick={handleClick}
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
          isDisabled={shouldDisable || !isConnected}
        />
      </div> */}
    </div>
  );
};

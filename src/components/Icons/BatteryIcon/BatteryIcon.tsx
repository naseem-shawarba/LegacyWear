import styles from "./BatteryIcon.module.css";

type BatteryIconProps = {
  batteryLevel?: number;
};

export const BatteryIcon = ({ batteryLevel = 0 }: BatteryIconProps) => {
  const displayPercentage = `${batteryLevel}%`;

  const levelStyle: React.CSSProperties = {
    height: `${batteryLevel}%`,
  };

  let levelStatusClass = "";

  if (batteryLevel <= 20) {
    levelStatusClass = styles.levelCritical;
  } else if (batteryLevel <= 50) {
    levelStatusClass = styles.levelWarning;
  } else {
    levelStatusClass = styles.levelHealthy;
  }

  return (
    <div className={styles.batteryContainer}>
      <div className={styles.batteryBody}>
        <div
          className={`${styles.batteryLevel} ${levelStatusClass}`}
          style={levelStyle}
        />
      </div>
      <div className={styles.batteryLevelPercentage}>{displayPercentage}</div>
    </div>
  );
};

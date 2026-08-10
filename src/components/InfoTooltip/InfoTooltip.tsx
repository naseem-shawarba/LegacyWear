import React, { useState } from "react";
import styles from "./InfoTooltip.module.css";

type InfoTooltipProps = {
  text: string;
};

export const InfoTooltip = ({ text }: InfoTooltipProps) => {
  const [pinned, setPinned] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setPinned((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <span className={styles.icon} onClick={handleClick}>
        ⓘ
      </span>

      {pinned && <div className={styles.tooltip}>{text}</div>}
    </div>
  );
};

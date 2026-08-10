import { useEffect, useState } from "react";
import styles from "./Snackbar.module.css";
type SnackbarProps = {
  message: string;
  duration?: number;
};

export const Snackbar = ({ message, duration = 9000 }: SnackbarProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <div className={styles.snackbar}>{message}</div>;
};

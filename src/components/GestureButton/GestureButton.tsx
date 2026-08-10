import styles from "./GestureButton.module.css";

type GestureButtonProps = {
  isListeningToGestures?: boolean;
  onClick?: () => void;
  isDisabled?: boolean;
};

export const GestureButton = ({
  isListeningToGestures = false,
  onClick,
  isDisabled,
}: GestureButtonProps) => {
  return (
    <button
      type="button"
      className={`
        ${styles.gestureBtn} 
        ${isListeningToGestures ? styles.gestureActive : ""}
      ${isDisabled ? styles.disabled : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={isListeningToGestures ? "Disable Gestures" : "Enable Gestures"}
      disabled={isDisabled}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {!isListeningToGestures && (
          <line
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            stroke="#ef4444"
            strokeWidth="2.5"
          />
        )}
      </svg>
    </button>
  );
};

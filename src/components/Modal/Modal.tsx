import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClick: () => void;
  buttonLabel: string;
  children: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClick,
  buttonLabel,
  children,
}: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {children}
        <button className={styles.button} onClick={onClick}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

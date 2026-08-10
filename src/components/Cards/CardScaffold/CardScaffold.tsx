import React from "react";
import styles from "./CardScaffold.module.css";
import { InfoTooltip } from "../../InfoTooltip";

type CardScaffoldProps = {
  id: string;
  title: string;
  hint?: string;
  isUnsupported?: boolean;
  isOpen: boolean;
  onOpenCardClick: (id: string) => void;
  children: React.ReactNode;
};

export const CardScaffold = ({
  id,
  title,
  hint,
  isUnsupported,
  isOpen,
  onOpenCardClick,
  children,
}: CardScaffoldProps) => {
  const contentId = `${id}-content`;

  const handleCardHeaderClick = () => {
    onOpenCardClick(id);
  };

  return (
    <div
      className={`${styles.card} ${isUnsupported ? styles.unsupported : ""} ${!isOpen ? styles.collapsed : ""}`}
    >
      <div className={styles.cardHeader}>
        <div className={styles.title}>
          <h3>
            <button
              type="button"
              className={styles.toggle}
              onClick={handleCardHeaderClick}
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              {title}
            </button>
          </h3>
          {hint && <InfoTooltip text={hint} />}
        </div>
        <span>
          <span>
            {isUnsupported && (
              <span className={styles.badge}>Not supported</span>
            )}
          </span>
          <button
            type="button"
            className={styles.chevron}
            onClick={handleCardHeaderClick}
            tabIndex={-1}
            aria-hidden="true"
          >
            ▾
          </button>
        </span>
      </div>
      {isOpen && (
        <div className={styles.cardContent} id={contentId}>
          {isUnsupported && (
            <div className={`${styles.message} ${styles.unsupported}`}>
              This feature is not supported on this device. Configuration
              options are disabled.
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

import styles from "./NudgeMoveCard.module.css";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { CardScaffold } from "../CardScaffold";

type NudgeMoveCardProps = {
  isDisabled: boolean;
  isUnsupported?: boolean;
  isOpen: boolean;
  onOpenCardClick: (id: string) => void;
};
export const NudgeMoveCard = ({
  isDisabled,
  isUnsupported,
  isOpen,
  onOpenCardClick,
}: NudgeMoveCardProps) => {
  const { register, watch } = useFormContext<FormValues>();

  const isReadOnly = isDisabled || isUnsupported;
  const isNudgeMoveEnabled = watch("nudgeMove.isEnabled");
  const isNudgeMoveFieldDisabled = isReadOnly || !isNudgeMoveEnabled;

  return (
    <CardScaffold
      id={"nudgeMove"}
      title={"Nudge Move"}
      hint={
        "Turn on the move reminder to get a gentle vibration alert when you’ve been inactive for too long. It helps you stay active by nudging you to move throughout the day."
      }
      isUnsupported={isUnsupported}
      isOpen={isOpen}
      onOpenCardClick={onOpenCardClick}
    >
      <div className={styles.fieldWrapper}>
        <div className={styles.field}>
          <label>Start Time</label>
          <input
            type="time"
            {...register("nudgeMove.startTime")}
            disabled={isNudgeMoveFieldDisabled}
          />
        </div>
      </div>

      <div className={styles.fieldWrapper}>
        <div className={styles.field}>
          <label>End Time</label>
          <input
            type="time"
            {...register("nudgeMove.endTime")}
            disabled={isNudgeMoveFieldDisabled}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Interval (minutes)</label>
        <input
          type="number"
          min={1}
          {...register("nudgeMove.interval")}
          disabled={isNudgeMoveFieldDisabled}
        />
      </div>

      <div className={styles.field}>
        <label>
          Enabled:
          <input
            type="checkbox"
            {...register("nudgeMove.isEnabled")}
            disabled={isReadOnly}
          />
        </label>
      </div>
    </CardScaffold>
  );
};

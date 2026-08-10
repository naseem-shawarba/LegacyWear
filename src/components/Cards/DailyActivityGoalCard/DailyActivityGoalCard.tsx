import styles from "./DailyActivityGoalCard.module.css";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { CardScaffold } from "../CardScaffold";

type DailyActivityGoalCardProps = {
  isDisabled: boolean;
  isUnsupported?: boolean;
  isOpen: boolean;
  onOpenCardClick: (id: string) => void;
};
export const DailyActivityGoalCard = ({
  isDisabled,
  isUnsupported,
  isOpen,
  onOpenCardClick,
}: DailyActivityGoalCardProps) => {
  const { register } = useFormContext<FormValues>();

  return (
    <CardScaffold
      id={"dailyActivityGoal"}
      title={"Daily Activity Goal"}
      hint={
        "Activity trackers use points as a daily activity goal. Points reflect both movement and intensity, allowing the device to credit for different types of activities like swimming, basketball, and running. \n\nFor example, 1,000 points, depending on the fitness tracker, is often close to 10,000 steps when walking. Higher-intensity activities earn points faster, so a run may reach the same goal with fewer steps (around 7,000)."
      }
      isUnsupported={isUnsupported}
      isOpen={isOpen}
      onOpenCardClick={onOpenCardClick}
    >
      <div className={styles.field}>
        <label>Points</label>
        <input
          type="number"
          min={100}
          max={5000}
          {...register("dailyActivityGoal.points")}
          disabled={isDisabled}
        />
      </div>
    </CardScaffold>
  );
};

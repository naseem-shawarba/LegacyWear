import styles from "./PreferencesCard.module.css";
import { Controller, useFormContext } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { CardScaffold } from "../CardScaffold";

type PreferencesCardProps = {
  isDisabled: boolean;
  isUnsupported?: boolean;
  isOpen: boolean;
  onOpenCardClick: (id: string) => void;
};
export const PreferencesCard = ({
  isDisabled,
  isUnsupported,
  isOpen,
  onOpenCardClick,
}: PreferencesCardProps) => {
  const { register, watch, control } = useFormContext<FormValues>();
  const showTime = watch("preferences.showTime");

  return (
    <CardScaffold
      id={"preferences"}
      title={"Preferences"}
      isUnsupported={isUnsupported}
      isOpen={isOpen}
      onOpenCardClick={onOpenCardClick}
    >
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          {...register("preferences.showTime")}
          disabled={isDisabled}
        />
        Show time
      </label>

      <fieldset
        className={styles.radioGroup}
        disabled={!showTime || isDisabled}
      >
        <legend>Display order</legend>

        <Controller
          name="preferences.showTimeFirst"
          control={control}
          render={({ field }) => (
            <>
              <label>
                <input
                  type="radio"
                  name={field.name}
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  onBlur={field.onBlur}
                />
                Show time first
              </label>

              <label>
                <input
                  type="radio"
                  name={field.name}
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  onBlur={field.onBlur}
                />
                Show progress first
              </label>
            </>
          )}
        />
      </fieldset>

      {/* isTripleTapEnabled is false for now. its functionality and effect on acrtivity points needs to be investigated */}
      {/* <label className={styles.checkbox}>
        <input
          type="checkbox"
          {...register("preferences.isTripleTapEnabled")}
          disabled={isDisabled}
        />
        Enable Triple Tap
      </label> */}
    </CardScaffold>
  );
};

import styles from "./AlarmCard.module.css";
import { Controller, useFormContext } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { CardScaffold } from "../CardScaffold";

type AlarmCardProps = {
  isDisabled: boolean;
  isUnsupported?: boolean;

  isOpen: boolean;
  onOpenCardClick: (id: string) => void;
};

export const AlarmCard = ({
  isDisabled,
  isUnsupported,
  isOpen,
  onOpenCardClick,
}: AlarmCardProps) => {
  const { register, watch, control } = useFormContext<FormValues>();
  const isAlarmEnabled = watch("alarm.enabled");
  const isReadOnly = isDisabled || isUnsupported;
  const isAlarmSettingDisabled = isReadOnly || !isAlarmEnabled;

  return (
    <CardScaffold
      id={"alarm"}
      title={"Alarm Settings"}
      hint={
        "Set the alarm to vibrate at the time you choose. When it goes off, the device will gently vibrate on your wrist to help wake you or remind you of the event. You can customize the time and repeat settings in the app."
      }
      isUnsupported={isUnsupported}
      isOpen={isOpen}
      onOpenCardClick={onOpenCardClick}
    >
      <div className={styles.field}>
        <label>Alarm Time</label>
        <input
          type="time"
          {...register("alarm.time")}
          disabled={isAlarmSettingDisabled}
        />
      </div>

      <div className={styles.field}>
        <label>Repeat</label>
        <Controller
          name="alarm.repeat"
          control={control}
          render={({ field }) => (
            <div className={styles.repeat}>
              <label>
                <input
                  type="radio"
                  name={field.name}
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  onBlur={field.onBlur}
                  disabled={isAlarmSettingDisabled}
                />
                Once
              </label>

              <label>
                <input
                  type="radio"
                  name={field.name}
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  onBlur={field.onBlur}
                  disabled={isAlarmSettingDisabled}
                />
                Every day
              </label>
            </div>
          )}
        />
      </div>

      <div className={styles.field}>
        <label>
          Enabled:
          <input
            type="checkbox"
            {...register("alarm.enabled")}
            disabled={isReadOnly}
          />
        </label>
      </div>
    </CardScaffold>
  );
};

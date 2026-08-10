import { useState } from "react";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALUES, LOCAL_STORAGE_KEY } from "./constants";
import type { FormValues } from "./types";

const readPersistedValues = (): FormValues => {
  try {
    const persisted = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!persisted) return FORM_DEFAULT_VALUES;

    const stored: Partial<FormValues> = JSON.parse(persisted);

    return {
      alarm: { ...FORM_DEFAULT_VALUES.alarm, ...stored?.alarm },
      nudgeMove: { ...FORM_DEFAULT_VALUES.nudgeMove, ...stored?.nudgeMove },
      dailyActivityGoal: {
        ...FORM_DEFAULT_VALUES.dailyActivityGoal,
        ...stored?.dailyActivityGoal,
      },
      preferences: {
        ...FORM_DEFAULT_VALUES.preferences,
        ...stored?.preferences,
      },
    };
  } catch (err) {
    console.warn("Discarding unreadable persisted settings", err);
    return FORM_DEFAULT_VALUES;
  }
};

export const useSettings = () => {
  const [defaultValues] = useState(readPersistedValues);

  const methods = useForm<FormValues>({
    defaultValues,
  });

  const { getValues, reset } = methods;

  const saveToLocalStorage = (data: FormValues) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn("Could not persist settings", err);
    }
  };

  const handleSuccessfulSend = () => {
    const values = getValues();
    reset(values);
    saveToLocalStorage(values);
  };

  return {
    handleSuccessfulSend,
    methods,
  };
};

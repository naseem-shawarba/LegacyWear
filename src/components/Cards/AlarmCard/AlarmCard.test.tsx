import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { AlarmCard } from "./AlarmCard";

const defaultValues: FormValues = {
  alarm: { time: "07:30", repeat: false, enabled: true },
  nudgeMove: { startTime: "", endTime: "", interval: 15, isEnabled: false },
  dailyActivityGoal: { points: 1000 },
  preferences: {
    showTime: true,
    showTimeFirst: true,
    isTripleTapEnabled: false,
  },
};

const FormWrapper = ({
  props,
  values,
}: {
  props?: Partial<React.ComponentProps<typeof AlarmCard>>;
  values?: FormValues;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: values ?? defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <AlarmCard
        isDisabled={false}
        isOpen={true}
        onOpenCardClick={jest.fn()}
        {...props}
      />
    </FormProvider>
  );
};

const renderWithForm = (
  props: Partial<React.ComponentProps<typeof AlarmCard>> = {},
) => {
  return render(<FormWrapper props={props} />);
};

const renderWithFormValues = (
  values: FormValues,
  props: Partial<React.ComponentProps<typeof AlarmCard>> = {},
) => {
  return render(<FormWrapper props={props} values={values} />);
};

describe("AlarmCard", () => {
  it("renders alarm fields and triggers the card opener", async () => {
    const user = userEvent.setup();
    const onOpenCardClick = jest.fn();
    const { container } = renderWithForm({ onOpenCardClick });

    expect(screen.getByText("Alarm Settings")).toBeInTheDocument();
    expect(container.querySelector('input[type="time"]')).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /once/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeChecked();

    await user.click(screen.getByText("Alarm Settings"));
    expect(onOpenCardClick).toHaveBeenCalledWith("alarm");
  });

  it("disables the fields when the card is read only", () => {
    const { container } = renderWithForm({
      isDisabled: true,
      isUnsupported: true,
    });

    expect(container.querySelector('input[type="time"]')).toBeDisabled();
    expect(screen.getByRole("radio", { name: /once/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /every day/i })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeDisabled();
  });

  it("disables alarm time and repeat when the alarm is turned off", () => {
    const disabledAlarmValues: FormValues = {
      ...defaultValues,
      alarm: { time: "07:30", repeat: false, enabled: false },
    };

    const { container } = renderWithFormValues(disabledAlarmValues);

    expect(container.querySelector('input[type="time"]')).toBeDisabled();
    expect(screen.getByRole("radio", { name: /once/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /every day/i })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeEnabled();
  });

  it("keeps alarm time and repeat enabled when the alarm is turned on", () => {
    const enabledAlarmValues: FormValues = {
      ...defaultValues,
      alarm: { time: "07:30", repeat: false, enabled: true },
    };

    const { container } = renderWithFormValues(enabledAlarmValues);

    expect(container.querySelector('input[type="time"]')).toBeEnabled();
    expect(screen.getByRole("radio", { name: /once/i })).toBeEnabled();
    expect(screen.getByRole("radio", { name: /every day/i })).toBeEnabled();
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeEnabled();
  });

  it("switches the repeat radio selection when another option is selected", async () => {
    const user = userEvent.setup();
    renderWithForm();

    const everyDayRadio = screen.getByRole("radio", { name: /every day/i });
    const onceRadio = screen.getByRole("radio", { name: /once/i });

    expect(onceRadio).toBeChecked();
    await user.click(everyDayRadio);
    expect(everyDayRadio).toBeChecked();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { PreferencesCard } from "./PreferencesCard";

const defaultValues: FormValues = {
  alarm: { time: "", repeat: false, enabled: false },
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
  props?: Partial<React.ComponentProps<typeof PreferencesCard>>;
  values?: FormValues;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: values ?? defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <PreferencesCard
        isDisabled={false}
        isOpen={true}
        onOpenCardClick={jest.fn()}
        {...props}
      />
    </FormProvider>
  );
};

const renderWithForm = (
  props: Partial<React.ComponentProps<typeof PreferencesCard>> = {},
) => {
  return render(<FormWrapper props={props} />);
};

const renderWithFormValues = (
  values: FormValues,
  props: Partial<React.ComponentProps<typeof PreferencesCard>> = {},
) => {
  return render(<FormWrapper props={props} values={values} />);
};

describe("PreferencesCard", () => {
  it("renders the preference controls and calls the opener when the title is clicked", async () => {
    const user = userEvent.setup();
    const onOpenCardClick = jest.fn();
    renderWithForm({ onOpenCardClick });

    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /show time/i })).toBeChecked();
    expect(
      screen.getByRole("radio", { name: /show time first/i }),
    ).toBeChecked();

    await user.click(screen.getByText("Preferences"));
    expect(onOpenCardClick).toHaveBeenCalledWith("preferences");
  });

  it("disables the controls when the card is disabled", () => {
    renderWithForm({ isDisabled: true });

    expect(screen.getByRole("checkbox", { name: /show time/i })).toBeDisabled();
    expect(
      screen.getByRole("radio", { name: /show time first/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", { name: /show progress first/i }),
    ).toBeDisabled();
  });

  it("keeps the display order radios enabled when show time is enabled", () => {
    renderWithFormValues({
      ...defaultValues,
      preferences: {
        showTime: true,
        showTimeFirst: true,
        isTripleTapEnabled: false,
      },
    });

    expect(screen.getByRole("checkbox", { name: /show time/i })).toBeEnabled();
    expect(
      screen.getByRole("radio", { name: /show time first/i }),
    ).toBeEnabled();
    expect(
      screen.getByRole("radio", { name: /show progress first/i }),
    ).toBeEnabled();
  });

  it("disables the display order radios when show time is disabled", () => {
    renderWithFormValues({
      ...defaultValues,
      preferences: {
        showTime: false,
        showTimeFirst: true,
        isTripleTapEnabled: false,
      },
    });

    expect(screen.getByRole("checkbox", { name: /show time/i })).toBeEnabled();
    expect(
      screen.getByRole("radio", { name: /show time first/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", { name: /show progress first/i }),
    ).toBeDisabled();
  });

  it("updates the selected display order when a different radio is clicked", async () => {
    const user = userEvent.setup();
    renderWithForm();

    const progressFirstRadio = screen.getByRole("radio", {
      name: /show progress first/i,
    });

    expect(progressFirstRadio).not.toBeChecked();
    await user.click(progressFirstRadio);
    expect(progressFirstRadio).toBeChecked();
  });
});

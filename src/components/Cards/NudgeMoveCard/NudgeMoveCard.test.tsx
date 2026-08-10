import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { NudgeMoveCard } from "./NudgeMoveCard";

const defaultValues: FormValues = {
  alarm: { time: "", repeat: false, enabled: false },
  nudgeMove: {
    startTime: "09:00",
    endTime: "17:00",
    interval: 15,
    isEnabled: true,
  },
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
  props?: Partial<React.ComponentProps<typeof NudgeMoveCard>>;
  values?: FormValues;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: values ?? defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <NudgeMoveCard
        isDisabled={false}
        isOpen={true}
        onOpenCardClick={jest.fn()}
        {...props}
      />
    </FormProvider>
  );
};

const renderWithForm = (
  props: Partial<React.ComponentProps<typeof NudgeMoveCard>> = {},
) => {
  return render(<FormWrapper props={props} />);
};

const renderWithFormValues = (
  values: FormValues,
  props: Partial<React.ComponentProps<typeof NudgeMoveCard>> = {},
) => {
  return render(<FormWrapper props={props} values={values} />);
};

describe("NudgeMoveCard", () => {
  it("renders the move reminder inputs and opens the card", async () => {
    const user = userEvent.setup();
    const onOpenCardClick = jest.fn();
    const { container } = renderWithForm({ onOpenCardClick });

    expect(screen.getByText("Nudge Move")).toBeInTheDocument();
    expect(container.querySelectorAll('input[type="time"]').length).toBe(2);
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeChecked();

    await user.click(screen.getByText("Nudge Move"));
    expect(onOpenCardClick).toHaveBeenCalledWith("nudgeMove");
  });

  it("disables all controls when the card is read only", () => {
    const { container } = renderWithForm({
      isDisabled: true,
      isUnsupported: true,
    });

    expect(container.querySelectorAll('input[type="time"]').length).toBe(2);
    expect(container.querySelector('input[type="number"]')).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeDisabled();
  });

  it("keeps all editable fields enabled when nudge move is turned on", () => {
    const { container } = renderWithFormValues({
      ...defaultValues,
      nudgeMove: {
        startTime: "09:00",
        endTime: "17:00",
        interval: 15,
        isEnabled: true,
      },
    });

    expect(container.querySelector('input[type="time"]')).toBeEnabled();
    expect(container.querySelectorAll('input[type="time"]').length).toBe(2);
    expect(container.querySelector('input[type="number"]')).toBeEnabled();
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeEnabled();
  });

  it("disables the time and interval fields when nudge move is turned off", () => {
    const { container } = renderWithFormValues({
      ...defaultValues,
      nudgeMove: {
        startTime: "09:00",
        endTime: "17:00",
        interval: 15,
        isEnabled: false,
      },
    });

    expect(container.querySelectorAll('input[type="time"]').length).toBe(2);
    expect(container.querySelector('input[type="number"]')).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /enabled/i })).toBeEnabled();
  });
});

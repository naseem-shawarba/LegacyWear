import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FormValues } from "../../../hooks/useSettings";
import { DailyActivityGoalCard } from "./DailyActivityGoalCard";

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
}: {
  props?: Partial<React.ComponentProps<typeof DailyActivityGoalCard>>;
}) => {
  const methods = useForm<FormValues>({ defaultValues });

  return (
    <FormProvider {...methods}>
      <DailyActivityGoalCard
        isDisabled={false}
        isOpen={true}
        onOpenCardClick={jest.fn()}
        {...props}
      />
    </FormProvider>
  );
};

const renderWithForm = (
  props: Partial<React.ComponentProps<typeof DailyActivityGoalCard>> = {},
) => {
  return render(<FormWrapper props={props} />);
};

describe("DailyActivityGoalCard", () => {
  it("renders the daily goal title and input", async () => {
    const user = userEvent.setup();
    const onOpenCardClick = jest.fn();
    const { container } = renderWithForm({ onOpenCardClick });

    expect(screen.getByText("Daily Activity Goal")).toBeInTheDocument();
    expect(container.querySelector('input[type="number"]')).toBeInTheDocument();

    await user.click(screen.getByText("Daily Activity Goal"));
    expect(onOpenCardClick).toHaveBeenCalledWith("dailyActivityGoal");
  });

  it("disables the points input when the card is disabled", () => {
    const { container } = renderWithForm({ isDisabled: true });

    expect(container.querySelector('input[type="number"]')).toBeDisabled();
  });
});

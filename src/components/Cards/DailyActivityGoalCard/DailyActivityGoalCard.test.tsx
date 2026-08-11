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
  values,
}: {
  props?: Partial<React.ComponentProps<typeof DailyActivityGoalCard>>;
  values?: FormValues;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: values ?? defaultValues,
  });

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
  values?: FormValues,
) => {
  return render(<FormWrapper props={props} values={values} />);
};

describe("DailyActivityGoalCard", () => {
  describe("Rendering", () => {
    it("renders the daily goal title and input", async () => {
      const user = userEvent.setup();
      const onOpenCardClick = jest.fn();
      const { container } = renderWithForm({ onOpenCardClick });

      expect(screen.getByText("Daily Activity Goal")).toBeInTheDocument();
      expect(
        container.querySelector('input[type="number"]'),
      ).toBeInTheDocument();

      await user.click(screen.getByText("Daily Activity Goal"));
      expect(onOpenCardClick).toHaveBeenCalledWith("dailyActivityGoal");
    });
  });

  describe("Interactions", () => {
    it("updates the points input value when changed", async () => {
      const user = userEvent.setup();
      const { container } = renderWithForm();

      const input = container.querySelector(
        'input[type="number"]',
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "2500");

      expect(input).toHaveValue(2500);
    });
  });

  describe("Disabled & Unsupported States", () => {
    it("disables the points input when the card is disabled", () => {
      const { container } = renderWithForm({ isDisabled: true });

      expect(container.querySelector('input[type="number"]')).toBeDisabled();
    });

    it("renders unsupported message and badge when isUnsupported is true", () => {
      renderWithForm({ isUnsupported: true });

      expect(screen.getByText("Not supported")).toBeInTheDocument();
      expect(
        screen.getByText(/This feature is not supported on this device/i),
      ).toBeInTheDocument();
    });
  });
});

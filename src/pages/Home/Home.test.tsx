import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FormValues } from "../../hooks/useSettings";

const mockSubmitValues: FormValues = {
  alarm: { time: "07:30", repeat: false, enabled: true },
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

const mockSetupDevice = jest.fn();
const mockDisconnect = jest.fn();
const mockApplySettings = jest.fn().mockResolvedValue({ ok: true });
const mockSendPayloads = jest.fn().mockResolvedValue({ ok: true });
const mockRefreshDeviceInfo = jest.fn();
const mockHandleSuccessfulSend = jest.fn();
const mockGetValues = jest.fn(() => mockSubmitValues);
const mockHandleSubmit = jest.fn((callback) => {
  return (event?: React.SyntheticEvent) => {
    event?.preventDefault?.();
    return callback(mockSubmitValues);
  };
});

jest.mock("../../hooks", () => ({
  useBluetooth: () => ({
    setupDevice: mockSetupDevice,
    disconnect: mockDisconnect,
    applySettings: mockApplySettings,
    sendPayloads: mockSendPayloads,
    refreshDeviceInfo: mockRefreshDeviceInfo,
    isConnected: true,
    isPairing: false,
    isSyncing: false,
    deviceInfo: {
      name: "Legacy Watch",
      batteryLevel: 80,
      activityPoints: 1200,
    },
    error: null,
  }),
  useSettings: () => ({
    handleSuccessfulSend: mockHandleSuccessfulSend,
    methods: {
      handleSubmit: mockHandleSubmit,
      formState: { isDirty: true },
      getValues: mockGetValues,
    },
  }),
}));

const { Home } = require("./Home");

jest.mock("../../components", () => {
  const Button = ({
    children,
    type,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type={type ?? "button"} {...props}>
      {children}
    </button>
  );

  const DeviceOverview = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Device Overview</button>
  );

  const createCard =
    (title: string, cardId: string) =>
    ({ isOpen, isDisabled, isUnsupported, onOpenCardClick }: any) => (
      <section
        data-testid={`${cardId}-card`}
        data-open={String(isOpen)}
        data-disabled={String(isDisabled)}
        data-unsupported={String(isUnsupported)}
      >
        <button type="button" onClick={() => onOpenCardClick(cardId)}>
          {title}
        </button>
      </section>
    );

  const DevTools = ({
    isConnected,
    isSending,
    onSend,
  }: {
    isConnected: boolean;
    isSending: boolean;
    onSend: (bytesList: number[][]) => Promise<{ ok: boolean }>;
  }) => (
    <div
      data-testid="dev-tools"
      data-connected={String(isConnected)}
      data-sending={String(isSending)}
    >
      <button type="button" onClick={() => onSend([[1, 2, 3]])}>
        Send Selected
      </button>
    </div>
  );

  return {
    Button,
    DeviceOverview,
    DevTools,
    Snackbar: ({ message }: { message: string }) => <div>{message}</div>,
    Header: () => <div data-testid="header" />,
    AppOnboarding: () => null,
    AlarmCard: createCard("Alarm Settings", "alarm"),
    NudgeMoveCard: createCard("Nudge Move", "nudgeMove"),
    DailyActivityGoalCard: createCard(
      "Daily Activity Goal",
      "dailyActivityGoal",
    ),
    PreferencesCard: createCard("Preferences", "preferences"),
  };
});

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("wires the primary page actions and submits settings", async () => {
    const user = userEvent.setup();
    render(<Home />);

    expect(screen.getByTestId("alarm-card")).toHaveAttribute(
      "data-open",
      "true",
    );
    expect(screen.getByTestId("nudgeMove-card")).toHaveAttribute(
      "data-open",
      "false",
    );
    expect(
      screen.getByRole("button", { name: /disconnect device/i }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /nudge move/i }));
    expect(screen.getByTestId("alarm-card")).toHaveAttribute(
      "data-open",
      "false",
    );
    expect(screen.getByTestId("nudgeMove-card")).toHaveAttribute(
      "data-open",
      "true",
    );

    await user.click(screen.getByRole("button", { name: /device overview/i }));
    expect(mockRefreshDeviceInfo).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole("button", { name: /disconnect device/i }),
    );
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it.skip("does not expose the dev tools toggle without the query flag", async () => {});

  it("hands the shared bluetooth state and sender down to DevTools", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/?devTools=1");

    render(<Home />);
    const toggleButton = screen.getByRole("button", {
      name: /show dev tools/i,
    });
    await user.click(toggleButton);

    expect(screen.getByTestId("dev-tools")).toHaveAttribute(
      "data-connected",
      "true",
    );
    expect(screen.getByTestId("dev-tools")).toHaveAttribute(
      "data-sending",
      "false",
    );

    await user.click(screen.getByRole("button", { name: /send selected/i }));
    expect(mockSendPayloads).toHaveBeenCalledWith([[1, 2, 3]]);
  });

  it("toggles between the settings form and dev tools", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/?dev=true");

    render(<Home />);

    const toggleButton = screen.getByRole("button", {
      name: /show dev tools/i,
    });
    await user.click(toggleButton);

    expect(screen.getByTestId("dev-tools")).toBeInTheDocument();
    expect(screen.queryByTestId("alarm-card")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /show form/i }));

    expect(screen.queryByTestId("dev-tools")).not.toBeInTheDocument();
    expect(screen.getByTestId("alarm-card")).toBeInTheDocument();
  });
});

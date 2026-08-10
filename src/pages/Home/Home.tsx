import React from "react";
import { FormProvider } from "react-hook-form";

import {
  AlarmCard,
  Button,
  DailyActivityGoalCard,
  DeviceOverview,
  NudgeMoveCard,
  PreferencesCard,
  Snackbar,
  DevTools,
} from "../../components";
import styles from "./Home.module.css";
import { useHomeModel } from "./useHomeModel";

export const Home = () => {
  const {
    openCard,
    canAccessDevTools,
    showDevTools,
    toggleDevTools,
    handleOpenCardClick,
    onSubmit,
    handleDeviceOverviewClick,
    handleGestureBtnClick,
    isOptionDisabled,
    isSaveChangesButtonDisabled,
    bluetooth,
    settings,
    unsupported,
  } = useHomeModel();

  const { methods } = settings;
  const {
    disconnect,
    sendPayloads,
    isConnected,
    isPairing,
    isSyncing,
    isListeningToGestures,
    deviceInfo,
    error,
  } = bluetooth;
  const {
    isAlarmUnsupported,
    isNudgeMoveUnsupported,
    isDailyActivityGoalUnsupported,
    isPreferencesUnsupported,
  } = unsupported;

  return (
    <>
      page under maintenance
      <DeviceOverview
        deviceInfo={deviceInfo}
        isConnected={isConnected}
        isSyncing={isSyncing}
        isPairing={isPairing}
        isListeningToGestures={isListeningToGestures}
        onClick={handleDeviceOverviewClick}
        onGestureBtnClick={handleGestureBtnClick}
      />
      {canAccessDevTools && showDevTools ? (
        <DevTools
          isConnected={isConnected}
          isSending={isSyncing}
          onSend={sendPayloads}
        />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <AlarmCard
              isDisabled={isOptionDisabled}
              isUnsupported={isAlarmUnsupported}
              isOpen={openCard === "alarm"}
              onOpenCardClick={handleOpenCardClick}
            />

            <NudgeMoveCard
              isDisabled={isOptionDisabled}
              isUnsupported={isNudgeMoveUnsupported}
              isOpen={openCard === "nudgeMove"}
              onOpenCardClick={handleOpenCardClick}
            />

            <DailyActivityGoalCard
              isDisabled={isOptionDisabled}
              isUnsupported={isDailyActivityGoalUnsupported}
              isOpen={openCard === "dailyActivityGoal"}
              onOpenCardClick={handleOpenCardClick}
            />

            <PreferencesCard
              isDisabled={isOptionDisabled}
              isUnsupported={isPreferencesUnsupported}
              isOpen={openCard === "preferences"}
              onOpenCardClick={handleOpenCardClick}
            />

            <div className="actions">
              <Button
                type="button"
                disabled={isOptionDisabled}
                onClick={disconnect}
              >
                Disconnect Device
              </Button>

              <Button type="submit" disabled={isSaveChangesButtonDisabled}>
                Save Changes
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
      {canAccessDevTools && (
        <div className={styles.devToolsToggle}>
          <Button onClick={toggleDevTools}>
            {showDevTools ? "Show Form" : "Show Dev Tools"}
          </Button>
        </div>
      )}
      {error && <Snackbar message={error.message} />}
    </>
  );
};

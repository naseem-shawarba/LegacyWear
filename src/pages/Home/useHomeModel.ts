import { useMemo, useState } from "react";

import { useBluetooth, useSettings } from "../../hooks";
import type { FormValues } from "../../hooks/useSettings";
import { unSupportedPayloadCategories } from "../../services/bluetooth/payloads";
import { isDevToolsEnabled } from "../../utils";

export const useHomeModel = () => {
  const [openCard, setOpenCard] = useState<string | null>("alarm");

  const canAccessDevTools = useMemo(isDevToolsEnabled, []);

  const [showDevTools, setShowDevTools] = useState(false);

  const bluetooth = useBluetooth();
  const settings = useSettings();

  const unsupported = unSupportedPayloadCategories(bluetooth.deviceInfo);

  const handleOpenCardClick = (id: string) => {
    setOpenCard((current) => (current === id ? null : id));
  };

  const toggleDevTools = () => setShowDevTools((current) => !current);

  const onSubmit = async (formValues: FormValues) => {
    const { ok } = await bluetooth.applySettings(formValues, unsupported);
    if (ok) settings.handleSuccessfulSend();
  };

  const handleDeviceOverviewClick = async () => {
    if (bluetooth.isConnected) {
      await bluetooth.refreshDeviceInfo();
    } else {
      await bluetooth.setupDevice(settings.methods.getValues());
    }
  };

  const isOptionDisabled =
    !bluetooth.isConnected || bluetooth.isSyncing || !bluetooth.deviceInfo;
  const isSaveChangesButtonDisabled =
    !settings.methods.formState.isDirty || isOptionDisabled;

  const handleGestureBtnClick = async () => {
    bluetooth.isListeningToGestures
      ? await bluetooth.stopListeningToGestures()
      : await bluetooth.listenToGestures();
  };

  return {
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
  };
};

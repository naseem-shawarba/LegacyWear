import { useEffect, useState } from "react";
import { AppInfo } from "../AppInfo";
import { Modal } from "../Modal";

import packageJson from "../../../package.json";
const STORAGE_KEY = `disclaimerAccepted_v_${packageJson.version}`;
export const AppOnboarding = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (accepted !== "true") {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Modal
      isOpen={isVisible}
      buttonLabel="I Understand & Accept"
      onClick={handleAccept}
    >
      <AppInfo />{" "}
    </Modal>
  );
};

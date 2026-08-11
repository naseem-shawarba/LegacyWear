import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    goatcounter: {
      count?: (vars?: {
        path?: string;
        title?: string;
        event?: boolean;
      }) => void;
    };
  }
}

export const useGoatCounter = ({ name }: { name: string }) => {
  const location = useLocation();

  useEffect(() => {
    if (document.getElementById("goatcounter-script")) return;
    const script = document.createElement("script");
    script.id = "goatcounter-script";
    script.src = "//gc.zgo.at/count.js";
    script.async = true;
    script.setAttribute(
      "data-goatcounter",
      `https://${name}.goatcounter.com/count`,
    );
    document.body.appendChild(script);
  }, [name]);

  useEffect(() => {
    if (window.goatcounter?.count) {
      window.goatcounter.count({ path: location.pathname + location.search });
    }
  }, [location]);
};

import { useEffect } from "react";

export function useAlertEffect(
  showAlert: boolean,
  setShowAlert: (value: boolean) => void
) {
  useEffect(() => {
    if (!showAlert) return;

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert]);
  return showAlert;
}

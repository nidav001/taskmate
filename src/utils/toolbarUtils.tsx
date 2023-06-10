import { useEffect, useState } from "react";

export function useAlertEffect(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    if (!value) return;

    setTimeout(() => {
      setValue(false);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const inputProps = {
    value,
    setValue,
  };

  return inputProps;
}

import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { snackbar } from "../../styles/transitionClasses";

type SnackbarProps = {
  showAlert: boolean;
  message: string;
  randomMessages?: string[];
  icon: JSX.Element;
};

export default function Snackbar({
  showAlert,
  message,
  randomMessages,
  icon,
}: SnackbarProps) {
  const [messageToDisplay, setMessageToDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (!showAlert) return;

    const randomMessage = randomMessages
      ? randomMessages[
          Math.floor(Math.random() * randomMessages.length)
        ]?.toString()
      : "";

    setMessageToDisplay(`${message} ${randomMessage}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert]);

  return (
    <Transition
      className="z-60 fixed bottom-3 flex w-full justify-center md:right-3 md:justify-end"
      show={showAlert}
      {...snackbar}
    >
      <div
        id="toast-success"
        className="text-medium flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow-2xl dark:bg-gray-800 dark:text-white "
        role="alert"
      >
        {icon}
        <div className="text-md ml-3 font-normal">{messageToDisplay}</div>
      </div>
    </Transition>
  );
}

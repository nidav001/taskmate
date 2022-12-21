export const dropdown = {
  enter: "transition ease-out duration-200",
  enterFrom: "transform opacity-0 scale-95",
  enterTo: "transform opacity-100 scale-100",
  leave: "transition ease-in duration-75",
  leaveFrom: "transform opacity-100 scale-200",
  leaveTo: "transform opacity-0 scale-95",
};

export const todo = {
  enter: "transform transition duration-[400ms]",
  enterFrom: "opacity-0 rotate-[-120deg] scale-50",
  enterTo: "opacity-100 rotate-0 scale-100",
  leave: "transform duration-200 transition ease-in-out",
  leaveFrom: "opacity-100 rotate-0 scale-100",
  leaveTo: "opacity-0 scale-95",
};

export const chevron = {
  enter: "transform transition duration-[300ms]",
  enterFrom: "rotate-[-180deg]",
  enterTo: "rotate-0",
};

export const threeDots = {
  enter: "transform transition duration-[300ms]",
  enterFrom: "opacity-0 rotate-[-360deg] scale-0",
  enterTo: "opacity-100 rotate-0 scale-100",
};

export const disclosurepanel = {
  enter: "transition ease-out duration-[600ms]",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
};

export const panel = {
  enter: "transition transition-[max-height] duration-200 ease-in",
  enterFrom: "transform max-h-0",
  enterTo: "transform max-h-screen",
  leave: "transition transition-[max-height] duration-400 ease-out",
  leaveFrom: "transform max-h-screen",
  leaveTo: "transform max-h-0",
};

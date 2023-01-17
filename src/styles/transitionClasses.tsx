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

export const todoItem = {
  enter: "transition ease-out duration-[600ms]",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
};

export const panel = {
  enter: "transition transition-[max-height] duration-[100ms] ease-in",
  enterFrom: "transform max-h-0",
  enterTo: "transform max-h-[8192px]",
  leave: "transition transition-[max-height] duration-[200ms] ease-out",
  leaveFrom: "transform max-h-[8192px]",
  leaveTo: "transform max-h-0",
};

export const sideMenu = {
  enter: "transform transition ease-in-out duration-150",
  enterFrom: "-translate-x-full",
  enterTo: "-translate-x-0",
  leave: "transform transition ease-in-out duration-150",
  leaveFrom: "-translate-x-0",
  leaveTo: "-translate-x-full",
};

export const profileMenu = {
  enter: "transition ease-out duration-100",
  enterFrom: "transform opacity-0 scale-95",
  enterTo: "transform opacity-100 scale-100",
  leave: "transition ease-in duration-75",
  leaveFrom: "transform opacity-100 scale-100",
  leaveTo: "transform opacity-0 scale-95",
};

export const snackbar = {
  enter: "transition ease-out duration-200",
  enterFrom: "opacity-0 translate-y-4",
  enterTo: "opacity-100 translate-y-0",
  leave: "transition ease-in duration-200",
  leaveFrom: "opacity-100 translate-y-0",
  leaveTo: "opacity-0 translate-y-4",
};

export const slideInSharedView = {
  enter: "transform transition ease-in-out duration-500",
  enterFrom: "translate-x-full",
  enterTo: "translate-x-0",
};

// export const slideInSharedView = {
//   enter: "transform transition ease-in-out duration-500",
//   enterFrom: "translate-x-full",
//   enterTo: "translate-x-0",
//   leave: "transform transition ease-in-out duration-500",
//   leaveFrom: "translate-x-full",
//   leaveTo: "translate-x-0",
// };

export const slideIn = {
  enter: "transform transition ease-in-out duration-500",
  enterFrom: "-translate-x-full",
  enterTo: "-translate-x-0",
};

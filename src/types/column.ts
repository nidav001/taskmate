import { type Todo } from "@prisma/client";
import { type Day } from "./enums";

export type Column = {
  id: Day;
  todoOrder: Todo[];
};

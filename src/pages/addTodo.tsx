import { type Todo } from "@prisma/client";
import classNames from "classnames";
import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import CollaboratorCombobox from "../components/shared/collaboratorComcobox";
import CustomHead from "../components/shared/customHead";
import GenericCombobox from "../components/shared/genericCombobox";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import Snackbar from "../components/shared/snackbar";
import useColumnStore from "../hooks/columnStore";
import useMostRecentTodoIdStore from "../hooks/mostRecentTodoStore";
import useSearchStore from "../hooks/searchStore";
import useViewStore from "../hooks/viewStore";
import getServerSideProps from "../lib/serverProps";
import { SnackbarCheckIcon } from "../resources/icons";
import {
  buttonStyle,
  gradientTextStyle,
  inputStyle,
} from "../styles/basicStyles";
import { Day } from "../types/enums";
import { useAlertEffect } from "../utils/toolbarUtils";
import { trpc } from "../utils/trpc";

function getTodaysDateName() {
  const date = new Date();
  return date.toLocaleDateString("de-DE", { weekday: "long" }) as Day;
}

const AddTodo: NextPage = () => {
  const { regularColumns, sharedColumns, setTodoOrder } = useColumnStore();
  const [selectedDay, setSelectedDay] = useState<Day>(getTodaysDateName());
  const { currentCollaborator } = useViewStore();

  const { search, setSearch } = useSearchStore();
  const { value: showAlert, setValue: setShowAlert } = useAlertEffect();
  const [todoPlaceholder, setTodoPlaceholder] = useState("");
  const { setMostRecentTodoId } = useMostRecentTodoIdStore();

  function getRandomPlaceholder() {
    const placeholders = [
      "Was gibt's zu tun?",
      "Was ist zu erledigen?",
      "Todo...",
      "Wäsche waschen...",
      "Einkaufen gehen...",
      "Zahnarzt...",
    ];
    return (
      placeholders[Math.floor(Math.random() * placeholders.length)] ?? "Todo..."
    );
  }

  useEffect(() => {
    setTodoPlaceholder(getRandomPlaceholder());
  }, []);

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      day: selectedDay,
      sharedWithEmail: undefined,
    },
  });

  const addTodo = trpc.todo.addTodo.useMutation({
    onMutate(data) {
      // Optimistically reset the form. Better use onSuccess if form gets more complex
      console.log(data);
      setValue("content", "");

      setTodoOrder(data.shared, data.day as Day, [
        ...((data.shared ? sharedColumns : regularColumns).find(
          (col) => col.id === data.day
        )?.todoOrder ?? []),
        data as Todo,
      ]);
      setMostRecentTodoId(data.id);
    },
  });

  type FormValues = {
    content: string;
    day: Day;
    shared: boolean;
    sharedWithEmail: string;
  };

  const onSubmit = (data: FormValues) => {
    setShowAlert(true);
    setSearch("");
    addTodo.mutate({
      id: uuidv4(),
      ...data,
      index: (
        (data.shared ? sharedColumns : regularColumns).find(
          (col) => col.id === data.day
        )?.todoOrder ?? []
      ).length,
    });
  };

  return (
    <>
      <CustomHead title="Todo hinzufügen" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex flex-col gap-10 pt-10">
            <div className="flex w-full justify-center">
              <h1
                className={classNames(
                  "flex h-20 items-center text-3xl lg:text-6xl",
                  gradientTextStyle
                )}
              >
                Todo hinzufügen
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <form
                className={classNames(
                  "items-left flex flex-col justify-center gap-5"
                )}
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  id="content"
                  className={inputStyle}
                  type="text"
                  placeholder={todoPlaceholder}
                  defaultValue={search}
                  {...register("content", { required: true })}
                />
                <input
                  className="hidden"
                  type="text"
                  {...register("day", { required: true })}
                />
                <GenericCombobox
                  show
                  sharedView={false}
                  selected={selectedDay}
                  setSelected={setSelectedDay}
                  setValue={setValue}
                  formValueType="day"
                  comboboxOptions={Object.keys(Day) as Array<keyof typeof Day>}
                />

                <label
                  htmlFor="shared "
                  className="flex flex-row-reverse items-center justify-end gap-2 dark:text-white"
                >
                  Geteiltes Todo
                  <input
                    id="shared"
                    className={classNames(inputStyle)}
                    type="checkbox"
                    defaultChecked={false}
                    {...register("shared", { required: false })}
                  />
                </label>
                {watch("shared") ? (
                  <CollaboratorCombobox setValueInForm={setValue} canAddEmail />
                ) : null}
                <div className="flex w-full justify-center">
                  <button
                    className={classNames("h-12 w-full", buttonStyle)}
                    type="submit"
                  >
                    Hinzufügen
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Link href="/todos">
            <Snackbar
              message="Hinzugefügt. Hier klicken um zu deinen Todos zu gelangen ➡️"
              showAlert={showAlert}
              icon={<SnackbarCheckIcon />}
            />
          </Link>
        </main>
      </div>
    </>
  );
};

export default AddTodo;

export { getServerSideProps };

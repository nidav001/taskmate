import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import CustomHead from "../components/shared/customHead";
import GenericCombobox from "../components/shared/genericCombobox";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import Snackbar from "../components/shared/snackbar";
import useColumnStore from "../hooks/columnStore";
import useMostRecentTodoIdStore from "../hooks/mostRecentTodoStore";
import useSearchStore from "../hooks/searchStore";
import getServerSideProps from "../lib/serverProps";
import { buttonStyle, inputStyle } from "../styles/basicStyles";
import { Day } from "../types/enums";
import { useAlertEffect } from "../utils/toolbarUtils";
import { trpc } from "../utils/trpc";

function getTodaysDateName() {
  const date = new Date();
  return date.toLocaleDateString("de-DE", { weekday: "long" }) as Day;
}

const AddTodo: NextPage = () => {
  const { columns, setColumnTodoOrder } = useColumnStore();
  const [selectedDay, setSelectedDay] = useState<Day>(getTodaysDateName());
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("");
  const { search, setSearch } = useSearchStore();
  const [showAlert, setShowAlert] = useState(false);
  const { setMostRecentTodoId } = useMostRecentTodoIdStore();
  useAlertEffect(showAlert, setShowAlert);

  const addTodo = trpc.todo.addTodo.useMutation({
    onMutate(data) {
      // Optimistically reset the form. Better use onSuccess if form gets more complex
      reset();
      setValue("day", selectedDay);

      setColumnTodoOrder(data.day as Day, [
        ...(columns.find((col) => col.id === data.day)?.todoOrder ?? []),
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

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: {
        day: selectedDay,
      },
    });

  const onSubmit = (data: FormValues) => {
    setShowAlert(true);
    setSearch("");
    addTodo.mutate({
      id: uuidv4(),
      ...data,
      index: (columns.find((col) => col.id === data.day)?.todoOrder ?? [])
        .length,
    });
  };

  return (
    <>
      <CustomHead title="Todo hinzufügen" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white dark:bg-slate-800">
          <TopNaviagtion />
          <div className="flex justify-center pt-5">
            <form
              className="items-left flex flex-col justify-center gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                id="content"
                className={inputStyle}
                type="text"
                placeholder="Todo..."
                defaultValue={search}
                {...register("content", { required: true })}
              />
              <input
                className="hidden"
                type="text"
                {...register("day", { required: true })}
              />
              <GenericCombobox
                show={true}
                sharedView={false}
                selected={selectedDay}
                setSelected={setSelectedDay}
                setValue={setValue}
                formValueType="day"
                comboboxOptions={Object.keys(Day) as Array<keyof typeof Day>}
              />

              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <label htmlFor="shared">Geteiltes Todo</label>
                <input
                  id="shared"
                  className={inputStyle}
                  type="checkbox"
                  defaultChecked={false}
                  {...register("shared", { required: false })}
                />
              </div>
              {watch("shared") ? (
                <GenericCombobox
                  show={true}
                  sharedView={false}
                  selected={selectedCollaborator}
                  setSelected={setSelectedCollaborator}
                  setValue={setValue}
                  formValueType="sharedWithEmail"
                  comboboxOptions={["niklas.davidsohn@gmail.com"]}
                />
              ) : null}
              <div className="flex w-full justify-center">
                <button className={"w-3/4 " + buttonStyle} type="submit">
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
          <Link href="/todos">
            <Snackbar
              message="Hinzugefügt. Hier klicken um zu deinen Todos zu gelangen ➡️"
              showAlert={showAlert}
            />
          </Link>
        </main>
      </div>
    </>
  );
};

export default AddTodo;

export { getServerSideProps };

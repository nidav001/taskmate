import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import DayCombobox from "../components/addTodo/dayCombobox";
import HeadComponent from "../components/shared/head";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import Snackbar from "../components/shared/snackbar";
import useSearchStore from "../hooks/searchStore";
import useTodoOrderStore from "../hooks/todoOrderStore";
import getServerSideProps from "../lib/serverProps";
import { buttonStyle, inputStyle } from "../styles/buttonStyle";
import { type Day } from "../types/enums";
import { trpc } from "../utils/trpc";

function getTodaysDateName() {
  const date = new Date();
  return date.toLocaleDateString("de-DE", { weekday: "long" }) as Day;
}

const AddTodo: NextPage = () => {
  const { columns, setColumnTodoOrder } = useTodoOrderStore();
  const [selected, setSelected] = useState<Day>(getTodaysDateName());
  const { search, setSearch } = useSearchStore();
  const [showAlert, setShowAlert] = useState(false);

  const addTodo = trpc.todo.addTodo.useMutation({
    onMutate(data) {
      // Optimistically reset the form. Better use onSuccess if form gets more complex
      reset();
      setValue("day", selected);

      setColumnTodoOrder(data.day as Day, [
        ...(columns.find((col) => col.id === data.day)?.todoOrder ?? []),
        data as Todo,
      ]);
    },
  });

  type FormValues = {
    content: string;
    day: Day;
  };

  const { register, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      day: selected,
    },
  });

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  }, [showAlert]);

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
      <HeadComponent title="Todo hinzufügen" />
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
              <DayCombobox
                selected={selected}
                setSelected={setSelected}
                setValue={setValue}
              />
              <div className="flex w-full justify-center">
                <button className={"w-3/4 " + buttonStyle} type="submit">
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
          <Link href="/todos">
            <Snackbar
              message="Hinzugefügt. Hier klicken um zu deinen Todos zu gelangen :)"
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

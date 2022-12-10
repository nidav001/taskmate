import { type Todo } from "@prisma/client";
import { DateTime, Info } from "luxon";
import { type NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import DayCombobox from "../components/addTodo/dayCombobox";
import Head from "../components/shared/head";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import useTodoOrderStore from "../hooks/todoOrderStore";
import getServerSideProps from "../lib/serverProps";
import { buttonStyle } from "../styles/buttonStyle";
import { trpc } from "../utils/trpc";

function getTodaysDateName() {
  return Info.weekdays("long")[DateTime.now().weekday - 1] ?? "Framstag";
}

const AddTodo: NextPage = () => {
  const { columns, setColumnTodoOrder } = useTodoOrderStore();
  const [selected, setSelected] = useState<string>(getTodaysDateName());

  const addTodo = trpc.todo.addTodo.useMutation({
    onMutate(data) {
      // Optimistically reset the form. Better use onSuccess if form gets more complex
      reset();
      setValue("day", selected);

      setColumnTodoOrder(data.day, [
        ...(columns.find((col) => col.id === data.day)?.todoOrder ?? []),
        data as Todo,
      ]);
      console.log(columns);
    },
  });

  const inputStyle = "rounded-xl py-3 pl-3 shadow-md outline-none border-0";

  type FormValues = {
    content: string;
    day: string;
  };

  const { register, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      day: selected,
    },
  });

  const onSubmit = (data: FormValues) => {
    const dateId = Info.weekdays("long").indexOf(data.day);
    addTodo.mutate({
      id: uuidv4(),
      content: data.content,
      day: dateId,
      index: (columns.find((col) => col.id === dateId)?.todoOrder ?? []).length,
    });
  };

  return (
    <>
      <Head title="Todo hinzufügen" />
      <div className="flex h-full min-h-screen flex-row">
        <SideNavigation />
        <main className="h-auto w-full bg-white">
          <TopNaviagtion />
          <div className="flex justify-center pt-5">
            <form
              className="items-left flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                id="content"
                className={inputStyle}
                type="text"
                placeholder="Todo..."
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
              <button className={buttonStyle} type="submit">
                Hinzufügen
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddTodo;

export { getServerSideProps };

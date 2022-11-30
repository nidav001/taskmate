import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import SideNavigation from "../components/shared/navigation/sideNavigation";
import TopNaviagtion from "../components/shared/navigation/topNavigation";
import useTodoOrderStore from "../hooks/todoOrderStore";
import getServerSideProps from "../lib/serverProps";
import { buttonStyle } from "../styles/buttonStyle";
import { Day } from "../types/enums";
import { trpc } from "../utils/trpc";

function getTodaysDateName() {
  const date = new Date();
  return date.toLocaleDateString("de-DE", { weekday: "long" }) as Day;
}

const AddTodo: NextPage = () => {
  const { columns, setColumnTodoOrder } = useTodoOrderStore();
  const [selected, setSelected] = useState<Day>(getTodaysDateName());
  const todos = trpc.todo.getTodos.useQuery();

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

  const inputStyle = "rounded-xl py-3 pl-3 shadow-md outline-none border-0";

  type FormValues = {
    content: string;
    day: Day;
  };

  const { register, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      day: selected,
    },
  });

  const onSubmit = (data: FormValues) => {
    addTodo.mutate({
      id: uuidv4(),
      ...data,
      index: (columns.find((col) => col.id === data.day)?.todoOrder ?? [])
        .length,
    });
  };

  const DayCombobox = (
    <Listbox
      value={selected}
      onChange={(val: Day) => {
        setSelected(val);
        setValue("day", val);
      }}
    >
      <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white p-3 pr-10 text-left shadow-md">
        <span className="block truncate">{selected}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="flex w-full flex-col items-start rounded-lg border bg-newGray2">
        {(Object.keys(Day) as Array<keyof typeof Day>).map((key) => (
          <Listbox.Option
            className="w-full p-2 hover:bg-laccent"
            key={key}
            value={key}
          >
            {key}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );

  return (
    <>
      <Head>
        <title>Add Todo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
              {DayCombobox}
              <button className={buttonStyle} type="submit">
                Send
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

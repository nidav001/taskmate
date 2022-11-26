import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import SideNavigation from "../components/sideNavigation";
import TopNaviagtion from "../components/topNavigation";
import useTodoOrderStore from "../hooks/todoOrderStore";
import { buttonStyle } from "../styles/buttonStyle";
import { Days } from "../types/enums";
import { trpc } from "../utils/trpc";

function getTodaysDateName() {
  const date = new Date();
  return date.toLocaleDateString("de-DE", { weekday: "long" }) as Days;
}

const AddTodo: NextPage = () => {
  const { columns, setColumnTodoOrder } = useTodoOrderStore();
  const [selected, setSelected] = useState<Days>(getTodaysDateName());

  const addTodo = trpc.todo.addTodo.useMutation({
    onSettled(data, error, variables, context) {
      reset();
      setValue("day", selected);

      // const createdRecordId = trpc.todo.getTodos.useQuery()
      // if (createdRecordId) setTodoOrder([...todoOrder, createdRecordId]);
    },
  });

  const inputStyle = "rounded-xl py-3 pl-3 shadow-md outline-none border-0";

  type FormValues = {
    content: string;
    day: Days;
  };

  const { register, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      day: selected,
    },
  });

  const onSubmit = (data: FormValues) => {
    const id = uuidv4();
    addTodo.mutate({ id: id, ...data });
    setColumnTodoOrder(data.day, [
      ...(columns.find((col) => col.id === data.day)?.todoOrder ?? []),
      id,
    ]);
  };

  const TypeCombobox = (
    <Listbox
      value={selected}
      onChange={(val: Days) => {
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
      <Listbox.Options className="flex flex-col rounded-xl">
        {(Object.keys(Days) as Array<keyof typeof Days>).map((key) => (
          <Listbox.Option
            className="p-2 hover:bg-laccent"
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
      <div className="flex flex-row">
        <SideNavigation />
        <main className="min-h-screen w-full bg-light">
          <TopNaviagtion />
          <div className="flex justify-center pt-5">
            <form
              className="flex flex-col items-center gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
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
              {TypeCombobox}
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

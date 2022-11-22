import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Navigation from "../components/navigation";
import TopNaviagtion from "../components/topNavigation";
import { TodoType } from "../types/todoType";
import { trpc } from "../utils/trpc";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AddTodo: NextPage = () => {
  const [selectedTodoType, setSelectedTodoType] = useState<string>(
    TodoType.Private
  );

  const addTodo = trpc.todo.addTodo.useMutation();

  const inputStyle = "rounded-xl py-3 pl-3 shadow-md hover:border-laccent";

  type FormValues = {
    title: string;
    content: string;
    type: TodoType;
    sharedWith: string;
    dueDate: string;
  };

  const { register, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      type: TodoType.Private,
    },
  });

  const onSubmit = (data: FormValues) => {
    addTodo.mutate(data);
    reset();
  };
  const TypeCombobox = (
    <Listbox
      value={selectedTodoType}
      onChange={(val: TodoType) => {
        setSelectedTodoType(val);
        setValue("type", val);
      }}
    >
      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white p-3 pr-10 text-left shadow-md">
        <span className="block truncate">{selectedTodoType}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="rounded-xl bg-daccent">
        {(Object.keys(TodoType) as Array<keyof typeof TodoType>).map((key) => (
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
        <Navigation />
        <main className="min-h-screen w-full bg-light lg:flex lg:flex-col">
          <TopNaviagtion />
          <div className="flex justify-center pt-5">
            <form
              className="flex flex-col items-center gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className={inputStyle}
                type="text"
                placeholder="Title"
                {...register("title", { required: true, maxLength: 80 })}
              />
              <input
                className={inputStyle}
                type="text"
                placeholder="Content"
                {...register("content", { required: true })}
              />
              <input
                className="hidden"
                type="text"
                {...register("type", { required: true })}
              />
              {TypeCombobox}
              <input
                placeholder="Shared with"
                className={classNames(
                  selectedTodoType === TodoType.Shared ? "" : "hidden",
                  inputStyle
                )}
                type="text"
                {...register("sharedWith")}
              />
              <button className="w-20 rounded-3xl bg-main p-2" type="submit">
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

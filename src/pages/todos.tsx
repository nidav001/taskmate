import { type Todo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Navigation from "../components/navigation";
import TopNaviagtion from "../components/topNavigation";
import { TodoType } from "../types/todoType";
import { trpc } from "../utils/trpc";

const Todos: NextPage = () => {
  const todos = trpc.todo.getTodos.useQuery();

  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <>
      <Head>
        <title>My Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <Navigation />
        <main className="min-h-screen w-full bg-light lg:flex lg:flex-col">
          <TopNaviagtion />
          <div className="flex flex-col items-center justify-center gap-4 pt-5">
            <input
              type="text"
              className="w-50 rounded-xl"
              placeholder="Search..."
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="flex flex-col justify-between gap-20">
              <div>
                <h2 className="flex justify-center text-2xl font-bold">
                  Private
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {todos.data
                    ?.filter(
                      (todo) =>
                        (todo.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                          todo.content
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())) &&
                        todo.type === TodoType.Private
                    )
                    .map((todo) => (
                      <TodoCard key={todo.id} todo={todo} />
                    ))}
                </div>
              </div>
              <div>
                <h2 className="flex justify-center text-2xl font-bold">
                  Shared
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {todos.data
                    ?.filter(
                      (todo) =>
                        (todo.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                          todo.content
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())) &&
                        todo.type === TodoType.Shared
                    )
                    .map(
                      (todo) => todo && <TodoCard key={todo?.id} todo={todo} />
                    )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Todos;

const TodoCard: React.FC<{ todo: Todo }> = ({ todo }) => {
  return (
    <Link
      href={`/todos/${todo.id}`}
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{todo.title}</h3>
        <input type="checkbox" className="h-6 w-6 rounded-full" />
      </div>

      <div className="w-80 text-lg">{todo.content}</div>
    </Link>
  );
};

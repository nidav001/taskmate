import { type NextPage } from "next";
import { useMemo } from "react";
import GeneralAndFinalizedTodos from "../../components/archivedAndFinalizedTodos/generalAndFinalizedTodos";
import getServerSideProps from "../../lib/serverProps";
import { trpc } from "../../utils/trpc";

const FinalizedTodos: NextPage = () => {
  const finalizedTodosQuery = trpc.todo.getFinalizedTodos.useQuery();
  const finalizedTodosFromDb = useMemo(
    () => finalizedTodosQuery?.data ?? [],
    [finalizedTodosQuery?.data]
  );

  return (
    <GeneralAndFinalizedTodos
      refetch={finalizedTodosQuery.refetch}
      todos={finalizedTodosFromDb ?? []}
      title="Finalisierte Todos"
    />
  );
};

export default FinalizedTodos;

export { getServerSideProps };

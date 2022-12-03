import { type NextPage } from "next";
import ArchivedAndFinalizedTodos from "../../components/archivedAndFinalizedTodos/archivedAndFinalizedTodos";
import getServerSideProps from "../../lib/serverProps";
import { trpc } from "../../utils/trpc";

const FinalizedTodos: NextPage = () => {
  const finalizedTodos = trpc.todo.getFinalizedTodos.useQuery().data;
  return (
    <ArchivedAndFinalizedTodos
      todos={finalizedTodos ?? []}
      title="Finalisierte Todos"
    />
  );
};

export default FinalizedTodos;

export { getServerSideProps };

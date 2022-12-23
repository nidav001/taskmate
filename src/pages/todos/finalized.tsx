import { type NextPage } from "next";
import GeneralAndFinalizedTodos from "../../components/archivedAndFinalizedTodos/generalAndFinalizedTodos";
import getServerSideProps from "../../lib/serverProps";
import { trpc } from "../../utils/trpc";

const FinalizedTodos: NextPage = () => {
  const finalizedTodos = trpc.todo.getFinalizedTodos.useQuery().data;
  return (
    <GeneralAndFinalizedTodos
      todos={finalizedTodos ?? []}
      title="Finalisierte Todos"
    />
  );
};

export default FinalizedTodos;

export { getServerSideProps };

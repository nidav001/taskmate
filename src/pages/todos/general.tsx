import { type NextPage } from "next";
import GeneralAndFinalizedTodos from "../../components/archivedAndFinalizedTodos/generalAndFinalizedTodos";
import getServerSideProps from "../../lib/serverProps";
import { trpc } from "../../utils/trpc";

const ArchivedTodos: NextPage = () => {
  const generalTodos = trpc.todo.getArchivedTodos.useQuery().data;
  return (
    <GeneralAndFinalizedTodos
      todos={generalTodos ?? []}
      title="Archivierte Todos"
    />
  );
};

export default ArchivedTodos;

export { getServerSideProps };

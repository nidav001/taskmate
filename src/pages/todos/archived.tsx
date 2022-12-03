import { type NextPage } from "next";
import ArchivedAndFinalizedTodos from "../../components/archivedAndFinalizedTodos/archivedAndFinalizedTodos";
import getServerSideProps from "../../lib/serverProps";
import { trpc } from "../../utils/trpc";

const ArchivedTodos: NextPage = () => {
  const archivedTodos = trpc.todo.getArchivedTodos.useQuery().data;
  return (
    <ArchivedAndFinalizedTodos
      todos={archivedTodos ?? []}
      title="Archivierte Todos"
    />
  );
};

export default ArchivedTodos;

export { getServerSideProps };

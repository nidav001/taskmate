import Link from "next/link";

const DashboardCard: React.FC<{
  title: string;
  href: string;
  content: number | undefined;
  isLoading: boolean;
}> = ({ title, href, content, isLoading }) => {
  const loadingSkeleton = (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="mb-4 h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-2 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  return (
    <Link
      className="min-w-content flex max-w-sm flex-1 flex-col gap-3 rounded-xl bg-dark/10 p-4 text-black hover:bg-dark/20"
      href={href}
    >
      {isLoading ? (
        loadingSkeleton
      ) : (
        <>
          <h3 className="text-2xl font-bold">{title}</h3>
          <div className="w-40 text-lg">{content}</div>
        </>
      )}
    </Link>
  );
};

export default DashboardCard;

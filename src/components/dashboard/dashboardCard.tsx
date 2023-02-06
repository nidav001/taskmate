import classNames from "classnames";
import Link from "next/link";

type DashboardCardProps = {
  title: string;
  href: string;
  content: number | undefined;
  isLoading: boolean;
  smallWidth: boolean;
};

const loadingSkeleton = (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="mb-4 h-2.5 w-36 rounded-full bg-gray-400" />
    <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-400" />
    <div className="mb-2.5 h-2 rounded-full bg-gray-400" />
    <div className="mb-2.5 h-2 max-w-[200px] rounded-full bg-gray-400" />
    <span className="sr-only">Loading...</span>
  </div>
);

export default function DashboardCard({
  title,
  href,
  content,
  isLoading,
  smallWidth,
}: DashboardCardProps) {
  return (
    <Link
      className={classNames(
        smallWidth ? "min-w-min max-w-[200px]" : "min-w-[320px] max-w-md",
        "backface-visibility-hidden  flex flex-1 transform flex-col gap-3 rounded-xl bg-gray-400 bg-opacity-20 p-4 text-sm font-medium transition hover:scale-105 hover:bg-gray-600 hover:bg-opacity-30 focus:outline-none active:bg-opacity-40"
      )}
      href={href}
    >
      {isLoading ? (
        loadingSkeleton
      ) : (
        <>
          <h3 className="text-2xl font-bold dark:text-white">{title}</h3>
          <div className="text-lg dark:text-slate-400">{content}</div>
        </>
      )}
    </Link>
  );
}

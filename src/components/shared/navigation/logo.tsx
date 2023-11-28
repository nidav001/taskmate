import classNames from "classnames";
import Link from "next/link";
import { gradientTextStyle } from "../../../styles/basicStyles";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="TaskMate"
      className={classNames(
        "py-3 pl-1 text-2xl tracking-tight text-slate-900 dark:text-white",
      )}
    >
      <h1>
        <span className={gradientTextStyle}>Task</span>
        Mate
      </h1>
    </Link>
  );
}

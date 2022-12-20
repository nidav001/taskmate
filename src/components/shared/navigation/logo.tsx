import Link from "next/link";
import classNames from "../../../utils/classNames";

type LogoProps = {
  logoShown: string;
};

function Logo({ logoShown }: LogoProps) {
  return (
    <Link href="/" aria-label="home">
      <div
        className={classNames(
          logoShown,
          "py-3 pl-1 text-2xl font-bold tracking-tight text-black dark:text-white"
        )}
      >
        <span className="text-sky-600">T3</span>Todo
      </div>
    </Link>
  );
}

export default Logo;

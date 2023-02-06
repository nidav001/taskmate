import classNames from "classnames";
import Link from "next/link";

type LogoProps = {
  logoShown: string;
};

export default function Logo({ logoShown }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="home"
      className={classNames(
        logoShown,
        "py-3 pl-1 text-2xl font-bold tracking-tight text-black dark:text-white"
      )}
    >
      <span className="text-sky-600">T3</span>
      Todo
    </Link>
  );
}

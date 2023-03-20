import classNames from "classnames";
import Link from "next/link";
import { gradientTextStyle } from "../../../styles/basicStyles";

type LogoProps = {
  logoStyle: string;
};

export default function Logo({ logoStyle: logoShown }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="home"
      className={classNames(
        logoShown,
        "py-3 pl-1 text-2xl tracking-tight text-black dark:text-white"
      )}
    >
      <span className={gradientTextStyle}>Task</span>
      Mate
    </Link>
  );
}

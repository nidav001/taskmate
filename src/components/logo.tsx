import classNames from "../utils/classNames";

const Logo: React.FC<{ logoShown: string }> = ({ logoShown }) => {
  return (
    <div
      className={classNames(
        logoShown,
        "py-3 pl-1 text-2xl font-bold tracking-tight text-black"
      )}
    >
      <span className="text-daccent">T3</span>Todo
    </div>
  );
};

export default Logo;

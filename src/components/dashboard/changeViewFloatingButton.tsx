import { faBars, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { floatingButtonDivStyle } from "../../styles/buttonStyle";

type FloatingButtonProps = {
  setSmallWidth: (smallWidth: boolean) => void;
  smallWidth: boolean;
};

function FloatingButton({ setSmallWidth, smallWidth }: FloatingButtonProps) {
  return (
    <div className={floatingButtonDivStyle}>
      <button
        className="h-10 w-10 p-2"
        onClick={() => setSmallWidth(!smallWidth)}
        aria-label="Change view"
      >
        <FontAwesomeIcon
          icon={smallWidth ? faTableCellsLarge : faBars}
          size="lg"
        />
      </button>
    </div>
  );
}

export default FloatingButton;

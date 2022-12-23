import { faBars, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { buttonStyle, floatingButtonDivStyle } from "../../styles/basicStyles";

type FloatingButtonProps = {
  setIsLayoutSmall: (isLayoutSmall: boolean) => void;
  isLayoutSmall: boolean;
};

export default function FloatingButton({
  setIsLayoutSmall,
  isLayoutSmall,
}: FloatingButtonProps) {
  return (
    <div className={floatingButtonDivStyle + " " + buttonStyle}>
      <button
        className="h-10 w-10 p-2"
        onClick={() => setIsLayoutSmall(!isLayoutSmall)}
        aria-label="Change view"
      >
        <FontAwesomeIcon icon={isLayoutSmall ? faTableCellsLarge : faBars} />
      </button>
    </div>
  );
}

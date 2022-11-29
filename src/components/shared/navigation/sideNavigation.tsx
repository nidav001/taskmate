import { LogoPosition } from "../../../types/enums";
import NavigationMenu from "./navigationMenu";

const SideNavigation: React.FC = () => {
  return (
    <div className="hidden flex-col border-r bg-newGray2 px-5 shadow-2xl md:flex md:w-60">
      <NavigationMenu logoShown={LogoPosition.Side} />
    </div>
  );
};

export default SideNavigation;

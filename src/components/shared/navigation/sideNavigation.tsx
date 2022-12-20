import { LogoPosition } from "../../../types/enums";
import NavigationMenu from "./navigationMenu";

function SideNavigation() {
  return (
    <div className="hidden flex-col border-r bg-gray-100 px-5 shadow-2xl md:flex md:w-60">
      <NavigationMenu logoShown={LogoPosition.Side} />
    </div>
  );
}

export default SideNavigation;

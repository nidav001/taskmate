import { LogoPosition } from "../types/enums";
import NavigationMenu from "./navigationMenu";

const SideNavigation: React.FC = () => {
  return (
    <div className="hidden min-h-screen flex-col bg-dark/20 px-5 md:flex md:w-60">
      <NavigationMenu logoShown={LogoPosition.Side} />
    </div>
  );
};

export default SideNavigation;

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 md:px-2">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <Link to="/">
            <NavigationMenuItem className="font-bold text-lg pr-4 Bitcount">
              make-it-oss
            </NavigationMenuItem>
          </Link>
          
        </NavigationMenuList>
      </NavigationMenu>
     

      <AnimatedThemeToggler />
    </div>
  )
}

export default Navbar
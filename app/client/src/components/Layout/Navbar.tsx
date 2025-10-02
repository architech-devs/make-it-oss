import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 md:px-0">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem className="font-bold text-lg pr-4 Bitcount">
            make-it-oss
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <AnimatedThemeToggler />
    </div>
  )
}

export default Navbar
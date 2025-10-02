import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/Theme/theme-provider"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <NavigationMenu >
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>{<Sun />}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[150px] gap-4">
                            <li>
                                <NavigationMenuLink asChild onClick={() => setTheme("light")} className="cursor-pointer">
                                    <div className="flex-row items-center gap-2">
                                        <Sun />
                                        Light
                                    </div>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild onClick={() => setTheme("dark")} className="cursor-pointer">
                                    <div className="flex-row items-center gap-2">
                                        <Moon />
                                        Dark
                                    </div>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild onClick={() => setTheme("system")} className="cursor-pointer">
                                    <div className="flex-row items-center gap-2">
                                        <Monitor />
                                        System
                                    </div>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList >
        </NavigationMenu >
    )
}
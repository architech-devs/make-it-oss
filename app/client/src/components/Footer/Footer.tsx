import Discord_logo from "@/assets/images/discord.png"
import Github_logo from "@/assets/images/github.png"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className="flex flex-col pb-2 items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2">
        <Link to="/docs" className="hover:text-muted-foreground transition-colors duration-200">Docs</Link>
        |
        <Link to="https://discord.gg/r9jzAFU3FM"><img src={Discord_logo} alt="" className="w-4 h-4" /></Link>
        |
        <Link to="https://github.com/architech-devs/make-it-oss"><img src={Github_logo} alt="" className="w-4 h-4 dark:invert" /></Link>
      </div>
      <Link
        to="https://github.com/architech-devs"
        className="hover:text-muted-foreground transition-colors duration-200"
      >
        The Architech Team
      </Link>
    </div>
  )
}

export default Footer
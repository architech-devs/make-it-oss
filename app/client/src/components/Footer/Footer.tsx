import Discord_logo from "@/assets/images/discord.png"
import Github_logo from "@/assets/images/github.png"
import X_logo from "@/assets/images/x.png"
import Youtube_logo from "@/assets/images/youtube.png"
import Gmail_logo from "@/assets/images/gmail.png"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className="flex flex-col pb-2 items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2">
        <Link to="/docs" className="hover:text-muted-foreground transition-colors duration-200">Docs</Link>
        |
        <Link to="https://discord.gg/r9jzAFU3FM" className="hover:opacity-70 transition-opacity"><img src={Discord_logo} alt="Discord" className="w-4 h-4" /></Link>
        |
        <Link to="https://github.com/architech-devs/make-it-oss" className="hover:opacity-70 transition-opacity"><img src={Github_logo} alt="GitHub" className="w-4 h-4 dark:invert" /></Link>
        |
        <Link to="https://twitter.com/architech_dev" className="hover:opacity-70 transition-opacity"><img src={X_logo} alt="Twitter" className="w-4 h-4 invert dark:invert-0" /></Link>
        |
        <Link to="https://youtube.com/channel/UC8LedUlToF1oO3E3NZG46aw" className="hover:opacity-70 transition-opacity"><img src={Youtube_logo} alt="Youtube" className="w-4" /></Link>
        |
        <Link to="mailto:architech.devs@gmail.com" className="hover:opacity-70 transition-opacity"><img src={Gmail_logo} alt="Youtube" className="w-4" /></Link>
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
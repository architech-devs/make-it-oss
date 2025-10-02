import Discord_logo from "@/assets/images/discord.png"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className="flex pb-2 items-center justify-center gap-2">
      Docs |
      <img src={Discord_logo} alt="" className="w-4 h-4" /> |
      <Link to="https://github.com/architech-devs"> The Architech Team</Link>
    </div>
  )
}

export default Footer
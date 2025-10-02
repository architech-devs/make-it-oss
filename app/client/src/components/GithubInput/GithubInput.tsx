import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const GithubInput = () => {
    const [repo, setRepo] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+\/[^/\s]+)/i
        const match = value.match(regex)
        if (match) {
            setRepo(match[1]) // only username/repo
        } else {
            setRepo(value) // fallback to raw input
        }
    }

    return (
        <div className="flex flex-col space-y-2 md:px-0 px-4">
            <div className="border p-4 rounded-2xl flex items-center md:text-2xl text-md justify-between">
                <div>
                    github.com/
                    <input
                        type="text"
                        value={repo}
                        onChange={handleChange}
                        className="outline-none md:w-[60%] w-[50%]"
                        placeholder="username/repo"
                    />
                </div>
                <Button variant="ghost">
                    <ArrowRight />
                </Button>
            </div>
            <span className="text-xs text-center text-muted-foreground">
                enter your github repo to get started
            </span>
        </div>
    )
}

export default GithubInput

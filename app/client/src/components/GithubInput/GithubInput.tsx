import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import FileChecklist from "@/components/FileChecklist/FileChecklist"
import { fetchRepoFiles, type FileStatus } from "@/utils/api"

interface GithubInputProps {
    onFilesReady?: (files: FileStatus[]) => void
    filesOnly?: boolean
    files?: FileStatus[]
}

const GithubInput = ({ onFilesReady, filesOnly, files: propFiles }: GithubInputProps) => {
    const [repo, setRepo] = useState("")
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<FileStatus[] | null>(null)
    const [error, setError] = useState("")

    // Effect to notify parent when files are ready (only once when files first load)
    const hasNotifiedRef = useRef(false)
    
    useEffect(() => {
        if (files && files.length > 0 && onFilesReady && !hasNotifiedRef.current) {
            onFilesReady(files)
            hasNotifiedRef.current = true
        }
    }, [files, onFilesReady])
    
    // Reset notification flag when files are cleared
    useEffect(() => {
        if (!files) {
            hasNotifiedRef.current = false
        }
    }, [files])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+\/[^/\s]+)/i
        const match = value.match(regex)
        if (match) {
            setRepo(match[1]) // only username/repo
        } else {
            setRepo(value) // fallback to raw input
        }
        // Clear previous results when user types
        setFiles(null)
        setError("")
    }

    const handleSubmit = async () => {
        if (!repo) {
            setError("Please enter a repository URL")
            return
        }

        setLoading(true)
        setError("")
        setFiles(null)

        try {
            const repoUrl = `https://github.com/${repo}`
            const data = await fetchRepoFiles(repoUrl)

            if (data.success && data.files) {
                setFiles(data.files)
            } else {
                setError(data.message || "Failed to fetch files")
            }
        } catch (err) {
            setError("Failed to connect to server. Please try again.")
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    // If filesOnly mode, only render the files section using propFiles
    if (filesOnly && propFiles) {
        return <FileChecklist files={propFiles} />
    }

    return (
        <div className="flex flex-col space-y-4 md:px-0 px-4">
            <div className="border p-4 rounded-2xl flex items-center md:text-2xl text-md justify-between">
                <div className="flex w-full">
                    github.com/
                    <input
                        type="text"
                        value={repo}
                        onChange={handleChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="outline-none w-full"
                        placeholder="username/repo"
                        disabled={loading}
                    />
                </div>
                <Button 
                    variant="ghost" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                </Button>
            </div>
            <span className="text-xs text-center text-muted-foreground">
                enter your github repo to get started
            </span>

            {error && (
                <div className="border border-red-600 bg-red-600/10 rounded-2xl p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {files && <FileChecklist files={files} />}
        </div>
    )
}

export default GithubInput
import { CheckCircle2, XCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface FileChecklistProps {
    files: Array<{
        name: string
        exists: boolean
    }>
}

const FileChecklist = ({ files }: FileChecklistProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const existingFiles = files.filter(f => f.exists)
    const missingFiles = files.filter(f => !f.exists)

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setIsVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div 
            className={`border rounded-2xl p-6 space-y-4 transition-all duration-300 ease-out ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-4'
            }`}
        >
            <h3 className="text-xl font-semibold">Community Guidelines Status</h3>
            
            {existingFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
                        ✓ Found ({existingFiles.length})
                    </h4>
                    <ul className="space-y-2">
                        {existingFiles.map((file) => (
                            <li key={file.name} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span>{file.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {missingFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                        ✗ Missing ({missingFiles.length})
                    </h4>
                    <ul className="space-y-2">
                        {missingFiles.map((file) => (
                            <li key={file.name} className="flex items-center gap-2 text-sm opacity-60">
                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <span>{file.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default FileChecklist
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import FileChecklist from "@/components/FileChecklist/FileChecklist";
import { fetchRepoFiles, type FileStatus } from "@/utils/api";

const GithubInput = () => {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileStatus[] | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+\/[^/\s]+)/i;
    const match = value.match(regex);

    if (match) {
      setRepo(match[1]); // only username/repo
    } else {
      setRepo(value); // fallback to raw input
    }

    // Clear previous results and errors when user types
    setFiles(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!repo) {
      setError("Please enter a repository URL");
      return;
    }

    setLoading(true);
    setError("");
    setFiles(null);

    try {
      const repoUrl = `https://github.com/${repo}`;
      const data = await fetchRepoFiles(repoUrl);

      if (data.success && data.files) {
        setFiles(data.files);
      } else {
        setError(data.message || "Failed to fetch files");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 md:px-0 px-4">
      <div
        className={`border p-4 rounded-2xl flex items-center md:text-2xl text-md justify-between
          ${error ? "border-red-600" : "border-gray-300 dark:border-gray-600"}`}
      >
        <div>
          github.com/
          <input
            type="text"
            value={repo}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`outline-none md:w-[60%] w-[50%] ${
              error ? "border-red-600" : ""
            }`}
            placeholder="username/repo"
            disabled={loading}
          />
        </div>
        <Button variant="ghost" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </Button>
      </div>

      {/* Instruction text */}
      <span className="text-xs text-center text-muted-foreground">
        enter your github repo to get started
      </span>

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-1 text-center">
          {error}
        </div>
      )}

      {/* File checklist */}
      {files && <FileChecklist files={files} />}
    </div>
  );
};

export default GithubInput;

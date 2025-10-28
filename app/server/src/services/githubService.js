import { Octokit } from "octokit";

async function getOctokitInstance(userId) {
  const githubToken = process.env.GITHUB_TOKEN;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[GithubService - getOctokitInstance] GITHUB_TOKEN status: ${githubToken ? 'Set' : 'Not Set'}`);
  }
  if (!githubToken) {
    throw new Error("GitHub token not configured");
  }
  return new Octokit({ auth: githubToken });
}

async function fetchFiles(octokit, owner, repo, branch) {
  const fileTree = [];
  const codeSamples = [];

  async function getTree(sha, path = '') {
    const { data } = await octokit.rest.git.getTree({ owner, repo, tree_sha: sha, recursive: "true" });
    for (const item of data.tree) {
      if (item.type === "blob" && item.path.endsWith(".js")) {
        fileTree.push(path ? `${path}/${item.path}` : item.path);
        if (codeSamples.length < 5 && item.size < 10000) {
          try {
            const { data: file } = await octokit.rest.repos.getContent({ owner, repo, path: item.path, ref: branch });
            if (file.content) {
              const decodedContent = Buffer.from(file.content, 'base64').toString('utf8');
              codeSamples.push(`// Path: ${item.path}\n${decodedContent}`);
            }
          } catch (contentError) {
            console.error(`Failed to fetch content for ${item.path}:`, contentError.message);
          }
        }
      }
    }
  }

  const { data: { commit: { sha } } } = await octokit.rest.repos.getBranch({ owner, repo, branch });
  await getTree(sha);

  return { fileTree: fileTree.join('\n'), codeSamples: codeSamples.join('\n\n') };
}

export { getOctokitInstance, fetchFiles };


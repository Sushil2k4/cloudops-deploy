const { parseGitHubRepo } = require("../utils/validation");

async function fileExistsInRepo(owner, repo, fileName) {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "CloudOps-Deploy",
      },
    });

    return response.ok;
  } catch (_error) {
    return false;
  }
}

function inferFromRepoName(repoUrl) {
  const normalized = repoUrl.toLowerCase();

  if (normalized.includes("node") || normalized.includes("react") || normalized.includes("next")) {
    return "Node";
  }

  if (normalized.includes("python") || normalized.includes("django") || normalized.includes("flask")) {
    return "Python";
  }

  if (normalized.includes("java") || normalized.includes("spring") || normalized.includes("maven")) {
    return "Java";
  }

  return "Unknown";
}

async function detectStack(repoUrl) {
  const { owner, repo } = parseGitHubRepo(repoUrl);

  const checks = [
    { file: "package.json", stack: "Node" },
    { file: "requirements.txt", stack: "Python" },
    { file: "pom.xml", stack: "Java" },
  ];

  for (const check of checks) {
    const exists = await fileExistsInRepo(owner, repo, check.file);
    if (exists) {
      return check.stack;
    }
  }

  return inferFromRepoName(repoUrl);
}

module.exports = {
  detectStack,
};

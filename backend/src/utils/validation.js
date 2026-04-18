function isValidGitHubRepoUrl(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  const githubRepoPattern = /^https:\/\/github\.com\/[^\s/]+\/[^\s/]+\/?$/i;
  return githubRepoPattern.test(value.trim());
}

function parseGitHubRepo(value) {
  const trimmed = value.trim().replace(/\/$/, "");
  const parts = trimmed.replace("https://github.com/", "").split("/");

  return {
    owner: parts[0],
    repo: parts[1],
  };
}

module.exports = {
  isValidGitHubRepoUrl,
  parseGitHubRepo,
};

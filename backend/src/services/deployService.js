const crypto = require("crypto");
const { saveDeployment, getDeployment } = require("../store/deployStore");
const { detectStack } = require("./stackDetector");
const { generateDockerfile } = require("./dockerfileService");
const { isValidGitHubRepoUrl } = require("../utils/validation");

const DEPLOY_STAGES = {
  BUILDING: "Building",
  DEPLOYING: "Deploying",
  SUCCESS: "Success",
  FAILED: "Failed",
};

function updateDeployment(id, updates) {
  const existing = getDeployment(id);
  if (!existing) {
    return null;
  }

  const merged = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDeployment(merged);
  return merged;
}

function scheduleSimulation(id) {
  setTimeout(() => {
    const current = getDeployment(id);
    if (!current) {
      return;
    }

    updateDeployment(id, {
      status: DEPLOY_STAGES.DEPLOYING,
      logs: [
        ...current.logs,
        "Build artifacts generated.",
        "Provisioning deployment runtime.",
      ],
    });
  }, 1400);

  setTimeout(() => {
    const current = getDeployment(id);
    if (!current) {
      return;
    }

    const shouldFail = Math.random() < 0.08;

    if (shouldFail) {
      updateDeployment(id, {
        status: DEPLOY_STAGES.FAILED,
        logs: [...current.logs, "Health checks failed in target environment."],
      });
      return;
    }

    updateDeployment(id, {
      status: DEPLOY_STAGES.SUCCESS,
      url: `https://deploy-${id.slice(0, 8)}.cloudops.app`,
      logs: [
        ...current.logs,
        "Containers running.",
        "Deployment successful. URL assigned.",
      ],
    });
  }, 3100);
}

async function deployRepository(repoUrl) {
  if (!isValidGitHubRepoUrl(repoUrl)) {
    const error = new Error("Please provide a valid GitHub repository URL.");
    error.statusCode = 400;
    throw error;
  }

  const stack = await detectStack(repoUrl);
  const dockerfile = generateDockerfile(stack);

  const id = crypto.randomUUID();
  const deployment = {
    id,
    repoUrl,
    status: DEPLOY_STAGES.BUILDING,
    stack,
    dockerfile,
    url: null,
    logs: [
      "Repository URL validated.",
      `Detected tech stack: ${stack}.`,
      "Dockerfile generated.",
      "Starting build pipeline...",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveDeployment(deployment);
  scheduleSimulation(id);

  return deployment;
}

async function findDeploymentById(id) {
  const deployment = getDeployment(id);

  if (!deployment) {
    const error = new Error("Deployment not found.");
    error.statusCode = 404;
    throw error;
  }

  return deployment;
}

module.exports = {
  deployRepository,
  findDeploymentById,
};

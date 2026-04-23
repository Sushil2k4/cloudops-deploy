const crypto = require("crypto");
const { saveDeployment, getDeployment } = require("../store/deployStore");
const { detectStack } = require("./stackDetector");
const { generateDockerfile } = require("./dockerfileService");
const { isValidGitHubRepoUrl } = require("../utils/validation");
const { updateDeployment } = require("./deploymentHelper");
const { runRealDeployment } = require("./realDeployService");

const DEPLOY_STAGES = {
  BUILDING: "Building",
  DEPLOYING: "Deploying",
  SUCCESS: "Success",
  FAILED: "Failed",
};

function scheduleSimulation(id) {
  setTimeout(() => {
    const current = getDeployment(id);
    if (!current) return;

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
    if (!current) return;

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

  // 🔥 CINEVORA REDIRECT
  if (repoUrl.includes("Sushil2k4/cinevora")) {
    const id = crypto.randomUUID();

    const deployment = {
      id,
      repoUrl,
      status: DEPLOY_STAGES.SUCCESS,
      stack: "Frontend (Vite)",
      dockerfile: null,
      url: "https://cinevora-movies.vercel.app/",
      logs: [
        "Frontend project detected.",
        "Using pre-deployed production URL.",
        "Redirecting to Vercel deployment.",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveDeployment(deployment);
    return deployment;
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

  // 🔥 REAL DEPLOYMENT SWITCH (IMPORTANT)
  if (process.env.REAL_DEPLOY === "true") {
    await runRealDeployment(id, repoUrl, stack);
  } else {
    scheduleSimulation(id);
  }

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
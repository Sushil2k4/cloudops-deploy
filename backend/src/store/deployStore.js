const deployments = new Map();

function saveDeployment(deployment) {
  deployments.set(deployment.id, deployment);
  return deployment;
}

function getDeployment(id) {
  return deployments.get(id) || null;
}

module.exports = {
  saveDeployment,
  getDeployment,
};

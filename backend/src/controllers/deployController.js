const { deployRepository, findDeploymentById } = require("../services/deployService");

async function createDeployment(req, res, next) {
  try {
    const { repoUrl } = req.body || {};
    const deployment = await deployRepository(repoUrl);

    res.status(202).json(deployment);
  } catch (error) {
    next(error);
  }
}

async function getDeploymentStatus(req, res, next) {
  try {
    const deployment = await findDeploymentById(req.params.id);
    res.json(deployment);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createDeployment,
  getDeploymentStatus,
};

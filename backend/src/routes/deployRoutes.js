const express = require("express");
const { createDeployment, getDeploymentStatus } = require("../controllers/deployController");

const router = express.Router();

router.post("/deploy", createDeployment);
router.get("/status/:id", getDeploymentStatus);

module.exports = router;
const express = require("express");
const cors = require("cors");
const deployRoutes = require("./routes/deployRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      service: "CloudOps Deploy API",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/", deployRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
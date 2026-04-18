const dotenv = require("dotenv");
const { createApp } = require("./src/app");

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`CloudOps API running on port ${port}`);
});
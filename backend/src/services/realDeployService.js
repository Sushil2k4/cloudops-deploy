const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { updateDeployment } = require("./deploymentHelper");

const runRealDeployment = async (id, repoUrl, stack) => {
    const repoName = repoUrl.split("/").pop().replace(".git", "");
    const projectPath = path.join(process.cwd(), "temp", repoName);

    if (!fs.existsSync(path.join(process.cwd(), "temp"))) {
        fs.mkdirSync(path.join(process.cwd(), "temp"));
    }

    // Clone repo
    exec(`git clone ${repoUrl} ${projectPath}`, (err) => {
        if (err) {
            updateDeployment(id, {
                status: "Failed",
                logs: ["Git clone failed"],
            });
            return;
        }

        // Simple Node Dockerfile
        const dockerfile = `
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
        `;

        fs.writeFileSync(path.join(projectPath, "Dockerfile"), dockerfile);

        // Build image
        exec(`docker build -t ${repoName} ${projectPath}`, (err) => {
            if (err) {
                updateDeployment(id, {
                    status: "Failed",
                    logs: ["Docker build failed"],
                });
                return;
            }

            const port = 3000 + Math.floor(Math.random() * 1000);

            // Run container
            exec(`docker run -d -p ${port}:5000 -e PORT=5000 ${repoName}`, (err) => {
                if (err) {
                    updateDeployment(id, {
                        status: "Failed",
                        logs: ["Docker run failed"],
                    });
                    return;
                }

                updateDeployment(id, {
                    status: "Success",
                    url: `http://localhost:${port}`,
                    logs: ["Deployment successful"],
                });
            });
        });
    });
};

module.exports = { runRealDeployment };
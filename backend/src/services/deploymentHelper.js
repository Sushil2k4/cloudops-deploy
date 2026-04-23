const { saveDeployment, getDeployment } = require("../store/deployStore");

function updateDeployment(id, updates) {
    const existing = getDeployment(id);
    if (!existing) return null;

    const merged = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    saveDeployment(merged);
    return merged;
}

module.exports = { updateDeployment };
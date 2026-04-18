function generateDockerfile(stack) {
  const templates = {
    Node: [
      "FROM node:20-alpine",
      "WORKDIR /app",
      "COPY package*.json ./",
      "RUN npm ci --omit=dev",
      "COPY . .",
      "EXPOSE 3000",
      "CMD [\"npm\", \"start\"]",
    ].join("\n"),
    Python: [
      "FROM python:3.12-slim",
      "WORKDIR /app",
      "COPY requirements.txt ./",
      "RUN pip install --no-cache-dir -r requirements.txt",
      "COPY . .",
      "EXPOSE 8000",
      "CMD [\"python\", \"app.py\"]",
    ].join("\n"),
    Java: [
      "FROM maven:3.9-eclipse-temurin-21 AS build",
      "WORKDIR /build",
      "COPY pom.xml .",
      "COPY src ./src",
      "RUN mvn -B package --file pom.xml -DskipTests",
      "",
      "FROM eclipse-temurin:21-jre",
      "WORKDIR /app",
      "COPY --from=build /build/target/*.jar app.jar",
      "EXPOSE 8080",
      "ENTRYPOINT [\"java\", \"-jar\", \"/app/app.jar\"]",
    ].join("\n"),
    Unknown: [
      "FROM alpine:3.20",
      "WORKDIR /app",
      "COPY . .",
      "CMD [\"sh\", \"-c\", \"echo Add runtime commands for your stack\"]",
    ].join("\n"),
  };

  return templates[stack] || templates.Unknown;
}

module.exports = {
  generateDockerfile,
};
# Phase 66: Advanced TypeScript – Advanced DevOps Engineering, Docker, Kubernetes, CI/CD, Infrastructure as Code, AWS, Cloud Architecture, Monitoring and Production Deployment

**Level:** Expert / Advanced DevOps and Cloud Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express, React, Next.js, SQL, MongoDB, Git, software testing and basic Docker/cloud concepts.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Design and implement a professional DevOps workflow.
2. Manage advanced Git workflows and release strategies.
3. Build, optimize and secure Docker images.
4. Containerize TypeScript and Node.js applications.
5. Manage multi-container applications using Docker Compose.
6. Understand Kubernetes architecture and deployments.
7. Configure Kubernetes networking, storage and autoscaling.
8. Build automated CI/CD pipelines.
9. Manage cloud infrastructure using Terraform and Ansible.
10. Deploy applications on AWS.
11. Implement production monitoring and observability.
12. Configure zero-downtime deployments.
13. Optimize cloud infrastructure costs.
14. Design enterprise-grade deployment architectures.

# 2. DevOps Fundamentals

## 2.1 What is DevOps?

DevOps is a combination of **Development (Dev)** and **Operations (Ops)** practices that improves collaboration between software development and infrastructure/operations teams.

Traditionally:

- Developers write application code.
- Operations teams manage servers and deployments.
- Developers hand over code to operations.
- Deployment and troubleshooting happen separately.

This can create communication problems, deployment delays and inconsistent environments.

DevOps introduces automation, collaboration and continuous feedback.

### Traditional Workflow

```text
Developer
    |
    v
Write Code
    |
    v
Testing
    |
    v
Operations Team
    |
    v
Manual Deployment
    |
    v
Production
```

### DevOps Workflow

```text
Plan
  |
  v
Code
  |
  v
Build
  |
  v
Test
  |
  v
Release
  |
  v
Deploy
  |
  v
Operate
  |
  v
Monitor
  |
  +-------- Feedback --------+
  |                          |
  +----------> Plan <--------+
```

The DevOps lifecycle is continuous.

## 2.2 Core DevOps Principles

| Principle | Explanation |
|---|---|
| Automation | Automate repetitive processes. |
| Continuous Integration | Frequently integrate and validate code changes. |
| Continuous Delivery | Keep software ready for release. |
| Continuous Deployment | Automatically release qualifying changes. |
| Monitoring | Monitor application and infrastructure health. |
| Collaboration | Improve communication between teams. |
| Infrastructure as Code | Manage infrastructure through code. |
| Security | Integrate security into development and deployment. |

## 2.3 What is DevSecOps?

DevSecOps integrates security into the entire DevOps lifecycle.

Traditional approach:

```text
Development → Deployment → Security Review
```

DevSecOps approach:

```text
Code
 |
 v
Security Scanning
 |
 v
Build
 |
 v
Dependency Scanning
 |
 v
Testing
 |
 v
Container Scanning
 |
 v
Deployment
 |
 v
Runtime Security Monitoring
```

Security should not be treated as a final step.

Examples of security practices:

- Dependency vulnerability scanning.
- Static Application Security Testing (SAST).
- Dynamic Application Security Testing (DAST).
- Container image scanning.
- Secret detection.
- Infrastructure security scanning.
- Access control and least privilege.

## 2.4 What is Infrastructure as Code?

Infrastructure as Code (IaC) means managing infrastructure through configuration files instead of manually creating resources.

Without IaC:

1. Open AWS Console.
2. Create EC2 instance.
3. Configure networking.
4. Create security groups.
5. Configure storage.
6. Repeat the process for another environment.

With IaC:

```text
Terraform Configuration
          |
          v
Infrastructure Plan
          |
          v
Infrastructure Apply
          |
          v
AWS Resources Created
```

Popular IaC tools:

- Terraform
- AWS CloudFormation
- Pulumi
- OpenTofu

---

# 3. Software Development Lifecycle (SDLC)

SDLC describes the stages involved in developing and maintaining software.

## 3.1 SDLC Phases

| Phase | Description |
|---|---|
| Planning | Define project goals and requirements. |
| Analysis | Understand technical and business requirements. |
| Design | Design architecture and database structures. |
| Development | Write application code. |
| Testing | Verify functionality and quality. |
| Deployment | Release software into an environment. |
| Maintenance | Monitor, fix and improve software. |

## 3.2 Development Environments

Professional applications commonly use multiple environments.

| Environment | Purpose |
|---|---|
| Local | Developer's machine. |
| Development | Shared development environment. |
| Testing | QA and automated testing. |
| Staging | Production-like validation. |
| Production | Environment used by real customers. |

Example:

```text
Developer Machine
       |
       v
Development Environment
       |
       v
Testing Environment
       |
       v
Staging Environment
       |
       v
Production Environment
```

**Important:** Production credentials and production data should not be casually copied into development or testing environments.

---

# 4. Advanced Git Workflows

Git is a distributed version control system used to track changes in source code.

## 4.1 Git Branching

A branch allows developers to work independently without directly modifying another branch.

Example:

```text
main
 |
 +---- feature/user-authentication
 |
 +---- feature/payment-integration
 |
 +---- bugfix/login-error
```

Create a branch:

```bash
git branch feature/user-authentication
```

Switch to a branch:

```bash
git switch feature/user-authentication
```

Create and switch simultaneously:

```bash
git switch -c feature/user-authentication
```

Merge a branch:

```bash
git switch main

git merge feature/user-authentication
```

Delete a merged branch:

```bash
git branch -d feature/user-authentication
```

## 4.2 GitHub Flow

GitHub Flow is a lightweight branching strategy.

Typical workflow:

1. Start from the main branch.
2. Create a feature branch.
3. Implement changes.
4. Commit and push changes.
5. Create a Pull Request.
6. Review and test changes.
7. Merge into main.
8. Deploy through CI/CD.

```text
main
 |
 +---- feature/login
          |
          v
       Changes
          |
          v
      Pull Request
          |
          v
        Review
          |
          v
        Testing
          |
          v
         Merge
          |
          v
       Deployment
```

GitHub Flow is suitable for many modern application teams.

## 4.3 GitFlow

GitFlow defines multiple long-lived and temporary branches.

| Branch | Purpose |
|---|---|
| main | Production-ready code. |
| develop | Integration of upcoming features. |
| feature/* | New functionality. |
| release/* | Preparing a release. |
| hotfix/* | Emergency production fixes. |

Example:

```text
main
 |
 +---- develop
         |
         +---- feature/auth
         |
         +---- feature/dashboard
         |
         +---- release/1.0
         |
         +---- hotfix/payment-error
```

GitFlow is useful for some versioned release processes, although trunk-based development is often simpler for teams deploying frequently.

## 4.4 Trunk-Based Development

Trunk-based development encourages developers to integrate small changes frequently into a shared main branch.

Features are often controlled using feature flags.

Advantages:

- Reduces long-lived branch conflicts.
- Encourages continuous integration.
- Makes frequent releases easier.
- Reduces integration complexity.

## 4.5 Advanced Git Commands

### Rebase

Rebase moves commits onto another base commit.

```bash
git switch feature/login

git rebase main
```

Rebase can produce a cleaner linear history.

Avoid rebasing shared commits without coordination because it rewrites commit history.

### Cherry-pick

Apply a specific commit to the current branch.

```bash
git cherry-pick <commit-hash>
```

Useful when you need one particular fix without merging an entire branch.

### Stash

Temporarily save uncommitted changes.

```bash
git stash
```

List stashes:

```bash
git stash list
```

Restore changes:

```bash
git stash pop
```

### Tags

Tags identify specific commits, commonly for releases.

```bash
git tag v1.0.0

git push origin v1.0.0
```

Annotated tag:

```bash
git tag -a v1.0.0 -m "First production release"
```

---

# 5. Docker Architecture

## 5.1 What is Docker?

Docker is a platform for building, packaging and running applications inside containers.

A container packages an application with its required runtime dependencies and configuration.

For example, a Node.js application might require:

- Node.js runtime.
- Application source code.
- npm dependencies.
- Configuration.
- Required system libraries.

Docker packages these requirements into a container image.



## 5.2 Docker Architecture Components

| Component | Description |
|---|---|
| Docker Client | Sends commands to Docker. |
| Docker Daemon | Manages Docker objects and operations. |
| Docker Image | Read-only template used to create containers. |
| Docker Container | Running or stopped instance of an image. |
| Docker Registry | Stores and distributes images. |
| Dockerfile | Instructions used to build an image. |

### Docker Workflow

```text
Dockerfile
    |
    v
docker build
    |
    v
Docker Image
    |
    v
docker run
    |
    v
Container
    |
    v
Application Running
```

## 5.3 Docker Image vs Container

| Docker Image | Docker Container |
|---|---|
| Application template. | Instance of an image. |
| Generally immutable. | Has a writable container layer. |
| Used to create containers. | Runs the application process. |
| Can be stored in a registry. | Runs on a container runtime. |

Example:

```bash
docker pull node:22

docker run node:22
```

The first command downloads an image.

The second creates and starts a container from that image.

## 5.4 Install Docker

For Windows development, Docker Desktop is commonly used with WSL 2.

Official resources:

- [Docker Documentation](https://docs.docker.com/?utm_source=chatgpt.com)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

Verify installation:

```bash
docker --version
```

Check Docker information:

```bash
docker info
```

Check running containers:

```bash
docker ps
```

Check all containers:

```bash
docker ps -a
```

---

# 6. Docker Images and Containers

## 6.1 Common Docker Commands

| Command | Purpose |
|---|---|
| `docker images` | List local images. |
| `docker ps` | List running containers. |
| `docker ps -a` | List all containers. |
| `docker pull` | Download an image. |
| `docker build` | Build an image. |
| `docker run` | Create and start a container. |
| `docker start` | Start an existing container. |
| `docker stop` | Stop a container. |
| `docker restart` | Restart a container. |
| `docker rm` | Remove a container. |
| `docker rmi` | Remove an image. |
| `docker logs` | Display container logs. |
| `docker exec` | Execute a command inside a running container. |
| `docker inspect` | Inspect Docker objects. |

## 6.2 Run a Container

```bash
docker run -d -p 3000:3000 --name my-app node:22
```

Explanation:

- `docker run`: Create and start a container.
- `-d`: Run in detached mode.
- `-p`: Publish a port.
- `3000:3000`: Host port 3000 maps to container port 3000.
- `--name`: Assign a container name.
- `node:22`: Image name and tag.

**Important:** Running the Node image alone does not automatically start your application. You must provide an application command or use an image with an appropriate default command.

## 6.3 Execute Commands Inside Containers

```bash
docker exec -it my-app bash
```

If Bash is unavailable:

```bash
docker exec -it my-app sh
```

## 6.4 Container Logs

```bash
docker logs my-app
```

Follow logs continuously:

```bash
docker logs -f my-app
```

View the latest 100 lines:

```bash
docker logs --tail 100 my-app
```

## 6.5 Remove Containers

```bash
docker stop my-app

docker rm my-app
```

Force removal:

```bash
docker rm -f my-app
```

---

# 7. Dockerfile

## 7.1 What is a Dockerfile?

A Dockerfile is a text file containing instructions to build a Docker image.

Example:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Explanation

| Instruction | Purpose |
|---|---|
| FROM | Defines the base image. |
| WORKDIR | Sets the working directory. |
| COPY | Copies files into the image. |
| RUN | Executes commands during image building. |
| EXPOSE | Documents the application's listening port. |
| ENV | Defines environment variables. |
| CMD | Defines the default container command. |
| ENTRYPOINT | Defines the main executable. |

## 7.2 RUN vs CMD vs ENTRYPOINT

These instructions have different purposes.

| Instruction | Execution Time | Purpose |
|---|---|---|
| RUN | Image build time | Execute build commands. |
| CMD | Container startup | Default command or arguments. |
| ENTRYPOINT | Container startup | Main executable. |

Example:

```dockerfile
FROM node:22

WORKDIR /app

RUN npm install -g typescript

CMD ["node", "--version"]
```

Here:

- `RUN` installs TypeScript while building the image.
- `CMD` executes when the container starts.

## 7.3 COPY vs ADD

| COPY | ADD |
|---|---|
| Copies files and directories. | Copies files and directories. |
| Simpler and predictable. | Supports additional features such as local archive extraction. |
| Preferred for normal copying. | Use only when its additional behavior is needed. |

Example:

```dockerfile
COPY package.json .
```

## 7.4 Build a Docker Image

Project structure:

```text
my-node-app/
│
├── package.json
├── package-lock.json
├── server.js
└── Dockerfile
```

Build:

```bash
docker build -t my-node-app .
```

Run:

```bash
docker run -d -p 3000:3000 my-node-app
```

Visit:

```text
http://localhost:3000
```

---

# 8. Dockerizing a TypeScript and Node.js Application

Let's create a practical TypeScript application.

## 8.1 Project Structure

```text
typescript-api/
│
├── src/
│   └── server.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── Dockerfile
└── .dockerignore
```

## 8.2 Install Dependencies

```bash
npm init -y

npm install express

npm install -D typescript @types/node @types/express
```

## 8.3 Configure TypeScript

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

For this example, configure the package as an ES module:

```json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts"
  }
}
```

Install the development runner:

```bash
npm install -D tsx
```

## 8.4 Create Express Server

`src/server.ts`

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TypeScript API is running!"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy"
  });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

The `0.0.0.0` host allows the application to listen on the container's network interfaces.

## 8.5 Production Dockerfile

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./

COPY src ./src

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### What is happening?

This Dockerfile uses two stages.

**Stage 1: Builder**

- Installs all dependencies.
- Copies TypeScript source code.
- Compiles TypeScript into JavaScript.

**Stage 2: Production**

- Starts from a clean Node.js image.
- Installs only production dependencies.
- Copies compiled JavaScript.
- Runs the application as a non-root user.

This reduces the production image size and avoids shipping unnecessary development dependencies and source files.

## 8.6 What is Multi-Stage Docker Build?

A multi-stage build uses multiple `FROM` instructions in one Dockerfile.

Example:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist
```

Advantages:

1. Smaller production images.
2. Separation of build and runtime dependencies.
3. Reduced attack surface.
4. Cleaner deployment artifacts.
5. Better production performance in image distribution and startup workflows.

## 8.7 What is `.dockerignore`?

`.dockerignore` prevents unnecessary files from being sent into the Docker build context.

Example:

```text
node_modules
dist
.git
.env
.env.*
npm-debug.log
coverage
Dockerfile*
README.md
```

**Important:** If you use `COPY package*.json ./`, make sure the required package files are not excluded.

Never include secrets in Docker build contexts unnecessarily.

---

# 9. Docker Networking

Docker networking allows containers to communicate with each other and external systems.



## 9.1 Types of Docker Networks

| Network | Description |
|---|---|
| Bridge | Default network for standalone containers. |
| Host | Uses the host network namespace. |
| None | Disables normal container networking. |
| Overlay | Connects containers across multiple Docker hosts, commonly with Swarm. |

## 9.2 Bridge Network

Create a custom bridge network:

```bash
docker network create app-network
```

Run a container:

```bash
docker run -d \
  --name api \
  --network app-network \
  node:22-alpine
```

Another container attached to the same custom network can generally reach it by its container name.

Example:

```text
Container A: api
       |
       |
   app-network
       |
       |
Container B: database
```

## 9.3 Port Mapping

```bash
docker run -d -p 8080:3000 my-node-app
```

Meaning:

```text
Host Port:      8080
Container Port: 3000
```

Access the application through:

```text
http://localhost:8080
```

## 9.4 Docker Volumes

Containers are designed to be replaceable. Their writable container layer is not appropriate for persistent application data.

Docker volumes provide persistent storage.

Create a volume:

```bash
docker volume create mysql-data
```

Use it:

```bash
docker run -d \
  --name mysql-db \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=example \
  mysql:8
```

This example is for learning only; use a securely managed secret instead of a hardcoded password in production.

### Volume vs Bind Mount

| Docker Volume | Bind Mount |
|---|---|
| Managed by Docker. | Uses a specified host path. |
| Good for persistent application data. | Good for development file sharing. |
| More portable across host directory layouts. | Depends on host filesystem structure. |

Example bind mount:

```bash
docker run -v ./src:/app/src node:22
```

---

# 10. Docker Compose

## 10.1 What is Docker Compose?

Docker Compose manages multi-container applications using a YAML configuration file.

Consider a typical application:

```text
Next.js Frontend
       |
       v
Node.js Backend
       |
       +------ MySQL
       |
       +------ Redis
```

Instead of starting each container manually, you can define the entire application in one file.

## 10.2 Example Docker Compose Configuration

`compose.yaml`

```yaml
services:

  api:
    build: .
    container_name: node-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - app-network

  mysql:
    image: mysql:8
    container_name: mysql-db
    environment:
      MYSQL_DATABASE: app_db
      MYSQL_USER: app_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  mysql-data:

networks:
  app-network:
    driver: bridge
```

Create a `.env` file:

```env
DB_PASSWORD=change-this-password
DB_ROOT_PASSWORD=change-this-root-password
```

Keep `.env` out of Git.

Also, for production, use a dedicated secrets manager rather than relying on a local `.env` file as your long-term secret-management solution.

## 10.3 Docker Compose Commands

Start services:

```bash
docker compose up
```

Run in background:

```bash
docker compose up -d
```

Rebuild images:

```bash
docker compose up --build
```

Stop services:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

List services:

```bash
docker compose ps
```

Remove containers and networks:

```bash
docker compose down
```

Remove containers, networks and named volumes:

```bash
docker compose down -v
```

**Warning:** `-v` deletes the Compose-managed named volumes. This can permanently delete your database data.

## 10.4 What is `depends_on`?

`depends_on` controls service startup order.

However, a dependency starting does not necessarily mean it is ready to accept connections.

For readiness, use a health check and a supported condition such as:

```yaml
depends_on:
  mysql:
    condition: service_healthy
```

Your application should also implement database reconnection and retry logic.

---

# 11. Container Security

Container security is essential for production applications.

## 11.1 Important Security Practices

| Practice | Purpose |
|---|---|
| Minimal base images | Reduce attack surface. |
| Non-root user | Reduce container privileges. |
| Image scanning | Identify vulnerable packages. |
| Secret management | Protect credentials. |
| Image signing | Verify image authenticity and integrity. |
| Dependency updates | Fix known vulnerabilities. |
| Read-only filesystem | Prevent unnecessary writes. |
| Resource limits | Prevent resource exhaustion. |

## 11.2 Never Run Production Containers as Root Without a Reason

Example:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY --chown=node:node . .

USER node

CMD ["node", "server.js"]
```

The container process runs as the `node` user.

## 11.3 Image Scanning

Tools include:

- Docker Scout.
- Trivy.
- Grype.

Example using Trivy:

```bash
trivy image my-node-app:latest
```

Image scanning can identify known vulnerabilities in operating-system packages and application dependencies.

---

# 12. Kubernetes Fundamentals

## 12.1 What is Kubernetes?

Kubernetes is an open-source container orchestration platform.

Docker can run containers on a machine.

Kubernetes manages containerized applications across a cluster of machines.

Kubernetes helps with:

- Container orchestration.
- Scaling.
- Service discovery.
- Load balancing.
- Self-healing.
- Rolling deployments.
- Configuration management.
- Storage orchestration.



## 12.2 Why Do We Need Kubernetes?

Imagine an application with:

- 3 frontend containers.
- 5 backend containers.
- 2 Redis containers.
- 1 database cluster.

Manually managing all these containers becomes difficult.

Kubernetes automates much of this management.

Example:

```text
              Kubernetes Cluster
                      |
          +-----------+-----------+
          |                       |
     Control Plane           Worker Nodes
                                  |
                     +------------+------------+
                     |            |            |
                   Pod 1        Pod 2        Pod 3
                     |            |            |
                   API          API          API
```

## 12.3 Kubernetes Architecture

Kubernetes architecture consists of two major parts:

1. Control Plane.
2. Worker Nodes.

### Control Plane Components

| Component | Responsibility |
|---|---|
| API Server | Entry point for Kubernetes API requests. |
| etcd | Stores cluster state and configuration. |
| Scheduler | Assigns Pods to suitable nodes. |
| Controller Manager | Runs controllers that reconcile desired state. |
| Cloud Controller Manager | Integrates with cloud infrastructure where applicable. |

### Worker Node Components

| Component | Responsibility |
|---|---|
| Kubelet | Ensures assigned Pods are running. |
| Kube-proxy | Implements Service networking rules where used. |
| Container Runtime | Runs containers. |

Examples of container runtimes include containerd and CRI-O.

## 12.4 Desired State

Kubernetes uses a declarative model.

You specify what you want:

```text
Desired State:
3 API replicas
```

Kubernetes continuously works toward that state.

If one Pod fails:

```text
Desired: 3 Pods
Actual: 2 Pods
```

The Deployment controller works to create another Pod.

This reconciliation process is a core Kubernetes concept.

---

# 13. Kubernetes Pods

## 13.1 What is a Pod?

A Pod is the smallest deployable unit in Kubernetes.

A Pod contains one or more containers that share:

- Network namespace.
- Pod IP address.
- Port space.
- Configured storage volumes.

Most application Pods contain one main application container.

Example:

```text
Pod
 |
 +---- Container 1: Node.js API
 |
 +---- Container 2: Sidecar
```

Sidecar containers can support logging, proxies or other auxiliary functions.

## 13.2 Create a Pod

`pod.yaml`

```yaml
apiVersion: v1
kind: Pod

metadata:
  name: node-api

spec:
  containers:
    - name: api
      image: node:22-alpine
      command: ["node", "-e"]
      args:
        - "require('http').createServer((req,res)=>res.end('Hello Kubernetes')).listen(3000,'0.0.0.0')"
      ports:
        - containerPort: 3000
```

Apply:

```bash
kubectl apply -f pod.yaml
```

Check Pods:

```bash
kubectl get pods
```

Get detailed information:

```bash
kubectl describe pod node-api
```

Delete:

```bash
kubectl delete pod node-api
```

**Note:** For production workloads, use Deployments rather than manually creating standalone Pods.

---

# 14. Kubernetes Deployments and ReplicaSets

## 14.1 What is a Deployment?

A Deployment manages a set of identical Pods and provides declarative updates.

Example:

```text
Deployment
    |
    v
ReplicaSet
    |
    +------ Pod 1
    |
    +------ Pod 2
    |
    +------ Pod 3
```

## 14.2 Deployment YAML

`deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: node-api

spec:
  replicas: 3

  selector:
    matchLabels:
      app: node-api

  template:
    metadata:
      labels:
        app: node-api

    spec:
      containers:
        - name: api
          image: my-node-api:1.0
          ports:
            - containerPort: 3000
```

Apply:

```bash
kubectl apply -f deployment.yaml
```

Check:

```bash
kubectl get deployments
```

Check Pods:

```bash
kubectl get pods
```

## 14.3 Scale a Deployment

```bash
kubectl scale deployment node-api --replicas=5
```

Now Kubernetes aims to maintain five replicas.

## 14.4 Rolling Updates

Update the image:

```bash
kubectl set image deployment/node-api api=my-node-api:2.0
```

Kubernetes gradually replaces old Pods with new Pods according to the rollout strategy.

Check rollout status:

```bash
kubectl rollout status deployment/node-api
```

Rollback:

```bash
kubectl rollout undo deployment/node-api
```

## 14.5 What is a ReplicaSet?

A ReplicaSet ensures that a specified number of matching Pods are running.

A Deployment manages ReplicaSets and provides additional functionality such as declarative updates and rollout history.

Normally, you manage Deployments rather than creating ReplicaSets directly.

---

# 15. Kubernetes Services

## 15.1 What is a Service?

Pods are replaceable. Their IP addresses may change when they are recreated.

A Kubernetes Service provides a stable network endpoint for a group of Pods.

Example:

```text
          API Service
               |
       +-------+-------+
       |       |       |
     Pod 1   Pod 2   Pod 3
```

## 15.2 Types of Services

| Service Type | Description |
|---|---|
| ClusterIP | Internal cluster access; default. |
| NodePort | Exposes a service through a port on each node. |
| LoadBalancer | Requests an external load balancer where supported. |
| ExternalName | Maps a service name to an external DNS name. |

## 15.3 ClusterIP Example

`service.yaml`

```yaml
apiVersion: v1
kind: Service

metadata:
  name: node-api-service

spec:
  type: ClusterIP

  selector:
    app: node-api

  ports:
    - port: 80
      targetPort: 3000
```

Explanation:

- `port`: Service port.
- `targetPort`: Container port.
- `selector`: Identifies matching Pods.

## 15.4 NodePort Example

```yaml
apiVersion: v1
kind: Service

metadata:
  name: node-api-nodeport

spec:
  type: NodePort

  selector:
    app: node-api

  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080
```

NodePort exposes the service through port `30080` on cluster nodes, subject to the cluster's network configuration.

## 15.5 LoadBalancer

```yaml
apiVersion: v1
kind: Service

metadata:
  name: node-api-lb

spec:
  type: LoadBalancer

  selector:
    app: node-api

  ports:
    - port: 80
      targetPort: 3000
```

In supported cloud environments, this can provision an external load balancer.

---

# 16. Kubernetes ConfigMaps and Secrets

## 16.1 What is a ConfigMap?

A ConfigMap stores non-sensitive configuration separately from the application image.

Example:

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: app-config

data:
  NODE_ENV: production
  PORT: "3000"
  LOG_LEVEL: info
```

Use it in a Deployment:

```yaml
envFrom:
  - configMapRef:
      name: app-config
```

## 16.2 What is a Secret?

A Secret stores sensitive configuration such as:

- Database credentials.
- API keys.
- Authentication tokens.
- TLS certificates.

Example:

```yaml
apiVersion: v1
kind: Secret

metadata:
  name: database-secret

type: Opaque

stringData:
  DB_USER: app_user
  DB_PASSWORD: example-password
```

Use it:

```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: database-secret
        key: DB_PASSWORD
```

**Important security considerations:**

- Base64 encoding is not encryption.
- Kubernetes Secrets are not automatically encrypted at rest in every cluster configuration.
- Configure encryption at rest.
- Apply strict RBAC permissions.
- Avoid committing Secret manifests containing real credentials to Git.
- Consider external secret managers such as AWS Secrets Manager.

---

# 17. Kubernetes Health Checks

Health checks help Kubernetes understand the state of an application.

There are three major probe types.

## 17.1 Liveness Probe

Determines whether the application is still functioning.

If the liveness probe repeatedly fails, Kubernetes may restart the container.

## 17.2 Readiness Probe

Determines whether the application is ready to receive traffic.

If readiness fails, the Pod is removed from the eligible Service endpoints until it becomes ready again.

## 17.3 Startup Probe

Allows an application extra time to start.

It is particularly useful for applications with slow startup processes.

### Comparison

| Probe | Main Purpose | Failure Behavior |
|---|---|---|
| Liveness | Is the application alive? | May restart container. |
| Readiness | Can it receive traffic? | Stops routing traffic to Pod. |
| Startup | Has startup completed? | Can trigger restart after configured failures. |

## 17.4 Example

```yaml
containers:
  - name: api

    image: my-node-api:1.0

    ports:
      - containerPort: 3000

    startupProbe:
      httpGet:
        path: /health
        port: 3000
      periodSeconds: 5
      failureThreshold: 30

    livenessProbe:
      httpGet:
        path: /health
        port: 3000
      periodSeconds: 10

    readinessProbe:
      httpGet:
        path: /ready
        port: 3000
      periodSeconds: 5
```

A good application should expose meaningful health endpoints.

For example:

```typescript
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/ready", async (req, res) => {
  const databaseReady = true; // Replace with an actual dependency check.

  if (!databaseReady) {
    return res.status(503).json({
      status: "not ready"
    });
  }

  res.status(200).json({
    status: "ready"
  });
});
```

---

# 18. Kubernetes Resource Requests and Limits

Containers consume CPU and memory.

Kubernetes allows you to define resource requests and limits.

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"

  limits:
    cpu: "500m"
    memory: "512Mi"
```

### Requests

The resources Kubernetes uses when scheduling the Pod.

### Limits

The maximum resource usage allowed for the container.

| Resource | Behavior |
|---|---|
| CPU | Can be throttled when the limit is reached. |
| Memory | Excessive usage can result in an OOM kill. |

Example:

```text
CPU Request: 250m
CPU Limit:   500m

Memory Request: 256Mi
Memory Limit:   512Mi
```

`250m` CPU means 0.25 CPU core.

---

# 19. Kubernetes Storage

Kubernetes provides abstractions for persistent storage.

## 19.1 PersistentVolume (PV)

A PersistentVolume represents a storage resource available to the cluster.

## 19.2 PersistentVolumeClaim (PVC)

A PersistentVolumeClaim is a request for storage by an application.

## 19.3 StorageClass

A StorageClass defines how storage can be dynamically provisioned.

Relationship:

```text
Application Pod
      |
      v
PVC
      |
      v
StorageClass
      |
      v
PersistentVolume
      |
      v
Actual Storage
```

Example PVC:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim

metadata:
  name: app-storage

spec:
  accessModes:
    - ReadWriteOnce

  resources:
    requests:
      storage: 5Gi
```

Mount it:

```yaml
volumeMounts:
  - name: storage
    mountPath: /app/uploads

volumes:
  - name: storage
    persistentVolumeClaim:
      claimName: app-storage
```

---

# 20. Kubernetes Autoscaling

## 20.1 What is Autoscaling?

Autoscaling automatically adjusts the number of application instances based on workload or configured metrics.

Example:

```text
Normal Traffic
     |
     v
3 Pods
     |
High Traffic
     |
     v
8 Pods
     |
Traffic Decreases
     |
     v
3 Pods
```

## 20.2 Horizontal Pod Autoscaler (HPA)

HPA automatically changes the number of Pod replicas.

Example:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler

metadata:
  name: node-api-hpa

spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: node-api

  minReplicas: 2
  maxReplicas: 10

  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

This example targets average CPU utilization of 70% of the Pods' CPU requests.

HPA requires an appropriate metrics source, commonly Metrics Server for basic CPU and memory metrics.

## 20.3 Types of Kubernetes Autoscaling

| Autoscaler | Responsibility |
|---|---|
| HPA | Scales the number of Pods. |
| VPA | Adjusts Pod resource requests and recommendations. |
| Cluster Autoscaler | Adjusts the number of cluster nodes. |

---

# 21. Kubernetes Networking and Ingress

## 21.1 Kubernetes Networking

Kubernetes networking allows:

- Pod-to-Pod communication.
- Pod-to-Service communication.
- External-to-Service communication.
- Communication between nodes.

A typical networking architecture:

```text
             Internet
                |
                v
          Load Balancer
                |
                v
             Ingress
                |
        +-------+-------+
        |               |
     Frontend         Backend
      Service         Service
        |               |
      Pods             Pods
```

## 21.2 What is Ingress?

Ingress defines HTTP and HTTPS routing rules for external access to services inside a Kubernetes cluster.

Example:

```text
example.com/
      |
      v
Frontend Service

example.com/api
      |
      v
Backend Service
```

Ingress resource:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress

metadata:
  name: app-ingress

spec:
  rules:
    - host: example.com

      http:
        paths:
          - path: /
            pathType: Prefix

            backend:
              service:
                name: frontend-service
                port:
                  number: 80

          - path: /api
            pathType: Prefix

            backend:
              service:
                name: backend-service
                port:
                  number: 80
```

**Important:** An Ingress resource defines routing rules. You also need an Ingress Controller to implement those rules.

Examples include NGINX Ingress Controller and cloud-specific ingress controllers.

---

# 22. Helm

## 22.1 What is Helm?

Helm is a package manager for Kubernetes.

It helps manage Kubernetes applications using reusable charts.

Without Helm:

```text
deployment.yaml
service.yaml
configmap.yaml
ingress.yaml
secret.yaml
```

You manually manage multiple Kubernetes manifests.

With Helm:

```text
my-application/
    |
    +---- Chart.yaml
    |
    +---- values.yaml
    |
    +---- templates/
              |
              +---- deployment.yaml
              |
              +---- service.yaml
              |
              +---- ingress.yaml
```

## 22.2 Helm Commands

Create a chart:

```bash
helm create my-app
```

Install:

```bash
helm install my-app ./my-app
```

List releases:

```bash
helm list
```

Upgrade:

```bash
helm upgrade my-app ./my-app
```

Rollback:

```bash
helm rollback my-app 1
```

Uninstall:

```bash
helm uninstall my-app
```

Helm is particularly useful when deploying applications across development, staging and production environments with different configurations.

---

# 23. CI/CD Architecture

## 23.1 What is CI?

Continuous Integration means developers frequently integrate code changes into a shared repository.

Automated processes validate those changes.

Typical CI pipeline:

```text
Code Push
    |
    v
Install Dependencies
    |
    v
Lint
    |
    v
Type Checking
    |
    v
Unit Tests
    |
    v
Integration Tests
    |
    v
Build
    |
    v
Security Scan
    |
    v
CI Success
```

## 23.2 What is Continuous Delivery?

Continuous Delivery means the application is kept in a deployable state.

A production release may still require manual approval.

## 23.3 What is Continuous Deployment?

Continuous Deployment automatically deploys qualifying changes to production after the required checks pass.

### Comparison

| CI | Continuous Delivery | Continuous Deployment |
|---|---|---|
| Integrates and validates changes. | Keeps software ready for release. | Automatically releases qualifying changes. |
| Automated tests. | Automated delivery pipeline. | Automated production deployment. |
| Does not necessarily deploy. | May require approval. | Production deployment is automated. |

---

# 24. GitHub Actions

## 24.1 What is GitHub Actions?

GitHub Actions is an automation and CI/CD platform integrated with GitHub repositories.

It can automatically execute workflows when events occur.

Examples:

- Push.
- Pull request.
- Release.
- Scheduled execution.
- Manual workflow dispatch.

## 24.2 GitHub Actions Architecture

```text
GitHub Repository
       |
       v
Git Event
       |
       v
Workflow
       |
       v
Job
       |
       v
Runner
       |
       v
Steps
       |
       v
Build / Test / Deploy
```

## 24.3 Important Components

| Component | Description |
|---|---|
| Workflow | Automation definition. |
| Event | Trigger for a workflow. |
| Job | Collection of steps. |
| Runner | Machine executing jobs. |
| Step | Individual operation. |
| Action | Reusable automation component. |
| Artifact | File produced by a workflow. |
| Secret | Protected configuration value. |

## 24.4 Create a GitHub Actions Workflow

Create:

```text
.github/workflows/ci.yml
```

Example:

```yaml
name: Node.js CI

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

jobs:
  test:

    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
```

### Explanation

1. Workflow runs when code is pushed to main or a pull request targets main.
2. GitHub checks out the repository.
3. Node.js is installed.
4. Dependencies are installed.
5. TypeScript type checking runs.
6. Tests execute.
7. Application builds.

## 24.5 GitHub Actions Secrets

Never hardcode sensitive credentials inside workflow files.

Instead, configure repository or environment secrets.

Example:

```yaml
- name: Deploy application
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
  run: npm run deploy
```

For AWS deployments, prefer OIDC-based authentication with a narrowly scoped IAM role instead of storing long-lived AWS access keys.

## 24.6 GitHub Actions Matrix Builds

A matrix lets a workflow test multiple versions or environments.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20, 22, 24]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci

      - run: npm test
```

This runs the job against multiple Node.js versions.

## 24.7 GitHub Actions Artifacts

Artifacts allow you to save and share workflow outputs.

Examples:

- Test reports.
- Build output.
- Coverage reports.
- Deployment packages.

---

# 25. Jenkins and GitLab CI/CD

## 25.1 What is Jenkins?

Jenkins is an open-source automation server widely used for CI/CD.

It supports:

- Pipeline automation.
- Build automation.
- Test execution.
- Deployment automation.
- Plugin-based integrations.

Example Jenkins pipeline:

`Jenkinsfile`

```groovy
pipeline {
    agent any

    stages {

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }
}
```

## 25.2 What is GitLab CI/CD?

GitLab CI/CD is GitLab's built-in automation system.

It uses a `.gitlab-ci.yml` configuration file.

Example:

```yaml
stages:
  - install
  - test
  - build

install:
  stage: install
  script:
    - npm ci

test:
  stage: test
  script:
    - npm test

build:
  stage: build
  script:
    - npm run build
```

### Comparison

| Tool | Main Advantage |
|---|---|
| GitHub Actions | Integrated with GitHub repositories. |
| Jenkins | Highly customizable automation server. |
| GitLab CI/CD | Integrated CI/CD within GitLab. |

---

# 26. Infrastructure as Code (IaC)

## 26.1 Declarative vs Imperative

### Imperative Approach

You describe how to perform an operation.

Example:

```text
1. Create EC2 instance.
2. Install Node.js.
3. Install application dependencies.
4. Configure Nginx.
5. Start application.
```

### Declarative Approach

You describe the desired final state.

Example:

```text
Desired State:
- One EC2 instance.
- Ubuntu operating system.
- Security group configured.
- Application server running.
```

The IaC tool determines the required actions to reach that state.

| Imperative | Declarative |
|---|---|
| Describes how to do something. | Describes what the desired state should be. |
| Focuses on execution steps. | Focuses on the resulting configuration. |
| Often requires more procedural instructions. | Tool determines required changes. |

---

# 27. Terraform

## 27.1 What is Terraform?

Terraform is an Infrastructure as Code tool used to provision and manage infrastructure through configuration files.

It supports many providers, including:

- AWS.
- Azure.
- Google Cloud.
- Kubernetes.
- GitHub.
- Cloudflare.

Official documentation:

[Terraform Documentation](https://developer.hashicorp.com/terraform/docs?utm_source=chatgpt.com)

## 27.2 Terraform Workflow

```text
Terraform Configuration
          |
          v
terraform init
          |
          v
terraform validate
          |
          v
terraform plan
          |
          v
terraform apply
          |
          v
Infrastructure Created
```

## 27.3 Important Terraform Concepts

| Concept | Description |
|---|---|
| Provider | Integrates Terraform with a platform. |
| Resource | Infrastructure object to manage. |
| Data Source | Reads existing infrastructure information. |
| Variable | Input value. |
| Output | Exposes useful values. |
| State | Tracks managed infrastructure information. |
| Module | Reusable Terraform configuration. |
| Backend | Defines where Terraform state is stored. |

## 27.4 Example Terraform AWS Configuration

Create:

```text
main.tf
```

Example:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "web_server" {

  ami           = var.ami_id
  instance_type = "t3.micro"

  tags = {
    Name = "My-Terraform-Server"
  }
}

variable "ami_id" {
  description = "AMI ID for the selected AWS region"
  type        = string
}

output "instance_id" {
  value = aws_instance.web_server.id
}
```

This is a basic learning example. A production deployment also needs appropriate networking, security groups, IAM configuration, monitoring and other controls.

## 27.5 Terraform Commands

Initialize:

```bash
terraform init
```

Format:

```bash
terraform fmt
```

Validate:

```bash
terraform validate
```

Preview changes:

```bash
terraform plan
```

Apply changes:

```bash
terraform apply
```

Destroy managed resources:

```bash
terraform destroy
```

**Warning:** `terraform destroy` can delete real cloud infrastructure. Always review the plan and target environment before executing destructive operations.

## 27.6 What is Terraform State?

Terraform state tracks the relationship between Terraform configuration and actual infrastructure.

Example:

```text
Terraform Configuration
         |
         v
Terraform State
         |
         v
Actual AWS Infrastructure
```

State is important because Terraform uses it to understand which resources it manages.

### State Management Best Practices

- Never commit sensitive state files to public repositories.
- Use secure remote state storage.
- Enable state locking where supported by the backend.
- Restrict access to state.
- Encrypt state at rest.
- Avoid concurrent modifications.
- Back up important state.

For AWS, an S3 backend with appropriate locking support is a common choice.

---

# 28. Ansible

## 28.1 What is Ansible?

Ansible is an automation and configuration management tool.

It can automate:

- Software installation.
- Server configuration.
- User management.
- Application deployment.
- Service management.
- System updates.

Unlike Terraform, which primarily provisions infrastructure, Ansible is commonly used to configure existing systems.

## 28.2 Terraform vs Ansible

| Terraform | Ansible |
|---|---|
| Infrastructure provisioning. | Configuration management and automation. |
| Declarative infrastructure definitions. | Playbooks describe automation tasks. |
| Tracks infrastructure using state. | Does not use Terraform-style infrastructure state. |
| Creates and manages cloud resources. | Configures systems and applications. |

They can be used together.

```text
Terraform
    |
    v
Create EC2 Infrastructure
    |
    v
Ansible
    |
    v
Configure EC2 Server
    |
    v
Deploy Application
```

## 28.3 Ansible Playbook Example

`setup.yml`

```yaml
---
- name: Configure application server

  hosts: webservers

  become: true

  tasks:

    - name: Update package cache
      apt:
        update_cache: true

    - name: Install Nginx
      apt:
        name: nginx
        state: present

    - name: Start Nginx
      service:
        name: nginx
        state: started
        enabled: true
```

Run:

```bash
ansible-playbook -i inventory setup.yml
```

Ansible commonly connects to Linux servers over SSH and uses a push-based execution model.

## 28.4 What is Idempotency?

Idempotency means executing an operation repeatedly should produce the same desired final state without causing unnecessary changes.

Example:

```yaml
- name: Ensure Nginx is installed
  apt:
    name: nginx
    state: present
```

Running this task repeatedly should not reinstall Nginx unnecessarily if it is already installed.

---

# 29. AWS Cloud Architecture Fundamentals

## 29.1 What is AWS?

Amazon Web Services (AWS) is a cloud computing platform that provides infrastructure and managed services.

Common services:

| Service | Purpose |
|---|---|
| EC2 | Virtual servers. |
| S3 | Object storage. |
| RDS | Managed relational databases. |
| VPC | Virtual private networking. |
| IAM | Identity and access management. |
| Route 53 | DNS management. |
| CloudFront | Content delivery network. |
| Lambda | Serverless compute. |
| API Gateway | API management. |
| CloudWatch | Monitoring and logging. |
| ECS | Container orchestration. |
| EKS | Managed Kubernetes. |

Official AWS resources:

- [AWS Documentation](https://docs.aws.amazon.com/?utm_source=chatgpt.com)
- [AWS Management Console](https://console.aws.amazon.com/?utm_source=chatgpt.com)

## 29.2 AWS Global Infrastructure

AWS infrastructure is organized into:

### Regions

A Region is a separate geographical area containing AWS infrastructure.

Example:

```text
Asia Pacific
    |
    +---- Mumbai
    |
    +---- Singapore
    |
    +---- Tokyo
```

### Availability Zones

An Availability Zone (AZ) consists of one or more isolated data centers within an AWS Region.

Using multiple Availability Zones can improve availability.

### Edge Locations

Edge locations support services such as CloudFront to deliver content closer to users.

---

# 30. AWS IAM

## 30.1 What is IAM?

IAM stands for Identity and Access Management.

It controls who can access AWS resources and what actions they can perform.

Important concepts:

| Concept | Description |
|---|---|
| User | Identity generally associated with a person or application. |
| Group | Collection of IAM users. |
| Role | Identity assumed to obtain temporary permissions. |
| Policy | Defines allowed or denied actions. |
| Permission | An authorized operation on a resource. |

## 30.2 IAM Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::my-app-bucket/*"
    }
  ]
}
```

This policy allows reading objects from the specified S3 bucket.

## 30.3 Principle of Least Privilege

Give an identity only the permissions it needs.

Avoid:

```text
AdministratorAccess for every application.
```

Prefer:

```text
Only required permissions
for specific resources
and specific operations.
```

For applications running on AWS, prefer IAM roles and temporary credentials over hardcoded access keys.

---

# 31. AWS VPC

## 31.1 What is VPC?

A Virtual Private Cloud (VPC) is a logically isolated network within AWS.

It allows you to define:

- IP address ranges.
- Subnets.
- Route tables.
- Internet connectivity.
- Security boundaries.



## 31.2 VPC Components

| Component | Description |
|---|---|
| VPC | Isolated virtual network. |
| Subnet | Subdivision of a VPC IP range. |
| Route Table | Controls network traffic routing. |
| Internet Gateway | Enables internet connectivity for eligible VPC resources. |
| NAT Gateway | Enables outbound IPv4 connectivity from private subnets. |
| Security Group | Stateful network firewall for resources. |
| Network ACL | Stateless subnet-level network access control. |

## 31.3 Public vs Private Subnets

### Public Subnet

A subnet is generally considered public when its route table provides a route to an Internet Gateway.

Example:

```text
Internet
   |
   v
Internet Gateway
   |
   v
Public Subnet
   |
   v
Application Load Balancer
```

### Private Subnet

A private subnet does not have a direct route to an Internet Gateway.

It can use a NAT Gateway for outbound IPv4 internet access.

```text
Private Subnet
      |
      v
  NAT Gateway
      |
      v
Internet Gateway
      |
      v
   Internet
```

**Important:** A subnet is not public merely because its name contains the word "public." Its routing configuration determines its connectivity.

## 31.4 Security Groups vs Network ACLs

| Security Group | Network ACL |
|---|---|
| Stateful. | Stateless. |
| Associated with network interfaces/resources. | Associated with subnets. |
| Allows rules only. | Supports allow and deny rules. |
| Return traffic is automatically allowed for permitted connections. | Return traffic must be explicitly permitted. |

---

# 32. AWS EC2

## 32.1 What is EC2?

Amazon Elastic Compute Cloud (EC2) provides virtual servers in the AWS cloud.

You can use EC2 to run:

- Node.js applications.
- React/Next.js applications.
- Express APIs.
- Background workers.
- Nginx.
- Docker containers.
- Other server workloads.

## 32.2 EC2 Instance Types

Different instance families are optimized for different workloads.

| Family | Main Purpose |
|---|---|
| General Purpose | Balanced CPU, memory and networking. |
| Compute Optimized | CPU-intensive workloads. |
| Memory Optimized | Memory-intensive applications. |
| Storage Optimized | High storage throughput and IOPS. |
| Accelerated Computing | GPU and specialized hardware workloads. |

## 32.3 Basic EC2 Deployment Architecture

```text
Internet
   |
   v
Security Group
   |
   v
EC2 Instance
   |
   +---- Nginx
   |
   +---- Node.js API
   |
   +---- PM2
```

A production architecture often places an Application Load Balancer in front of multiple EC2 instances instead of exposing a single application server directly.

## 32.4 Connect to EC2 Using SSH

```bash
ssh -i my-key.pem ubuntu@EC2_PUBLIC_IP
```

On the server:

```bash
sudo apt update

sudo apt install nginx -y
```

Install a supported Node.js version using an appropriate installation method.

Deploy your application and configure a process manager or container runtime.

---

# 33. AWS S3

## 33.1 What is S3?

Amazon Simple Storage Service (S3) is an object storage service.

It stores objects inside buckets.

Examples:

- Images.
- Videos.
- PDFs.
- Backups.
- Application uploads.
- Static website assets.
- Logs.

## 33.2 S3 Architecture

```text
Node.js Application
       |
       v
AWS SDK
       |
       v
S3 Bucket
       |
       +---- image1.png
       |
       +---- document.pdf
       |
       +---- video.mp4
```

## 33.3 S3 Features

| Feature | Purpose |
|---|---|
| Versioning | Maintain multiple object versions. |
| Lifecycle Rules | Automatically transition or expire objects. |
| Encryption | Protect stored data. |
| Bucket Policies | Control bucket access. |
| Replication | Copy objects to another bucket. |
| Storage Classes | Optimize storage costs. |

## 33.4 S3 vs Database

| S3 | Database |
|---|---|
| Stores objects and files. | Stores structured or semi-structured records. |
| Suitable for media and backups. | Suitable for querying application data. |
| Object-oriented storage. | Query-oriented data storage. |

S3 is not a traditional relational database or a mounted filesystem by default.

---

# 34. AWS RDS

## 34.1 What is RDS?

Amazon Relational Database Service is a managed relational database service.

It supports engines such as:

- MySQL.
- PostgreSQL.
- MariaDB.
- Oracle.
- SQL Server.

## 34.2 Why Use RDS?

AWS manages many operational tasks, including:

- Automated backups.
- Database patching options.
- Monitoring.
- Infrastructure provisioning.
- High-availability options.

## 34.3 Multi-AZ vs Read Replica

| Multi-AZ | Read Replica |
|---|---|
| Primarily improves availability and failover. | Primarily improves read scalability. |
| Provides standby infrastructure. | Provides a replicated database endpoint. |
| Commonly used for production availability. | Useful for read-heavy workloads. |
| Does not simply act as a normal read-scaling endpoint. | Replication may be asynchronous. |

These are different capabilities and should not be treated as interchangeable.

---

# 35. AWS Load Balancing and Auto Scaling

## 35.1 What is Load Balancing?

Load balancing distributes incoming traffic across multiple application instances.

Example:

```text
             Internet
                 |
                 v
          Load Balancer
                 |
        +--------+--------+
        |        |        |
       EC2      EC2      EC2
        1        2        3
```

AWS offers different load balancer types.

| Type | Main Use |
|---|---|
| Application Load Balancer | HTTP/HTTPS and Layer 7 routing. |
| Network Load Balancer | High-performance Layer 4 traffic. |
| Gateway Load Balancer | Deploying and scaling network appliances. |

## 35.2 What is Auto Scaling?

Auto Scaling automatically adjusts the number of EC2 instances based on configured conditions.

Example:

```text
Low Traffic
    |
    v
2 Instances

High Traffic
    |
    v
5 Instances

Traffic Decreases
    |
    v
2 Instances
```

Benefits:

- Better availability.
- Improved capacity management.
- Automatic scaling.
- Potential cost savings.

---

# 36. AWS Route 53 and CloudFront

## 36.1 What is Route 53?

Amazon Route 53 is a DNS and domain routing service.

It translates domain names into the appropriate network destinations.

Example:

```text
example.com
      |
      v
Route 53
      |
      v
Application Load Balancer
      |
      v
Application
```

## 36.2 What is CloudFront?

Amazon CloudFront is a Content Delivery Network (CDN).

It caches and delivers content from edge locations closer to users.

Example:

```text
User in India
      |
      v
CloudFront Edge Location
      |
      v
Cached Website Assets
```

If content is not cached or requires origin access, CloudFront retrieves it from the configured origin.

### Route 53 vs CloudFront

| Route 53 | CloudFront |
|---|---|
| DNS service. | CDN service. |
| Routes domain requests. | Distributes and caches content. |
| Maps domain names to destinations. | Improves content delivery performance. |

---

# 37. Serverless Architecture

## 37.1 What is Serverless?

Serverless is a cloud computing model in which the cloud provider manages much of the underlying server infrastructure.

Developers focus on application logic.

Serverless does not mean servers do not exist.

It means server provisioning and management are largely abstracted away.

## 37.2 AWS Lambda

AWS Lambda runs code in response to events.

Examples:

- Processing uploaded files.
- Sending notifications.
- Handling API requests.
- Processing queue messages.
- Running scheduled tasks.

Example:

```typescript
export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Lambda"
    })
  };
};
```

## 37.3 API Gateway

API Gateway exposes and manages APIs that can invoke Lambda functions or integrate with other backends.

```text
Client
  |
  v
API Gateway
  |
  v
AWS Lambda
  |
  v
Database / Other Services
```

## 37.4 Serverless Advantages

- No need to manage traditional application servers.
- Automatic scaling within service limits.
- Event-driven architecture.
- Pay-per-use pricing models.
- Integration with other cloud services.

## 37.5 Serverless Challenges

- Cold starts.
- Execution time limits.
- Concurrency limits.
- Distributed tracing complexity.
- Vendor-specific integrations.
- Database connection management.
- Retry and duplicate event handling.

Design Lambda functions to be idempotent when retries or duplicate events are possible.

---

# 38. Monitoring and Observability

## 38.1 What is Monitoring?

Monitoring tracks the health and performance of applications and infrastructure.

Examples:

- CPU utilization.
- Memory consumption.
- API response time.
- Error rate.
- Request throughput.
- Database connections.
- Disk usage.

## 38.2 What is Observability?

Observability is the ability to understand the internal state of a system using its external outputs.

The three main pillars are:

1. Metrics.
2. Logs.
3. Traces.



### Metrics

Numerical measurements over time.

Examples:

```text
CPU Usage: 65%

Memory Usage: 70%

HTTP Error Rate: 2%

Average API Response Time: 250ms
```

### Logs

Records of events generated by applications and infrastructure.

Example:

```text
2026-11-25 10:30:00 INFO User logged in

2026-11-25 10:31:00 ERROR Database connection failed
```

### Traces

Traces follow a request across multiple services.

Example:

```text
Client Request
     |
     v
API Gateway
     |
     v
Node.js API
     |
     v
Payment Service
     |
     v
Database
```

Tracing helps identify which component contributes to latency or failure.

---

# 39. Prometheus and Grafana

## 39.1 What is Prometheus?

Prometheus is an open-source monitoring and alerting toolkit.

It collects and stores metrics, commonly using a pull-based scraping model.

It is widely used for Kubernetes and application monitoring.

## 39.2 What is Grafana?

Grafana is a visualization and observability platform.

It can display metrics from Prometheus and other data sources.



## 39.3 Prometheus Architecture

```text
Node.js Application
       |
       v
Metrics Endpoint
       |
       v
Prometheus
       |
       v
Grafana
       |
       v
Dashboard
```

## 39.4 Example Prometheus Configuration

`prometheus.yml`

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: node-api

    static_configs:
      - targets:
          - node-api:3000
```

The target must expose a Prometheus-compatible metrics endpoint.

## 39.5 Grafana Use Cases

- API performance dashboards.
- Infrastructure monitoring.
- Kubernetes cluster monitoring.
- Database monitoring.
- Error-rate visualization.
- Alert dashboards.

---

# 40. Centralized Logging and ELK Stack

## 40.1 What is Centralized Logging?

In distributed applications, logs are generated by multiple services.

Instead of checking each server independently, centralized logging collects logs in one system.

Example:

```text
Frontend Logs
      |
Backend Logs
      |
Database Logs
      |
Worker Logs
      |
      v
Centralized Logging
      |
      v
Search and Analysis
```

## 40.2 What is ELK Stack?

ELK stands for:

- Elasticsearch.
- Logstash.
- Kibana.

### Elasticsearch

Stores and searches indexed data.

### Logstash

Collects, processes and transforms data.

### Kibana

Provides dashboards and visualization.

A commonly used architecture:

```text
Applications
     |
     v
Log Collection
     |
     v
Logstash / Beats
     |
     v
Elasticsearch
     |
     v
Kibana
```

The Elastic ecosystem also includes additional components and alternative ingestion approaches.

---

# 41. OpenTelemetry

## 41.1 What is OpenTelemetry?

OpenTelemetry is an open-source observability framework for generating, collecting and exporting telemetry data.

It supports:

- Metrics.
- Logs.
- Distributed traces.

It helps standardize instrumentation across applications.

## 41.2 Why Use OpenTelemetry?

Imagine a request passing through:

```text
Next.js Frontend
       |
       v
Node.js API
       |
       v
Payment Service
       |
       v
MySQL Database
```

Without distributed tracing, identifying the slow component can be difficult.

OpenTelemetry helps connect these operations through trace context.

## 41.3 Important OpenTelemetry Concepts

| Concept | Description |
|---|---|
| Instrumentation | Adds telemetry collection to applications. |
| Trace | Represents an end-to-end request journey. |
| Span | Represents one operation within a trace. |
| Context Propagation | Carries trace information between services. |
| Collector | Receives, processes and exports telemetry. |
| Exporter | Sends telemetry to an observability backend. |

---

# 42. AWS CloudWatch

## 42.1 What is CloudWatch?

Amazon CloudWatch is AWS's monitoring and observability service.

It provides:

- Metrics.
- Logs.
- Dashboards.
- Alarms.
- Events and automation integrations.

Example architecture:

```text
EC2
 |
 +---- CPU Metrics
 |
 +---- Memory Metrics
 |
 +---- Application Logs
          |
          v
      CloudWatch
          |
          v
       Dashboard
          |
          v
        Alarm
          |
          v
      Notification
```

## 42.2 Common Monitoring Metrics

| Metric | Purpose |
|---|---|
| CPU Utilization | CPU usage. |
| Memory Utilization | Memory consumption. |
| Disk Usage | Storage consumption. |
| Request Count | Traffic volume. |
| Error Rate | Application failures. |
| Latency | Response time. |
| Database Connections | Connection utilization. |

Note that memory and filesystem metrics on EC2 generally require an appropriate monitoring agent or custom metric collection.

---

# 43. SRE Fundamentals

## 43.1 What is Site Reliability Engineering?

Site Reliability Engineering (SRE) applies software engineering principles to infrastructure and operations.

Its objective is to build reliable, scalable and maintainable systems.

## 43.2 Service Level Indicators (SLI)

An SLI is a measurable indicator of service performance.

Examples:

- Availability.
- Latency.
- Error rate.
- Successful request percentage.

## 43.3 Service Level Objectives (SLO)

An SLO is a target for an SLI.

Example:

```text
Availability SLO: 99.9%
```

## 43.4 Service Level Agreements (SLA)

An SLA is a formal agreement describing service expectations and potentially consequences if they are not met.

### Comparison

| Term | Meaning |
|---|---|
| SLI | What you measure. |
| SLO | What target you aim to achieve. |
| SLA | What you formally promise or agree to. |

## 43.5 Error Budget

An error budget represents the amount of unreliability permitted by an SLO over a defined period.

For example, a 99.9% availability SLO allows approximately 0.1% unavailability during that period.

Error budgets help teams balance reliability improvements with release velocity.

---

# 44. Production Deployment Strategies

Different deployment strategies reduce deployment risk and downtime.

## 44.1 Rolling Deployment

A rolling deployment gradually replaces old application instances with new ones.

```text
Old Version:  V1 V1 V1 V1

Step 1:       V2 V1 V1 V1

Step 2:       V2 V2 V1 V1

Step 3:       V2 V2 V2 V1

Final:        V2 V2 V2 V2
```

Advantages:

- Gradual replacement.
- No need for two complete environments.
- Supported directly by Kubernetes Deployments.

Challenges:

- Old and new versions may run simultaneously.
- Database changes must remain backward-compatible during rollout.

## 44.2 Blue-Green Deployment

Blue-Green deployment uses two separate environments.

```text
Blue Environment
     V1
      |
      |
Production Traffic
      |
      |
Green Environment
     V2
```

The new environment is prepared and validated before traffic is switched.

Advantages:

- Fast traffic switching.
- Easier rollback.
- Separate environments.

Disadvantages:

- Requires additional infrastructure.
- Database compatibility still matters.
- Stateful workloads require careful handling.

## 44.3 Canary Deployment

A canary deployment gradually sends a small portion of traffic to a new version.

Example:

```text
Version 1: 90% Traffic

Version 2: 10% Traffic
```

If the new version performs well:

```text
Version 1: 50%

Version 2: 50%
```

Eventually:

```text
Version 1: 0%

Version 2: 100%
```

Advantages:

- Reduces deployment risk.
- Allows real-world validation.
- Enables gradual rollout.

## 44.4 Deployment Strategy Comparison

| Strategy | Deployment Approach | Main Benefit |
|---|---|---|
| Rolling | Replace instances gradually. | Resource-efficient rollout. |
| Blue-Green | Switch between two environments. | Fast rollback and switching. |
| Canary | Gradually increase new-version traffic. | Risk reduction through controlled exposure. |

---

# 45. Zero-Downtime Deployment

## 45.1 What is Zero-Downtime Deployment?

Zero-downtime deployment aims to release new application versions without interrupting service availability.

Important requirements:

1. Multiple application instances or equivalent redundancy.
2. Health and readiness checks.
3. Graceful shutdown.
4. Backward-compatible changes.
5. Load balancing.
6. Safe database migrations.
7. Rollback strategy.

## 45.2 Graceful Shutdown in Node.js

When an application receives a termination signal, it should stop accepting new requests and allow existing requests to finish.

Example:

```typescript
import express from "express";

const app = express();

const server = app.listen(3000, () => {
  console.log("Server started");
});

function shutdown(signal: string) {
  console.log(`${signal} received`);

  server.close(async (error) => {
    if (error) {
      console.error("Shutdown error:", error);
      process.exitCode = 1;
      return;
    }

    // Close database and other connections here.

    console.log("Server shut down gracefully");
    process.exitCode = 0;
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));
```

Production implementations should also handle repeated signals, connection draining and cleanup failures appropriately.

## 45.3 Database Migration Strategy

Suppose you want to rename a database column:

```text
old_column → new_column
```

Renaming it immediately could break the currently deployed application.

A safer expand-and-contract approach:

**Step 1: Expand**

Add the new column while keeping the old column.

**Step 2: Transition**

Update the application to support both columns and migrate data.

**Step 3: Switch**

Move all application reads and writes to the new column.

**Step 4: Contract**

Remove the old column after confirming it is no longer needed.

This approach helps maintain compatibility between old and new application versions.

---

# 46. Production Security Engineering

Security must be included in the deployment lifecycle.

## 46.1 Application Security

Important practices:

- Validate user input.
- Use secure authentication.
- Apply authorization checks.
- Protect API endpoints.
- Prevent SQL injection.
- Prevent XSS and CSRF where applicable.
- Use secure HTTP headers.
- Keep dependencies updated.

## 46.2 Infrastructure Security

Important practices:

- Use least-privilege IAM policies.
- Restrict public network exposure.
- Use private subnets for internal resources.
- Encrypt sensitive data.
- Rotate credentials.
- Enable audit logging.
- Patch operating systems.
- Scan container images.

## 46.3 Secrets Management

Examples of secrets:

```text
DATABASE_URL
JWT_SECRET
AWS credentials
PAYMENT_API_KEY
SMTP_PASSWORD
```

Avoid storing production secrets in:

- Git repositories.
- Docker images.
- Frontend environment variables.
- Public configuration files.
- CI/CD logs.

Use dedicated secrets management systems such as AWS Secrets Manager or AWS Systems Manager Parameter Store.

---

# 47. Cloud Cost Optimization

Cloud resources can become expensive if they are not monitored.

## 47.1 Cost Optimization Techniques

| Technique | Benefit |
|---|---|
| Right-sizing | Avoid overprovisioned resources. |
| Autoscaling | Match capacity to demand. |
| Storage lifecycle policies | Move or expire old data. |
| Log retention | Control log storage costs. |
| Reserved capacity options | Reduce predictable long-term costs. |
| Spot Instances | Reduce costs for suitable interruptible workloads. |
| CDN caching | Reduce repeated origin requests. |
| Database optimization | Reduce unnecessary database resources. |
| Resource tagging | Improve cost allocation. |

## 47.2 Example

Suppose an application uses:

```text
EC2: 4 Instances
RDS: Large Instance
S3: 500 GB
CloudWatch: Large Log Retention
```

After analysis:

- Reduce unused EC2 capacity.
- Configure autoscaling.
- Optimize database instance size.
- Introduce S3 lifecycle policies.
- Reduce unnecessary log retention.
- Cache static assets through CloudFront.

The result can be a lower monthly bill without compromising required service reliability.

---

# 48. Complete Enterprise Deployment Architecture

Let's design a production architecture for a full-stack application.

### Application Requirements

- Next.js frontend.
- TypeScript/Node.js backend.
- MySQL database.
- Redis caching.
- File uploads.
- Authentication.
- CI/CD.
- Monitoring.
- High availability.

### Proposed AWS Architecture



```text
                    Users
                      |
                      v
                Route 53 DNS
                      |
                      v
                  CloudFront
                      |
             +--------+--------+
             |                 |
             v                 v
        Next.js Assets      API Requests
             |                 |
             v                 v
             S3              ALB
                               |
                               v
                         Application Layer
                               |
                       +-------+-------+
                       |               |
                       v               v
                    Node API        Workers
                       |
              +--------+--------+
              |                 |
              v                 v
            RDS MySQL          Redis
              |
              v
           Backups

        File Uploads → S3
```

### Infrastructure Responsibilities

| Component | AWS Service |
|---|---|
| DNS | Route 53 |
| CDN | CloudFront |
| Static frontend assets | S3 |
| Application load balancing | ALB |
| Backend compute | ECS or EKS |
| Database | RDS |
| Caching | ElastiCache |
| File storage | S3 |
| Secrets | Secrets Manager |
| Monitoring | CloudWatch |
| Infrastructure management | Terraform |

### CI/CD Workflow

```text
Developer Pushes Code
         |
         v
       GitHub
         |
         v
   GitHub Actions
         |
         v
    Install Packages
         |
         v
    TypeScript Check
         |
         v
      Run Tests
         |
         v
     Build Images
         |
         v
    Security Scan
         |
         v
  Push Images to ECR
         |
         v
    Deploy to ECS/EKS
         |
         v
   Health Verification
         |
         v
      Production
         |
         v
 Monitoring & Alerts
```

For a first production deployment, ECS can be simpler to operate than EKS. Kubernetes is valuable when its orchestration capabilities and operational requirements justify the additional complexity.

---

# 49. Common DevOps Mistakes

| Mistake | Better Practice |
|---|---|
| Deploying manually every time | Automate repeatable deployments. |
| Running production containers as root | Use non-root users. |
| Storing secrets in Docker images | Use secret managers. |
| Using `latest` everywhere | Use controlled, immutable image tags. |
| Ignoring container health checks | Configure meaningful health probes. |
| Running everything on one server | Design appropriate redundancy. |
| Giving all AWS resources administrator permissions | Apply least privilege. |
| Exposing databases publicly | Prefer private network access. |
| Ignoring infrastructure costs | Monitor and optimize usage. |
| Using Terraform without protecting state | Use secure remote state and locking. |
| Treating Kubernetes Secrets as automatically encrypted | Configure encryption and access controls. |
| Deploying incompatible database migrations | Use backward-compatible migrations. |
| Ignoring logs and metrics | Implement observability. |
| Using fixed delays in deployment scripts | Check readiness and actual health conditions. |
| Retrying every failure indefinitely | Use bounded retries and alerting. |

---

# 50. Important DevOps Interview Questions and Answers

## Q1. What is DevOps?

DevOps is a set of practices that combines software development and IT operations to improve collaboration, automation, deployment speed and reliability.

## Q2. What is the difference between CI and CD?

CI focuses on automatically integrating and validating code changes. CD can refer to Continuous Delivery or Continuous Deployment.

## Q3. What is Docker?

Docker is a platform for packaging and running applications inside containers.

## Q4. What is the difference between an image and a container?

An image is a template. A container is an instance created from that image.

## Q5. What is a Dockerfile?

A Dockerfile contains instructions used to build a Docker image.

## Q6. What is Docker Compose?

Docker Compose is a tool for defining and running multi-container applications using YAML configuration.

## Q7. What is a Docker volume?

A Docker volume provides persistent storage managed by Docker.

## Q8. What is a multi-stage Docker build?

It uses multiple build stages to separate build dependencies from runtime dependencies and produce a smaller final image.

## Q9. What is Kubernetes?

Kubernetes is a container orchestration platform used to manage, scale and deploy containerized applications.

## Q10. What is a Pod?

A Pod is the smallest deployable unit in Kubernetes and contains one or more closely related containers.

## Q11. What is a Deployment?

A Deployment manages application Pods and provides declarative updates and rollout management.

## Q12. What is a ReplicaSet?

A ReplicaSet ensures that a specified number of matching Pods are running.

## Q13. What is a Kubernetes Service?

A Service provides a stable network endpoint for a group of Pods.

## Q14. What is ClusterIP?

ClusterIP is the default Kubernetes Service type that exposes a service internally within the cluster.

## Q15. What is NodePort?

NodePort exposes a service through a port on each Kubernetes node.

## Q16. What is LoadBalancer?

LoadBalancer is a Service type that can provision an external load balancer through supported infrastructure integrations.

## Q17. What is Ingress?

Ingress defines rules for HTTP and HTTPS routing to services inside a Kubernetes cluster.

## Q18. What is ConfigMap?

ConfigMap stores non-sensitive application configuration.

## Q19. What is a Kubernetes Secret?

A Secret stores sensitive configuration data such as credentials and tokens.

## Q20. What is a readiness probe?

A readiness probe determines whether a container is ready to receive traffic.

## Q21. What is a liveness probe?

A liveness probe checks whether a container should continue running or be restarted.

## Q22. What is a startup probe?

A startup probe checks whether an application has completed startup.

## Q23. What is HPA?

Horizontal Pod Autoscaler automatically adjusts the number of Pods based on configured metrics.

## Q24. What is Helm?

Helm is a package manager for Kubernetes that uses reusable charts to manage application deployments.

## Q25. What is Terraform?

Terraform is an Infrastructure as Code tool used to provision and manage infrastructure.

## Q26. What is Terraform State?

Terraform State records information about infrastructure managed by Terraform.

## Q27. What is Ansible?

Ansible is an automation and configuration management tool.

## Q28. What is the difference between Terraform and Ansible?

Terraform is commonly used to provision infrastructure, while Ansible is commonly used to configure systems and automate operational tasks.

## Q29. What is AWS EC2?

EC2 is an AWS service that provides virtual computing instances.

## Q30. What is AWS S3?

S3 is an object storage service used to store files, backups, images and other objects.

## Q31. What is AWS RDS?

RDS is a managed relational database service.

## Q32. What is AWS VPC?

VPC is a logically isolated virtual network in AWS.

## Q33. What is the difference between public and private subnets?

A public subnet generally has a route to an Internet Gateway, while a private subnet does not have direct internet gateway routing.

## Q34. What is the difference between Security Groups and NACLs?

Security Groups are stateful and associated with resources/network interfaces. NACLs are stateless and associated with subnets.

## Q35. What is IAM?

IAM controls identities, permissions and access to AWS resources.

## Q36. What is CloudFront?

CloudFront is an AWS CDN that delivers content through edge locations.

## Q37. What is Route 53?

Route 53 is an AWS DNS and domain routing service.

## Q38. What is AWS Lambda?

Lambda is an event-driven serverless compute service.

## Q39. What is Prometheus?

Prometheus is a monitoring system that collects and stores metrics.

## Q40. What is Grafana?

Grafana is a platform used to visualize metrics and other observability data.

## Q41. What is centralized logging?

Centralized logging collects logs from multiple services and infrastructure components into a common platform.

## Q42. What is OpenTelemetry?

OpenTelemetry is a framework for generating, collecting and exporting telemetry data.

## Q43. What are the three pillars of observability?

Metrics, logs and traces.

## Q44. What is blue-green deployment?

Blue-green deployment maintains two environments and switches production traffic from the old environment to the new one.

## Q45. What is canary deployment?

Canary deployment gradually routes a small portion of traffic to a new version before expanding the rollout.

## Q46. What is rolling deployment?

Rolling deployment gradually replaces old application instances with new ones.

## Q47. What is zero-downtime deployment?

It is a deployment approach designed to prevent service interruption while releasing a new application version.

## Q48. What is SLI?

A Service Level Indicator is a measurable indicator of service reliability or performance.

## Q49. What is SLO?

A Service Level Objective is a target for a Service Level Indicator.

## Q50. What is DevSecOps?

DevSecOps integrates security practices into the software development and operations lifecycle.

---

# 51. Practical Exercises

Complete these exercises in order.

### Beginner Level

**Exercise 1: Docker Installation**

- Install Docker Desktop.
- Verify Docker installation.
- Run a Node.js container.
- Inspect running containers.

**Exercise 2: Dockerize Node.js**

- Create a simple Express application.
- Write a Dockerfile.
- Build an image.
- Run the container.
- Access the API through localhost.

**Exercise 3: Dockerize TypeScript**

- Create a TypeScript Express application.
- Configure `tsconfig.json`.
- Create a production Dockerfile.
- Build and run the application.

**Exercise 4: Docker Volumes**

- Run MySQL in Docker.
- Create a persistent volume.
- Insert records.
- Remove and recreate the container.
- Verify that the records remain.

### Intermediate Level

**Exercise 5: Docker Compose**

Create an application with:

- Node.js API.
- MySQL database.
- Redis.
- Docker network.
- Persistent volumes.

**Exercise 6: Docker Security**

- Use a non-root container user.
- Create a `.dockerignore`.
- Scan the Docker image.
- Avoid embedding secrets in the image.

**Exercise 7: GitHub Actions**

Create a CI workflow that performs:

- npm install using `npm ci`.
- TypeScript type checking.
- Unit testing.
- Production build.

**Exercise 8: Terraform**

- Install Terraform.
- Configure the AWS provider.
- Create an EC2 instance in a suitable test environment.
- Run `terraform plan`.
- Apply the configuration.
- Destroy the resources after verification.

### Advanced Level

**Exercise 9: Kubernetes Deployment**

- Install Minikube or use another Kubernetes learning environment.
- Deploy a Node.js application.
- Create a Deployment.
- Configure a Service.
- Scale the application to three replicas.

**Exercise 10: Kubernetes Health Checks**

- Implement `/health` and `/ready`.
- Configure startup, readiness and liveness probes.
- Test what happens when the application becomes unhealthy.

**Exercise 11: Kubernetes Autoscaling**

- Configure CPU requests.
- Install/configure the necessary metrics source.
- Create an HPA.
- Generate test traffic.
- Observe replica scaling.

**Exercise 12: Helm**

- Create a Helm chart.
- Add Deployment and Service templates.
- Configure environment-specific values.
- Deploy the application.

### Expert Level

**Exercise 13: Complete CI/CD Pipeline**

Build a pipeline:

```text
GitHub
   |
   v
GitHub Actions
   |
   v
TypeScript Check
   |
   v
Automated Tests
   |
   v
Docker Build
   |
   v
Image Security Scan
   |
   v
Container Registry
   |
   v
Production Deployment
```

**Exercise 14: AWS Production Architecture**

Deploy an application using:

- Route 53.
- CloudFront.
- Application Load Balancer.
- EC2 or ECS.
- RDS.
- S3.
- IAM.
- CloudWatch.

**Exercise 15: Monitoring**

- Configure Prometheus.
- Connect Grafana.
- Create CPU and memory dashboards.
- Monitor API response times.
- Configure alerts.

**Exercise 16: Zero-Downtime Deployment**

Implement a rolling deployment or blue-green deployment.

Verify:

- Health checks.
- Graceful shutdown.
- Backward-compatible database migrations.
- Rollback.
- Error-rate monitoring.

---

# 52. Phase 66 Completion Checklist

Before moving forward, ensure you understand the following.

| No. | Topic | Status |
|---|---|---|
| 1 | DevOps Fundamentals | ☐ |
| 2 | DevSecOps | ☐ |
| 3 | SDLC | ☐ |
| 4 | Advanced Git Workflows | ☐ |
| 5 | GitHub Flow | ☐ |
| 6 | GitFlow | ☐ |
| 7 | Trunk-Based Development | ☐ |
| 8 | Docker Architecture | ☐ |
| 9 | Docker Images and Containers | ☐ |
| 10 | Dockerfile | ☐ |
| 11 | Multi-Stage Builds | ☐ |
| 12 | Docker Compose | ☐ |
| 13 | Docker Networking | ☐ |
| 14 | Docker Volumes | ☐ |
| 15 | Container Security | ☐ |
| 16 | Kubernetes Architecture | ☐ |
| 17 | Kubernetes Pods | ☐ |
| 18 | Deployments and ReplicaSets | ☐ |
| 19 | Kubernetes Services | ☐ |
| 20 | ConfigMaps and Secrets | ☐ |
| 21 | Health Checks and Probes | ☐ |
| 22 | Resource Requests and Limits | ☐ |
| 23 | Persistent Storage | ☐ |
| 24 | HPA and Autoscaling | ☐ |
| 25 | Kubernetes Ingress | ☐ |
| 26 | Helm | ☐ |
| 27 | CI/CD Architecture | ☐ |
| 28 | GitHub Actions | ☐ |
| 29 | Jenkins | ☐ |
| 30 | GitLab CI/CD | ☐ |
| 31 | Infrastructure as Code | ☐ |
| 32 | Terraform | ☐ |
| 33 | Ansible | ☐ |
| 34 | AWS Architecture | ☐ |
| 35 | AWS IAM | ☐ |
| 36 | AWS VPC | ☐ |
| 37 | AWS EC2 | ☐ |
| 38 | AWS S3 | ☐ |
| 39 | AWS RDS | ☐ |
| 40 | Load Balancing and Auto Scaling | ☐ |
| 41 | Route 53 and CloudFront | ☐ |
| 42 | AWS Lambda and API Gateway | ☐ |
| 43 | Monitoring and Observability | ☐ |
| 44 | Prometheus and Grafana | ☐ |
| 45 | ELK Stack | ☐ |
| 46 | OpenTelemetry | ☐ |
| 47 | AWS CloudWatch | ☐ |
| 48 | SLI, SLO and SLA | ☐ |
| 49 | Production Deployment | ☐ |
| 50 | Blue-Green Deployment | ☐ |
| 51 | Canary Deployment | ☐ |
| 52 | Rolling Deployment | ☐ |
| 53 | Zero-Downtime Deployment | ☐ |
| 54 | Production Security | ☐ |
| 55 | Cloud Cost Optimization | ☐ |
| 56 | Enterprise DevOps Architecture | ☐ |

---

# 53. What Comes Next?

You have now covered advanced DevOps engineering, containerization, orchestration, cloud infrastructure, CI/CD, monitoring and production deployment.

The next phase will focus on another major area of professional software engineering.

## Phase 67: Advanced TypeScript – Advanced System Design, Distributed Systems, Microservices Architecture, Scalability, High Availability, Caching, Message Queues and Enterprise Backend Architecture

Upcoming topics:

1. System Design Fundamentals.
2. High-Level Design (HLD).
3. Low-Level Design (LLD).
4. Functional and Non-Functional Requirements.
5. Scalability.
6. Vertical and Horizontal Scaling.
7. Load Balancing.
8. Reverse Proxy.
9. API Gateway.
10. Monolithic Architecture.
11. Microservices Architecture.
12. Modular Monolith.
13. Service-Oriented Architecture.
14. Distributed Systems Fundamentals.
15. CAP Theorem.
16. Consistency Models.
17. Eventual Consistency.
18. Database Sharding.
19. Database Replication.
20. Database Partitioning.
21. Caching Architecture.
22. Redis Advanced.
23. CDN Caching.
24. Cache Invalidation.
25. Message Queues.
26. RabbitMQ.
27. Apache Kafka.
28. Event-Driven Architecture.
29. Event Sourcing.
30. CQRS.
31. Saga Pattern.
32. Circuit Breaker Pattern.
33. Retry and Backoff Strategies.
34. Rate Limiting.
35. Distributed Locking.
36. Idempotency.
37. Service Discovery.
38. Distributed Transactions.
39. API Design at Scale.
40. Database Architecture.
41. Search Architecture.
42. Real-Time System Design.
43. WebSocket Architecture.
44. Notification System Design.
45. Chat Application Architecture.
46. E-commerce Architecture.
47. Payment System Design.
48. URL Shortener System Design.
49. Social Media System Design.
50. Video Streaming Architecture.
51. High Availability.
52. Fault Tolerance.
53. Disaster Recovery.
54. Data Consistency and Reliability.
55. Enterprise System Design.

**To continue, say: `OK, Continue to Phase 67`.**
# Phase 61: Advanced TypeScript – Cloud-Native Development, Docker, Kubernetes, CI/CD, Infrastructure as Code, Deployment Strategies and Production Operations

**Level:** Expert / Advanced Cloud-Native Engineering  
**Prerequisites:** TypeScript, JavaScript, Node.js, Express.js, REST APIs, databases, Redis, Git, Linux fundamentals, system design and Phase 60.

---

# 1. Learning Objectives

By the end of this phase, you will understand how to:

1. Understand cloud-native application architecture.
2. Compare monolithic and microservices architectures.
3. Containerize Node.js and TypeScript applications using Docker.
4. Write optimized production Dockerfiles.
5. Use multi-stage Docker builds.
6. Manage multiple containers using Docker Compose.
7. Understand container networking and volumes.
8. Secure Docker containers.
9. Understand Kubernetes architecture.
10. Deploy applications using Kubernetes.
11. Manage Pods, Deployments, Services and Ingress.
12. Configure Kubernetes ConfigMaps and Secrets.
13. Implement health checks and autoscaling.
14. Build CI/CD pipelines using GitHub Actions.
15. Automate testing, building and deployment.
16. Understand Infrastructure as Code.
17. Use Terraform for infrastructure provisioning.
18. Implement production deployment strategies.
19. Understand blue-green, canary and rolling deployments.
20. Implement logging, monitoring and observability.
21. Design highly available and fault-tolerant systems.
22. Understand backup, disaster recovery and production operations.

---

# 2. Cloud-Native Architecture

## 2.1 What Is Cloud Computing?

Cloud computing provides computing resources over the internet.

Instead of purchasing and maintaining physical servers, organizations can rent infrastructure from cloud providers.

Examples:

- Amazon Web Services (AWS)
- Microsoft Azure
- Google Cloud

### Traditional Infrastructure

```text
Company
   |
   v
Physical Server
   |
   +---- Application
   |
   +---- Database
   |
   +---- Storage
```

The organization manages:

- Physical hardware.
- Networking.
- Power supply.
- Cooling.
- Operating systems.
- Application deployment.

### Cloud Infrastructure

```text
Developer
    |
    v
Cloud Provider
    |
    +---- Virtual Machines
    |
    +---- Databases
    |
    +---- Storage
    |
    +---- Networking
    |
    +---- Monitoring
```

The cloud provider manages the underlying infrastructure according to the selected service model.

## 2.2 Cloud Service Models

There are three major cloud service models.

### 1. IaaS – Infrastructure as a Service

The provider supplies virtualized infrastructure.

Examples:

- AWS EC2.
- Azure Virtual Machines.
- Google Compute Engine.

You manage:

- Operating system.
- Runtime.
- Application.
- Application dependencies.
- Data.

The provider manages the underlying physical infrastructure.

### 2. PaaS – Platform as a Service

The provider manages much of the infrastructure and runtime environment.

Examples:

- Render.
- Heroku.
- Azure App Service.
- Google App Engine.

You primarily focus on application development and configuration.

### 3. SaaS – Software as a Service

The provider delivers a complete software application.

Examples:

- Gmail.
- Google Drive.
- Slack.
- Microsoft 365.

You use the software without managing its underlying infrastructure.

### Comparison

| Feature | IaaS | PaaS | SaaS |
|---|---|---|---|
| Infrastructure management | Provider | Provider | Provider |
| OS management | Customer | Provider | Provider |
| Runtime management | Customer | Provider | Provider |
| Application development | Customer | Customer | Provider |
| Software usage | Customer application | Customer application | Ready-made software |
| Control | High | Medium | Low |

---

# 3. Cloud-Native Applications

## 3.1 What Is Cloud-Native Development?

Cloud-native development is an approach to designing applications that take advantage of cloud infrastructure.

Cloud-native applications commonly use:

- Containers.
- Microservices.
- APIs.
- Automated deployment.
- Dynamic infrastructure.
- Distributed systems.
- Observability.
- Automated scaling.

Example architecture:

```text
                 Users
                   |
                   v
              Load Balancer
                   |
                   v
                API Gateway
                   |
          +--------+--------+
          |        |        |
          v        v        v
       User     Expense   Payment
      Service   Service   Service
          |        |        |
          v        v        v
       Database Database Database
          |
          v
       Redis Cache
```

Each service can be deployed and scaled independently, subject to its dependencies.

## 3.2 Twelve-Factor App Methodology

The Twelve-Factor App is a methodology for building modern cloud applications.

It is especially relevant to deployable web applications.

The 12 factors are:

| No. | Factor | Meaning |
|---:|---|---|
| 1 | Codebase | One codebase tracked in version control |
| 2 | Dependencies | Explicitly declare dependencies |
| 3 | Config | Store configuration outside application code |
| 4 | Backing Services | Treat databases and external services as attached resources |
| 5 | Build, Release, Run | Separate build, release and execution stages |
| 6 | Processes | Run the application as stateless processes |
| 7 | Port Binding | Export services through port binding |
| 8 | Concurrency | Scale through process models |
| 9 | Disposability | Start quickly and shut down gracefully |
| 10 | Dev/Prod Parity | Keep environments as similar as practical |
| 11 | Logs | Treat logs as event streams |
| 12 | Admin Processes | Run administrative tasks as separate processes |

Official reference:

[Twelve-Factor App](https://12factor.net/?utm_source=chatgpt.com)

### Example: External Configuration

Poor approach:

```typescript
const databasePassword = "my-secret-password";
```

Better:

```typescript
const databasePassword = process.env.DB_PASSWORD;

if (!databasePassword) {
  throw new Error("DB_PASSWORD is required");
}
```

Configuration should be supplied by the environment or an appropriate secret-management system.

---

# 4. Monolithic vs Microservices Architecture

## 4.1 What Is a Monolithic Application?

A monolithic application is an application in which multiple functional components are deployed together as one unit.

Example:

```text
             Expense Tracker
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
      Users       Expenses    Reports
        |           |           |
        +-----------+-----------+
                    |
                    v
                 MySQL
```

A typical monolithic application may contain:

- Authentication.
- User management.
- Expense management.
- Reporting.
- Notifications.

All modules are part of the same deployable application.

### Advantages

- Simple initial architecture.
- Easier local development.
- Straightforward deployment.
- Easier debugging across modules.
- Lower infrastructure complexity.

### Disadvantages

- Large applications can become difficult to maintain.
- Components cannot always be scaled independently.
- A deployment may affect the entire application.
- Tight coupling can develop between modules.

## 4.2 What Are Microservices?

Microservices architecture divides an application into independently deployable services.

Example:

```text
                   API Gateway
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
     User Service  Expense Service  Report Service
          |             |             |
          v             v             v
       User DB       Expense DB    Report Storage
```

Each service owns a specific business capability.

### Advantages

- Independent deployment.
- Independent scaling.
- Technology flexibility.
- Better organizational ownership.
- Failure isolation when properly designed.

### Disadvantages

- Network communication complexity.
- Distributed tracing requirements.
- Data consistency challenges.
- More infrastructure.
- More complicated deployment and monitoring.

## 4.3 Monolith vs Microservices

| Feature | Monolith | Microservices |
|---|---|---|
| Deployment | Usually one unit | Multiple services |
| Initial complexity | Lower | Higher |
| Scaling | Often application-wide | Per service |
| Communication | Usually internal calls | Network communication |
| Data management | Often shared database | Prefer service-owned data |
| Failure isolation | More limited | Can be stronger |
| Infrastructure | Simpler | More complex |

**Professional recommendation:** Do not choose microservices simply because they are popular. A well-structured modular monolith is often the better starting point.

---

# 5. Docker Fundamentals

## 5.1 What Is Docker?

Docker is a platform for building, distributing and running applications in containers.

A container packages an application with its required dependencies and configuration.

Official documentation:

[Docker Documentation](https://docs.docker.com/?utm_source=chatgpt.com)

Consider a Node.js application.

Without Docker, deployment may depend on:

- Node.js version.
- Operating system configuration.
- Installed dependencies.
- Environment variables.
- System libraries.

This can cause the application to behave differently across machines.

Docker helps standardize the runtime environment.

## 5.2 What Is a Container?

A container is an isolated running environment for an application.

Example:

```text
               Docker Host
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
     Container  Container  Container
        |           |           |
        v           v           v
      Node.js     MySQL       Redis
        App
```

Containers share the host operating-system kernel but have isolated process and resource environments.

## 5.3 What Is a Docker Image?

A Docker image is a packaged, read-only template used to create containers.

Example:

```text
Node.js Application
       |
       v
Dockerfile
       |
       v
Docker Image
       |
       v
Docker Container
```

### Image vs Container

| Docker Image | Docker Container |
|---|---|
| Template | Running or stopped instance |
| Read-only layers | Writable container layer |
| Used to create containers | Executes the application |
| Can be stored in registries | Runs on a Docker host |

## 5.4 Install Docker

For Windows, Docker Desktop is a common installation option.

Official download and documentation:

[Docker Desktop](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

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

---

# 6. Docker Architecture

Docker uses a client-server architecture.

```text
             Docker Client
                  |
                  v
             Docker API
                  |
                  v
              Docker Daemon
                  |
          +-------+-------+
          |       |       |
          v       v       v
        Images Containers Networks
```

### Important Components

| Component | Purpose |
|---|---|
| Docker Client | Sends commands |
| Docker Daemon | Manages Docker objects |
| Docker Image | Application template |
| Docker Container | Running instance |
| Docker Registry | Stores and distributes images |
| Docker Engine | Core container-management technology |

## 6.1 Important Docker Commands

Download an image:

```bash
docker pull nginx
```

List images:

```bash
docker images
```

Run a container:

```bash
docker run nginx
```

Run in detached mode:

```bash
docker run -d nginx
```

Map ports:

```bash
docker run -d -p 8080:80 nginx
```

Interpretation:

```text
Host Port: 8080
Container Port: 80
```

Open:

```text
http://localhost:8080
```

List running containers:

```bash
docker ps
```

List all containers:

```bash
docker ps -a
```

Stop a container:

```bash
docker stop CONTAINER_ID
```

Start a container:

```bash
docker start CONTAINER_ID
```

Remove a container:

```bash
docker rm CONTAINER_ID
```

Remove an image:

```bash
docker rmi IMAGE_NAME
```

View logs:

```bash
docker logs CONTAINER_ID
```

Follow logs:

```bash
docker logs -f CONTAINER_ID
```

Execute a command inside a container:

```bash
docker exec -it CONTAINER_ID sh
```

For images that include Bash:

```bash
docker exec -it CONTAINER_ID bash
```

---

# 7. Writing a Dockerfile for Node.js and TypeScript

A Dockerfile describes how to build an image.

Consider this project:

```text
expense-tracker/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── Dockerfile
```

## 7.1 Basic Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Explanation

**FROM**

```dockerfile
FROM node:22-alpine
```

Defines the base image.

**WORKDIR**

```dockerfile
WORKDIR /app
```

Sets the working directory.

**COPY**

```dockerfile
COPY package*.json ./
```

Copies dependency files into the image.

**RUN**

```dockerfile
RUN npm ci
```

Installs dependencies using the lockfile.

**EXPOSE**

```dockerfile
EXPOSE 3000
```

Documents the container's intended listening port. It does not publish the port on the host.

**CMD**

```dockerfile
CMD ["node", "dist/server.js"]
```

Defines the default command executed when the container starts.

## 7.2 Build the Image

```bash
docker build -t expense-tracker .
```

Explanation:

- `build`: Builds an image.
- `-t`: Assigns a name/tag.
- `expense-tracker`: Image name.
- `.`: Build context.

## 7.3 Run the Container

```bash
docker run -d -p 3000:3000 expense-tracker
```

Your application should now be accessible through:

```text
http://localhost:3000
```

Provided the application listens on port 3000 and binds to an address accessible inside the container, typically `0.0.0.0`.

---

# 8. Docker Image Optimization

A production Docker image should be efficient, reproducible and secure.

## 8.1 Use .dockerignore

Create:

```text
.dockerignore
```

Example:

```text
node_modules
dist
.git
.env
.env.*
coverage
npm-debug.log
Dockerfile
docker-compose.yml
```

This prevents unnecessary files from being included in the Docker build context.

Do not exclude files that your build actually requires.

## 8.2 Use Layer Caching

Poor Dockerfile:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm ci
```

Every source-code change can invalidate the dependency-installation layer.

Better:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
```

Now dependency installation can be reused when only application source files change.

## 8.3 Pin Image Versions

Avoid relying on an unqualified floating tag such as:

```dockerfile
FROM node:latest
```

Prefer a deliberate version:

```dockerfile
FROM node:22-alpine
```

For stricter reproducibility and supply-chain control, pin image digests and update them through a controlled process.

---

# 9. Multi-Stage Docker Builds

## 9.1 What Is a Multi-Stage Build?

A multi-stage build uses multiple build stages in one Dockerfile.

The goal is to separate build-time dependencies from runtime dependencies.

Example:

```text
Stage 1: Build
    |
    v
Install All Dependencies
    |
    v
Compile TypeScript
    |
    v
Stage 2: Production
    |
    v
Copy Compiled Output
    |
    v
Install Production Dependencies
    |
    v
Final Image
```

## 9.2 Production Dockerfile

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./

COPY src ./src

RUN npm run build


# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/server.js"]
```

### Why Multi-Stage Builds?

Benefits:

1. Smaller runtime images.
2. Reduced build-tool exposure.
3. Better separation of build and runtime.
4. More controlled production environments.

**Important:** This example assumes your TypeScript compilation only requires the copied source and configuration files. If your project needs additional assets, generated files or runtime dependencies, copy those explicitly.

Also ensure the selected Node.js image version is supported and maintained when creating a real deployment.

---

# 10. Docker Volumes

## 10.1 What Is a Docker Volume?

A Docker volume provides persistent storage that exists independently of a container's writable layer.

Without persistent storage, data stored only inside a container can be lost when that container is removed.

Example:

```bash
docker volume create mysql_data
```

Run MySQL:

```bash
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v mysql_data:/var/lib/mysql \
  mysql:8
```

The volume stores MySQL data outside the container's writable layer.

## 10.2 Volume Types

| Type | Description |
|---|---|
| Named Volume | Managed by Docker |
| Bind Mount | Maps a host filesystem path into a container |
| tmpfs Mount | Stores temporary data in memory |

### Named Volume

```bash
docker run -v mysql_data:/var/lib/mysql mysql:8
```

### Bind Mount

```bash
docker run -v ./uploads:/app/uploads expense-tracker
```

### tmpfs Mount

```bash
docker run --tmpfs /app/temp expense-tracker
```

Use tmpfs for temporary data that should not persist on disk.

---

# 11. Docker Networking

Containers often need to communicate with each other.

For example:

```text
Node.js API
     |
     v
MySQL Container
     |
     v
Redis Container
```

Docker networking provides communication between containers.

## 11.1 Create a Network

```bash
docker network create expense-network
```

Run MySQL:

```bash
docker run -d \
  --name mysql \
  --network expense-network \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=expenses \
  mysql:8
```

Run Redis:

```bash
docker run -d \
  --name redis \
  --network expense-network \
  redis:7
```

Containers attached to the same user-defined network can generally reach one another using their container names.

Example application configuration:

```typescript
const databaseHost = process.env.DB_HOST || "mysql";

const redisHost = process.env.REDIS_HOST || "redis";
```

Inside the Node.js container, `localhost` refers to that Node.js container itself, not the MySQL container.

This is a very common Docker networking mistake.

---

# 12. Docker Compose

## 12.1 What Is Docker Compose?

Docker Compose is a tool for defining and running multi-container applications.

Instead of manually starting:

- Node.js.
- MySQL.
- Redis.

You can define them in one YAML file.

Official documentation:

[Docker Compose Documentation](https://docs.docker.com/compose/?utm_source=chatgpt.com)

## 12.2 Example Project Structure

```text
expense-tracker/
│
├── src/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## 12.3 docker-compose.yml

```yaml
services:
  api:
    build:
      context: .
    container_name: expense-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: expenses
      DB_USER: root
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started

  mysql:
    image: mysql:8
    container_name: expense-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: expenses
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "mysqladmin ping -h localhost -uroot -p$$MYSQL_ROOT_PASSWORD"
        ]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7
    container_name: expense-redis

volumes:
  mysql_data:
```

This example assumes the application reads the listed environment variables.

Use a local `.env` file for development configuration, and do not commit secrets into version control.

For production, use an appropriate secrets-management mechanism.

## 12.4 Run Docker Compose

Start services:

```bash
docker compose up -d
```

Check services:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

Follow API logs:

```bash
docker compose logs -f api
```

Stop services:

```bash
docker compose down
```

Stop and remove volumes:

```bash
docker compose down -v
```

**Warning:** `docker compose down -v` removes the Compose-managed volumes. Do not use it when you need to preserve database data.

## 12.5 depends_on vs Health Checks

`depends_on` controls service startup ordering.

It does not always mean the dependency is ready to accept requests.

Health checks help determine whether a dependency is actually ready.

Even with health checks, applications should implement database connection retries and resilient startup behavior.

---

# 13. Container Security

Security is essential when deploying applications through Docker.

## 13.1 Do Not Run as Root

Poor practice:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY . .

CMD ["node", "dist/server.js"]
```

Better:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY --chown=node:node . .

USER node

CMD ["node", "dist/server.js"]
```

Running as a non-root user reduces the impact of certain security vulnerabilities.

## 13.2 Never Store Secrets in Docker Images

Avoid:

```dockerfile
ENV DB_PASSWORD=my-secret-password
```

Anyone with access to the image or its metadata may be able to retrieve this value.

Instead, inject secrets at runtime through a secure deployment mechanism.

## 13.3 Use Minimal Base Images

Prefer suitable minimal images to reduce unnecessary packages and attack surface.

However, smaller images are not automatically secure. They still need patching and vulnerability scanning.

## 13.4 Scan Docker Images

Tools include:

- Docker Scout.
- Trivy.
- Snyk Container.

Official documentation:

[Trivy Documentation](https://trivy.dev/latest/docs/?utm_source=chatgpt.com)

Example:

```bash
trivy image expense-tracker:latest
```

## 13.5 Additional Security Practices

- Pin trusted base images.
- Scan dependencies.
- Avoid unnecessary Linux capabilities.
- Use read-only filesystems where practical.
- Limit CPU and memory.
- Avoid privileged containers.
- Keep secrets outside images.
- Patch images regularly.
- Restrict container network access.

---

# 14. Kubernetes Fundamentals

## 14.1 What Is Kubernetes?

Kubernetes is a container orchestration platform.

It automates:

- Container deployment.
- Scaling.
- Scheduling.
- Service discovery.
- Health monitoring.
- Application recovery.
- Rolling updates.

Official documentation:

[Kubernetes Documentation](https://kubernetes.io/docs/home/?utm_source=chatgpt.com)

Imagine your application has 20 containers.

Managing them manually becomes difficult.

Kubernetes provides a system for managing these containers.

## 14.2 Kubernetes Architecture

```text
                  Kubernetes Cluster
                          |
              +-----------+-----------+
              |                       |
              v                       v
         Control Plane             Worker Nodes
              |                       |
       +------+-------+          +----+----+
       |      |       |          |         |
       v      v       v          v         v
    API    Scheduler Controller Pods     Pods
   Server                Manager
```

## 14.3 Control Plane Components

| Component | Responsibility |
|---|---|
| kube-apiserver | Exposes the Kubernetes API |
| etcd | Stores cluster state |
| kube-scheduler | Assigns Pods to suitable nodes |
| kube-controller-manager | Runs control loops |
| cloud-controller-manager | Integrates with cloud-provider infrastructure |

## 14.4 Worker Node Components

| Component | Responsibility |
|---|---|
| kubelet | Manages Pods on a node |
| kube-proxy | Implements Service networking behavior where used |
| Container Runtime | Runs containers |

Common container runtimes include containerd and CRI-O.

---

# 15. Kubernetes Core Objects

## 15.1 What Is a Pod?

A Pod is the smallest deployable unit in Kubernetes.

A Pod can contain one or more closely related containers.

Example:

```text
Pod
 |
 +---- Node.js Container
 |
 +---- Sidecar Container
```

Containers in the same Pod share certain resources, including networking.

## 15.2 What Is a Deployment?

A Deployment manages replicated application Pods.

Example:

```text
Deployment
    |
    +---- Pod 1
    |
    +---- Pod 2
    |
    +---- Pod 3
```

If a Pod fails, Kubernetes attempts to maintain the desired replica count.

## 15.3 What Is a Service?

A Service provides a stable network endpoint for accessing a group of Pods.

Pods can be replaced, and their IP addresses may change.

A Service provides a stable abstraction over the changing Pod instances.

## 15.4 Kubernetes Service Types

| Service Type | Purpose |
|---|---|
| ClusterIP | Internal cluster access |
| NodePort | Exposes a port on cluster nodes |
| LoadBalancer | Integrates with an external load balancer where supported |
| ExternalName | Maps a Service to an external DNS name |

## 15.5 What Is Ingress?

Ingress provides HTTP/HTTPS routing to services within a Kubernetes cluster.

Example:

```text
                 Internet
                    |
                    v
              Ingress Controller
                    |
          +---------+---------+
          |                   |
          v                   v
     /api/users          /api/expenses
          |                   |
          v                   v
     User Service       Expense Service
```

Ingress resources require an Ingress Controller to implement the routing.

---

# 16. Deploying a Node.js Application to Kubernetes

We will use the Expense Tracker API.

## 16.1 Create a Deployment

Create:

```text
deployment.yaml
```

Example:

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: expense-api

spec:
  replicas: 3

  selector:
    matchLabels:
      app: expense-api

  template:
    metadata:
      labels:
        app: expense-api

    spec:
      containers:
        - name: expense-api

          image: expense-tracker:1.0

          ports:
            - containerPort: 3000

          env:
            - name: NODE_ENV
              value: "production"
```

This creates a Deployment with three desired Pod replicas.

For a real cluster, the image must be available to the cluster's container runtime, usually through a container registry.

## 16.2 Apply the Deployment

```bash
kubectl apply -f deployment.yaml
```

Check Deployments:

```bash
kubectl get deployments
```

Check Pods:

```bash
kubectl get pods
```

Describe a Pod:

```bash
kubectl describe pod POD_NAME
```

View logs:

```bash
kubectl logs POD_NAME
```

## 16.3 Create a Service

Create:

```text
service.yaml
```

Example:

```yaml
apiVersion: v1
kind: Service

metadata:
  name: expense-api-service

spec:
  type: ClusterIP

  selector:
    app: expense-api

  ports:
    - port: 80
      targetPort: 3000
```

Apply:

```bash
kubectl apply -f service.yaml
```

The Service exposes port 80 internally and forwards traffic to container port 3000.

---

# 17. Kubernetes ConfigMaps and Secrets

Applications need configuration such as:

- Database host.
- Database port.
- Redis host.
- API configuration.
- Credentials.

Kubernetes provides ConfigMaps and Secrets.

## 17.1 ConfigMap

A ConfigMap stores non-sensitive configuration.

Example:

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: expense-config

data:
  NODE_ENV: production
  DB_HOST: mysql-service
  DB_PORT: "3306"
```

## 17.2 Secret

A Secret stores sensitive configuration.

Example:

```yaml
apiVersion: v1
kind: Secret

metadata:
  name: expense-secret

type: Opaque

stringData:
  DB_PASSWORD: example-password
```

**Important:** Kubernetes Secrets are not automatically encrypted in every deployment configuration. Their values are base64-encoded in the serialized representation, not encrypted merely because they are Secrets.

For production:

- Enable encryption at rest for Secret data.
- Restrict RBAC access.
- Avoid committing real Secret manifests to Git.
- Consider an external secret-management system.
- Rotate credentials.

## 17.3 Using ConfigMap and Secret in a Deployment

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: expense-api

spec:
  replicas: 3

  selector:
    matchLabels:
      app: expense-api

  template:
    metadata:
      labels:
        app: expense-api

    spec:
      containers:
        - name: expense-api

          image: expense-tracker:1.0

          ports:
            - containerPort: 3000

          envFrom:
            - configMapRef:
                name: expense-config

            - secretRef:
                name: expense-secret
```

The application receives the configuration through environment variables.

---

# 18. Kubernetes Health Checks

Kubernetes provides three important probe types.

| Probe | Purpose |
|---|---|
| Liveness | Determines whether the container should be restarted |
| Readiness | Determines whether the Pod should receive traffic |
| Startup | Allows slow-starting applications time to initialize |

## 18.1 Liveness Probe

Checks whether the application is still functioning.

Example:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000

  initialDelaySeconds: 10
  periodSeconds: 10
```

## 18.2 Readiness Probe

Determines whether the application is ready to receive traffic.

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000

  initialDelaySeconds: 5
  periodSeconds: 5
```

## 18.3 Startup Probe

Useful for applications that require significant startup time.

```yaml
startupProbe:
  httpGet:
    path: /health/live
    port: 3000

  periodSeconds: 10
  failureThreshold: 30
```

### Health Endpoint Example

```typescript
import express from "express";

const app = express();

app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "alive",
  });
});

app.get("/health/ready", async (req, res) => {
  try {
    // Check critical dependencies here.
    // For example, verify database readiness.

    res.status(200).json({
      status: "ready",
    });
  } catch {
    res.status(503).json({
      status: "not ready",
    });
  }
});
```

Liveness and readiness checks should have different responsibilities.

Do not make liveness depend blindly on every external service. A temporary database outage should not necessarily cause every application instance to restart repeatedly.

---

# 19. Kubernetes Autoscaling

## 19.1 What Is Autoscaling?

Autoscaling adjusts application resources according to workload.

Example:

```text
Low Traffic
    |
    v
2 Pods

High Traffic
    |
    v
5 Pods

Very High Traffic
    |
    v
10 Pods
```

## 19.2 Horizontal Pod Autoscaler

HPA automatically adjusts the number of Pod replicas based on metrics.

Example:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler

metadata:
  name: expense-api-hpa

spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: expense-api

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

This example targets average CPU utilization of 70%.

For CPU-based HPA to work, the cluster needs suitable resource requests and a working metrics pipeline, commonly metrics-server.

## 19.3 Resource Requests and Limits

Example:

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"

  limits:
    cpu: "1000m"
    memory: "512Mi"
```

Meaning:

- CPU request: 0.25 CPU cores.
- CPU limit: 1 CPU core.
- Memory request: 256 MiB.
- Memory limit: 512 MiB.

Requests influence scheduling.

Limits constrain resource usage.

A container exceeding its memory limit may be terminated with an out-of-memory condition.

---

# 20. CI/CD Fundamentals

## 20.1 What Is CI?

CI stands for Continuous Integration.

Developers frequently integrate code changes into a shared repository.

An automated pipeline can:

1. Install dependencies.
2. Run linting.
3. Run tests.
4. Build the application.
5. Report failures.

## 20.2 What Is CD?

CD can mean Continuous Delivery or Continuous Deployment.

### Continuous Delivery

The application is automatically built and tested, but production deployment may require manual approval.

### Continuous Deployment

Every qualifying change that passes the pipeline can be deployed automatically to production.

## 20.3 CI/CD Architecture

```text
Developer
    |
    v
Git Push
    |
    v
GitHub Repository
    |
    v
CI/CD Pipeline
    |
    +---- Install Dependencies
    |
    +---- Run Tests
    |
    +---- Build Application
    |
    +---- Build Docker Image
    |
    +---- Push Image to Registry
    |
    +---- Deploy Application
    |
    v
Production
```

Benefits:

- Faster delivery.
- Repeatable deployments.
- Early bug detection.
- Reduced manual errors.
- Consistent release processes.

---

# 21. GitHub Actions

## 21.1 What Is GitHub Actions?

GitHub Actions is an automation platform integrated into GitHub.

It supports workflows triggered by repository events.

Official documentation:

[GitHub Actions Documentation](https://docs.github.com/en/actions?utm_source=chatgpt.com)

Common triggers:

- Push.
- Pull request.
- Release.
- Scheduled execution.
- Manual workflow dispatch.

## 21.2 GitHub Actions Workflow Structure

Create:

```text
.github/
  workflows/
    ci.yml
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
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Run Tests
        run: npm test

      - name: Build Application
        run: npm run build
```

### Important Concepts

| Term | Meaning |
|---|---|
| Workflow | Complete automation process |
| Event | Trigger that starts a workflow |
| Job | Group of steps executed on a runner |
| Step | Individual task |
| Action | Reusable workflow component |
| Runner | Machine executing the workflow |

## 21.3 Environment Variables and Secrets

GitHub Actions supports repository and environment secrets.

Example:

```yaml
env:
  NODE_ENV: production
```

Access a secret:

```yaml
env:
  API_TOKEN: ${{ secrets.API_TOKEN }}
```

Never print secret values into logs.

Use environment protection rules and deployment approvals where appropriate.

---

# 22. Docker Build and Push Pipeline

A common production workflow is:

1. Test the application.
2. Build the Docker image.
3. Authenticate with a container registry.
4. Push the image.
5. Deploy the image.

Common container registries:

- Docker Hub.
- Amazon Elastic Container Registry (ECR).
- GitHub Container Registry (GHCR).
- Azure Container Registry.

Official documentation:

[GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry?utm_source=chatgpt.com)

## 22.1 Example GitHub Actions Docker Workflow

```yaml
name: Docker Build

on:
  push:
    branches:
      - main

jobs:
  docker:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```

For production, consider tagging images with immutable identifiers such as commit SHAs rather than relying exclusively on `latest`.

Also pin third-party GitHub Actions to verified full commit SHAs when stronger supply-chain protection is required.

---

# 23. Infrastructure as Code

## 23.1 What Is Infrastructure as Code?

Infrastructure as Code (IaC) means defining and managing infrastructure through machine-readable configuration.

Instead of manually creating:

- Virtual machines.
- Networks.
- Databases.
- Storage.
- Security rules.

You describe the desired infrastructure in code.

### Manual Infrastructure

```text
Developer
   |
   v
Cloud Console
   |
   +---- Create VM
   |
   +---- Create Database
   |
   +---- Create Network
   |
   +---- Configure Security
```

### Infrastructure as Code

```text
Terraform Configuration
          |
          v
    Terraform CLI
          |
          v
      Cloud API
          |
          v
   Infrastructure
```

Benefits:

- Reproducibility.
- Version control.
- Automation.
- Consistency.
- Change review.
- Easier environment management.

---

# 24. Terraform Fundamentals

## 24.1 What Is Terraform?

Terraform is an Infrastructure as Code tool.

It allows you to define infrastructure declaratively.

Official documentation:

[Terraform Documentation](https://developer.hashicorp.com/terraform/docs?utm_source=chatgpt.com)

Terraform supports multiple providers, including AWS, Azure and Google Cloud.

## 24.2 Terraform Workflow

The typical workflow is:

```text
Write Configuration
        |
        v
terraform init
        |
        v
terraform fmt
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

### Important Commands

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

Destroy managed infrastructure:

```bash
terraform destroy
```

**Warning:** `terraform destroy` can delete real infrastructure and associated resources. Never run it against a production workspace without a deliberate review.

## 24.3 Terraform Configuration Example

Example file:

```text
main.tf
```

A minimal AWS provider configuration:

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
```

This configures the AWS provider for the Mumbai region.

## 24.4 Create an AWS S3 Bucket

```hcl
resource "aws_s3_bucket" "app_storage" {
  bucket = "my-expense-tracker-storage-unique-id"
}
```

The bucket name must be globally unique.

Initialize and preview:

```bash
terraform init
terraform plan
```

Create:

```bash
terraform apply
```

## 24.5 Terraform State

Terraform maintains a state file that records the infrastructure it manages.

Default local state file:

```text
terraform.tfstate
```

The state file may contain sensitive infrastructure information.

Do not commit it to a public Git repository.

For team environments, use a secure remote backend with state locking where supported.

Common remote-state options include:

- AWS S3 with appropriate state-locking configuration.
- Terraform Cloud.
- Other supported remote backends.

---

# 25. Deployment Strategies

Deploying a new application version without causing unnecessary downtime is an important production responsibility.

There are several deployment strategies.

## 25.1 Rolling Deployment

A rolling deployment gradually replaces old application instances with new ones.

Example:

```text
Version 1: 4 Pods

Step 1:
Old Old Old New

Step 2:
Old Old New New

Step 3:
Old New New New

Step 4:
New New New New
```

Advantages:

- Gradual replacement.
- No need to replace all instances simultaneously.
- Supported directly by Kubernetes Deployments.

Disadvantages:

- Old and new versions coexist temporarily.
- Database changes must support compatibility during rollout.

## 25.2 Blue-Green Deployment

Blue-green deployment maintains two production environments.

- Blue: Current version.
- Green: New version.

Architecture:

```text
             Load Balancer
                   |
                   v
               Blue App
              Version 1

               Green App
              Version 2
```

Initially, traffic goes to Blue.

After validating Green, traffic switches.

### Advantages

- Fast rollback.
- New version can be tested before receiving production traffic.
- Clear separation between releases.

### Disadvantages

- Requires additional infrastructure.
- Database compatibility is important.
- Switching traffic must be carefully coordinated.

## 25.3 Canary Deployment

A canary deployment gradually exposes a new version to a small percentage of traffic.

Example:

```text
100% Traffic
     |
     v
Version 1

Canary Release:

95% Traffic -> Version 1
 5% Traffic -> Version 2
```

If the new version performs well, increase its traffic.

```text
80% -> Version 1
20% -> Version 2

50% -> Version 1
50% -> Version 2

0% -> Version 1
100% -> Version 2
```

Advantages:

- Limits initial exposure.
- Allows real-world validation.
- Helps detect regressions.

Disadvantages:

- Requires traffic-routing capabilities.
- Monitoring must be reliable.
- Session and data compatibility need attention.

## 25.4 Deployment Strategy Comparison

| Strategy | Main Idea | Rollback |
|---|---|---|
| Rolling | Gradually replace instances | Roll back to previous revision |
| Blue-Green | Switch traffic between environments | Switch traffic back |
| Canary | Gradually increase new-version traffic | Reduce or remove canary traffic |

---

# 26. Graceful Shutdown

Cloud-native applications should shut down cleanly.

When a container or process receives a termination signal, it should:

1. Stop accepting new requests.
2. Allow active requests to complete.
3. Close database connections.
4. Close Redis connections.
5. Finish or safely hand off background work.
6. Exit within the configured shutdown period.

Example:

```typescript
import express from "express";

const app = express();

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

async function shutdown(signal: string) {
  console.log(`${signal} received`);

  server.close(async (error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }

    try {
      // Close database connection.
      // Close Redis connection.
      // Release other resources.

      console.log("Graceful shutdown completed");
    } catch (shutdownError) {
      console.error(shutdownError);
      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
```

In a production implementation, also enforce a shutdown timeout so that the process cannot wait indefinitely.

---

# 27. Production Logging

## 27.1 What Is Centralized Logging?

Centralized logging collects logs from multiple services into one system.

Example:

```text
Node.js API
     |
     v
Docker Container
     |
     v
Log Collector
     |
     v
Centralized Logging
     |
     v
Search and Dashboard
```

Popular solutions include:

- ELK Stack (Elasticsearch, Logstash, Kibana).
- OpenSearch.
- Grafana Loki.
- Datadog Logs.

## 27.2 Structured Logging

Instead of plain text:

```typescript
console.log("User logged in");
```

Use structured logs:

```typescript
console.log({
  event: "user_login",
  userId: 101,
  timestamp: new Date().toISOString(),
});
```

For production Node.js applications, libraries such as Pino are useful.

Official documentation:

[Pino Documentation](https://getpino.io/?utm_source=chatgpt.com)

### Why Structured Logging?

It makes logs easier to:

- Search.
- Filter.
- Aggregate.
- Analyze.
- Correlate across services.

Never log passwords, authentication tokens, secret keys or sensitive personal data unnecessarily.

---

# 28. Production Monitoring

Production monitoring should cover application health and infrastructure health.

Important metrics:

| Category | Metrics |
|---|---|
| Application | Request rate, errors, latency |
| CPU | Utilization and saturation |
| Memory | RSS, heap usage, OOM events |
| Database | Query duration, connection pool usage |
| Redis | Memory, latency, hit rate |
| Containers | Restarts, resource usage |
| Kubernetes | Pod health, replica availability |
| Network | Latency, packet loss, throughput |

### Example Monitoring Architecture

```text
                Applications
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
        API        Database      Redis
          |           |           |
          +-----------+-----------+
                      |
                      v
               Metrics Collector
                      |
                      v
                 Prometheus
                      |
                      v
                   Grafana
                      |
                      v
                 Dashboards
```

Monitoring should also include alerting.

Examples:

- API error rate exceeds threshold.
- Database connections are exhausted.
- Memory usage remains unusually high.
- Pods repeatedly restart.
- p95 latency exceeds the service objective.

---

# 29. High Availability

## 29.1 What Is High Availability?

High availability means designing systems to remain operational despite certain component failures.

Consider:

```text
              Load Balancer
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Server 1  Server 2  Server 3
```

If Server 1 fails, the remaining servers can continue serving traffic.

### Common Techniques

- Multiple application instances.
- Load balancing.
- Database replication.
- Multiple availability zones.
- Health checks.
- Automated recovery.
- Redundant networking.
- Managed infrastructure.

## 29.2 Single Point of Failure

A Single Point of Failure (SPOF) is a component whose failure can make the entire system unavailable.

Example:

```text
Application Servers
       |
       v
Single Database
```

If the only database becomes unavailable, the application may stop functioning.

High-availability architecture attempts to reduce such dependencies.

---

# 30. Fault Tolerance

## 30.1 What Is Fault Tolerance?

Fault tolerance is the ability of a system to continue operating when certain components fail.

Common techniques:

### 1. Retries

Retry temporary failures with limits and backoff.

### 2. Timeouts

Prevent requests from waiting indefinitely.

### 3. Circuit Breaker

Temporarily stop calling a failing dependency.

### 4. Fallback

Return an alternative response when a dependency is unavailable.

### 5. Bulkhead

Isolate resources so that one failing component does not consume all system capacity.

## 30.2 Circuit Breaker Pattern

The circuit breaker has three primary states.

| State | Meaning |
|---|---|
| Closed | Requests are allowed |
| Open | Requests are blocked temporarily |
| Half-Open | Limited test requests are allowed |

Architecture:

```text
              Request
                 |
                 v
           Circuit Breaker
                 |
          +------+------+
          |      |      |
          v      v      v
        Closed  Open  Half-Open
          |      |      |
          v      v      v
       Service Fallback Test Request
```

Example:

An Expense Tracker calls an external currency conversion API.

If the external API repeatedly fails, the circuit breaker temporarily prevents additional calls.

This helps avoid wasting resources on a dependency that is currently unavailable.

---

# 31. Backup and Disaster Recovery

## 31.1 What Is a Backup?

A backup is a copy of important data that can be used to recover from data loss.

Common backup types:

- Full backup.
- Incremental backup.
- Differential backup.
- Snapshot.

## 31.2 What Is Disaster Recovery?

Disaster Recovery (DR) is the process of restoring systems after major failures.

Examples:

- Data center failure.
- Database corruption.
- Accidental data deletion.
- Ransomware incident.
- Cloud-region outage.

## 31.3 RPO and RTO

These are two important disaster recovery concepts.

### RPO – Recovery Point Objective

RPO defines the maximum acceptable amount of data loss measured in time.

Example:

```text
RPO = 15 minutes
```

The organization aims to recover data to a point no more than 15 minutes before the incident.

### RTO – Recovery Time Objective

RTO defines the maximum acceptable time to restore service.

Example:

```text
RTO = 2 hours
```

The organization aims to restore service within two hours.

### Comparison

| RPO | RTO |
|---|---|
| Measures acceptable data loss | Measures acceptable downtime |
| Time-based recovery point | Time-based restoration target |
| Focuses on data | Focuses on service availability |

A backup strategy should include restoration testing. A backup that has never been successfully restored is not a sufficiently validated recovery plan.

---

# 32. Production Operations

Production operations involve maintaining applications after deployment.

Important responsibilities include:

1. Application deployment.
2. Infrastructure monitoring.
3. Incident management.
4. Log analysis.
5. Performance optimization.
6. Security patching.
7. Backup verification.
8. Capacity planning.
9. Scaling.
10. Disaster recovery.

## 32.1 SLI, SLO and SLA

These terms are essential in Site Reliability Engineering.

### SLI – Service Level Indicator

A measurement of service performance.

Example:

```text
Percentage of successful HTTP requests.
```

### SLO – Service Level Objective

A target for an SLI.

Example:

```text
99.9% successful requests over 30 days.
```

### SLA – Service Level Agreement

A formal agreement with users or customers describing service commitments and possible consequences when they are not met.

### Comparison

| Term | Meaning |
|---|---|
| SLI | What you measure |
| SLO | What you target |
| SLA | What you formally promise |

---

# 33. Real-World Project: Deploy an Expense Tracker Using Docker and Kubernetes

Let's combine the concepts from this phase.

### Technology Stack

```text
Frontend:
Next.js

Backend:
Node.js
Express.js
TypeScript

Database:
MySQL

Cache:
Redis

Containerization:
Docker

Orchestration:
Kubernetes

CI/CD:
GitHub Actions

Infrastructure:
AWS

Monitoring:
Prometheus + Grafana
```

## 33.1 Development Architecture

```text
              Next.js Frontend
                     |
                     v
              Express Backend
                     |
          +----------+----------+
          |                     |
          v                     v
        MySQL                 Redis
```

## 33.2 Container Architecture

```text
                Docker Host
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Frontend     API       MySQL
                     |
                     v
                   Redis
```

## 33.3 Production Architecture

```text
                    Users
                      |
                      v
                 CDN / DNS
                      |
                      v
                Load Balancer
                      |
                      v
               Kubernetes Cluster
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Frontend      API       Background
        Pods         Pods       Workers
                      |
             +--------+--------+
             |                 |
             v                 v
          Managed DB       Managed Redis
             |
             v
         Backup Storage
```

## 33.4 CI/CD Workflow

```text
Developer Pushes Code
         |
         v
      GitHub
         |
         v
    GitHub Actions
         |
    +----+----+
    |         |
    v         v
   Tests    Build
    |         |
    +----+----+
         |
         v
    Docker Image
         |
         v
    Container Registry
         |
         v
    Kubernetes Deploy
         |
         v
    Production
         |
         v
    Monitoring
```

## 33.5 Suggested Deployment Milestones

| Milestone | Task |
|---|---|
| 1 | Create a production-ready Node.js application |
| 2 | Create a Dockerfile |
| 3 | Build and run the Docker image |
| 4 | Add MySQL and Redis through Docker Compose |
| 5 | Configure persistent database storage |
| 6 | Push the Docker image to GHCR |
| 7 | Create Kubernetes Deployment |
| 8 | Create Kubernetes Service |
| 9 | Configure ConfigMaps and Secrets |
| 10 | Configure health probes |
| 11 | Configure autoscaling |
| 12 | Create GitHub Actions CI/CD pipeline |
| 13 | Deploy to a Kubernetes cluster |
| 14 | Configure logging and monitoring |
| 15 | Test rolling updates and recovery |

---

# 34. Common Cloud-Native Mistakes

| Mistake | Better Approach |
|---|---|
| Using `latest` for all production image deployments | Use controlled, immutable image tags |
| Running containers as root | Use non-root users |
| Storing passwords inside Dockerfiles | Inject secrets securely at runtime |
| Using containers without persistent storage for databases | Use persistent volumes or managed databases |
| Assuming `depends_on` means a service is ready | Use health checks and retry logic |
| Using localhost for container-to-container communication | Use service/container DNS names |
| Deploying without health checks | Configure liveness and readiness probes |
| Ignoring CPU and memory limits | Define appropriate resource requests and limits |
| Running all services in one container | Separate independently managed services |
| Creating microservices unnecessarily | Start with a modular monolith when appropriate |
| Committing Terraform state files | Use secure remote state |
| Deploying without automated tests | Implement CI pipelines |
| Using mutable deployment tags without release control | Deploy immutable image references |
| Ignoring graceful shutdown | Handle SIGTERM and resource cleanup |
| Taking backups without testing recovery | Perform restoration drills |
| Monitoring only server uptime | Monitor application-level SLOs and dependencies |

---

# 35. Interview Questions and Answers

## Basic to Intermediate

### Q1. What is cloud computing?

Cloud computing provides computing resources such as servers, databases, storage and networking over the internet.

### Q2. What is the difference between IaaS, PaaS and SaaS?

IaaS provides infrastructure, PaaS provides a managed application platform, and SaaS provides ready-to-use software.

### Q3. What is cloud-native development?

It is an approach to building applications that use cloud infrastructure, automation, containers, distributed services and scalable architecture.

### Q4. What is the Twelve-Factor App methodology?

It is a methodology describing 12 principles for building maintainable, portable and deployable web applications.

### Q5. What is a monolithic architecture?

An architecture in which application functionality is packaged and deployed as one application unit.

### Q6. What are microservices?

Microservices divide an application into smaller, independently deployable services organized around business capabilities.

### Q7. What is Docker?

Docker is a platform used to build, distribute and run applications in containers.

### Q8. What is a Docker image?

A Docker image is a read-only template used to create containers.

### Q9. What is a Docker container?

A container is an isolated running or stopped instance created from an image.

### Q10. What is a Dockerfile?

A Dockerfile contains instructions for building a Docker image.

### Q11. What is the difference between RUN and CMD?

`RUN` executes commands during image building. `CMD` defines the default command when the container starts.

### Q12. What is EXPOSE?

`EXPOSE` documents the port that a containerized application intends to use. It does not publish that port on the host.

### Q13. What is .dockerignore?

It excludes unnecessary files from the Docker build context.

### Q14. What is a multi-stage Docker build?

It uses multiple build stages to separate build dependencies from runtime dependencies and produce a cleaner final image.

### Q15. What is Docker Compose?

Docker Compose defines and manages multi-container applications using a YAML configuration.

## Advanced

### Q16. What is a Docker volume?

A Docker volume provides persistent storage independent of a container's writable layer.

### Q17. What is Docker networking?

Docker networking allows containers and external systems to communicate through configured network interfaces.

### Q18. What is Kubernetes?

Kubernetes is a container orchestration platform used to deploy, scale and manage containerized applications.

### Q19. What is a Kubernetes Pod?

A Pod is the smallest deployable unit in Kubernetes and can contain one or more containers.

### Q20. What is a Deployment?

A Deployment manages replicated Pods and their desired application state.

### Q21. What is a Kubernetes Service?

A Service provides a stable network endpoint for accessing a group of Pods.

### Q22. What is Ingress?

Ingress defines HTTP/HTTPS routing rules for access to services within a Kubernetes cluster.

### Q23. What is ConfigMap?

A ConfigMap stores non-sensitive configuration data.

### Q24. What is a Kubernetes Secret?

A Secret stores sensitive configuration data, but requires appropriate access controls and encryption-at-rest configuration for production security.

### Q25. What is the difference between liveness and readiness probes?

Liveness determines whether an application should be restarted. Readiness determines whether it should receive traffic.

### Q26. What is HPA?

Horizontal Pod Autoscaler automatically adjusts the number of Pod replicas according to configured metrics.

### Q27. What is CI?

Continuous Integration automates integration checks, testing and building when code changes are submitted.

### Q28. What is CD?

Continuous Delivery or Continuous Deployment automates the process of preparing or releasing application changes.

### Q29. What is GitHub Actions?

GitHub Actions is a workflow automation platform integrated into GitHub.

### Q30. What is Infrastructure as Code?

IaC means defining and managing infrastructure using machine-readable configuration files.

### Q31. What is Terraform?

Terraform is an Infrastructure as Code tool that provisions and manages infrastructure using declarative configuration.

### Q32. What is Terraform state?

Terraform state records the infrastructure resources Terraform manages and their associated information.

### Q33. What is a rolling deployment?

A deployment strategy that gradually replaces old application instances with new instances.

### Q34. What is blue-green deployment?

A strategy that maintains two environments and switches traffic from the old environment to the new one.

### Q35. What is canary deployment?

A strategy that initially exposes a new application version to a small percentage of traffic.

### Q36. What is graceful shutdown?

Graceful shutdown allows an application to stop accepting new work, finish active operations and release resources before exiting.

### Q37. What is high availability?

High availability is the ability of a system to remain operational despite certain component failures.

### Q38. What is fault tolerance?

Fault tolerance is the ability of a system to continue functioning when components fail.

### Q39. What is a circuit breaker?

A resilience pattern that temporarily blocks calls to a failing dependency to prevent cascading failures.

### Q40. What is disaster recovery?

Disaster recovery is the process of restoring application services and data after major incidents.

### Q41. What is RPO?

Recovery Point Objective defines the maximum acceptable amount of data loss measured in time.

### Q42. What is RTO?

Recovery Time Objective defines the maximum acceptable time to restore service.

### Q43. What is the difference between SLI, SLO and SLA?

SLI is a service measurement, SLO is a target for that measurement, and SLA is a formal service commitment.

### Q44. Why are containers useful in production?

They provide consistent application packaging, isolation and portability across environments.

### Q45. Why is Kubernetes useful?

It automates container scheduling, deployment, scaling, service discovery and recovery.

---

# 36. Practical Exercises

Complete these exercises to gain hands-on cloud-native development experience.

## Exercise 1: Dockerize a Node.js Application

Create a TypeScript Express application.

Requirements:

1. Create a Dockerfile.
2. Build a Docker image.
3. Run the container.
4. Map port 3000.
5. Check container logs.
6. Stop and restart the container.

## Exercise 2: Multi-Stage Docker Build

Create a production Dockerfile.

Requirements:

1. Use a build stage.
2. Compile TypeScript.
3. Install production dependencies separately.
4. Copy only runtime files.
5. Run as a non-root user.

## Exercise 3: Docker Compose

Create a complete Expense Tracker environment.

Requirements:

1. Node.js API container.
2. MySQL container.
3. Redis container.
4. Docker network.
5. Persistent MySQL volume.
6. Health check for MySQL.
7. Environment-based configuration.

## Exercise 4: Docker Networking

Create two containers.

Requirements:

1. Run an API container.
2. Run a MySQL container.
3. Connect them through a Docker network.
4. Configure the API to use the MySQL container name.
5. Verify database connectivity.

## Exercise 5: Kubernetes Deployment

Deploy your API to Kubernetes.

Requirements:

1. Create a Deployment.
2. Configure three replicas.
3. Create a Service.
4. Expose the application.
5. Check Pod status.
6. Inspect application logs.

## Exercise 6: Kubernetes Health Checks

Implement:

```text
/health/live
/health/ready
```

Configure:

- Liveness probe.
- Readiness probe.
- Startup probe.

Test what happens when an application becomes unhealthy.

## Exercise 7: Kubernetes Autoscaling

Configure HPA.

Requirements:

1. Configure CPU requests.
2. Configure CPU limits.
3. Create an HPA.
4. Generate controlled test traffic.
5. Observe replica scaling.

## Exercise 8: GitHub Actions

Create a CI pipeline.

Requirements:

1. Trigger on push.
2. Install dependencies.
3. Run ESLint.
4. Run unit tests.
5. Build the TypeScript application.
6. Fail the pipeline when a step fails.

## Exercise 9: Docker Registry

Create a Docker publishing workflow.

Requirements:

1. Build the Docker image.
2. Authenticate with GHCR.
3. Push the image.
4. Tag it using the Git commit SHA.
5. Verify the image in the registry.

## Exercise 10: Terraform

Create an AWS infrastructure configuration.

Requirements:

1. Configure AWS provider.
2. Create an S3 bucket.
3. Run `terraform init`.
4. Run `terraform fmt`.
5. Run `terraform validate`.
6. Review `terraform plan`.
7. Apply the configuration.
8. Inspect the created resource.

Use a non-production account and understand any costs before creating resources.

## Exercise 11: Deployment Strategies

Implement and compare:

- Rolling deployment.
- Blue-green deployment.
- Canary deployment.

Record how each strategy handles application failures and rollback.

## Exercise 12: Production Operations

Create a production-readiness checklist for your Expense Tracker.

Include:

- Health checks.
- Monitoring.
- Centralized logging.
- Database backups.
- Graceful shutdown.
- Secret management.
- Resource limits.
- Alerting.
- Recovery procedures.

---

# 37. Phase 61 Completion Checklist

| No. | Topic | Status |
|---:|---|---|
| 1 | Cloud Computing Fundamentals | ☐ |
| 2 | IaaS, PaaS and SaaS | ☐ |
| 3 | Cloud-Native Architecture | ☐ |
| 4 | Twelve-Factor App | ☐ |
| 5 | Monolithic Architecture | ☐ |
| 6 | Microservices Architecture | ☐ |
| 7 | Docker Fundamentals | ☐ |
| 8 | Docker Images and Containers | ☐ |
| 9 | Docker Architecture | ☐ |
| 10 | Docker Commands | ☐ |
| 11 | Dockerfile | ☐ |
| 12 | Docker Image Optimization | ☐ |
| 13 | Multi-Stage Builds | ☐ |
| 14 | Docker Volumes | ☐ |
| 15 | Docker Networking | ☐ |
| 16 | Docker Compose | ☐ |
| 17 | Container Security | ☐ |
| 18 | Kubernetes Architecture | ☐ |
| 19 | Kubernetes Pods | ☐ |
| 20 | Kubernetes Deployments | ☐ |
| 21 | Kubernetes Services | ☐ |
| 22 | Ingress | ☐ |
| 23 | ConfigMaps | ☐ |
| 24 | Secrets | ☐ |
| 25 | Health Checks | ☐ |
| 26 | Horizontal Pod Autoscaling | ☐ |
| 27 | CI/CD Fundamentals | ☐ |
| 28 | GitHub Actions | ☐ |
| 29 | Docker Build Pipelines | ☐ |
| 30 | Container Registries | ☐ |
| 31 | Infrastructure as Code | ☐ |
| 32 | Terraform | ☐ |
| 33 | Terraform State | ☐ |
| 34 | Rolling Deployment | ☐ |
| 35 | Blue-Green Deployment | ☐ |
| 36 | Canary Deployment | ☐ |
| 37 | Graceful Shutdown | ☐ |
| 38 | Centralized Logging | ☐ |
| 39 | Production Monitoring | ☐ |
| 40 | High Availability | ☐ |
| 41 | Fault Tolerance | ☐ |
| 42 | Circuit Breaker | ☐ |
| 43 | Backup and Disaster Recovery | ☐ |
| 44 | RPO and RTO | ☐ |
| 45 | SLI, SLO and SLA | ☐ |
| 46 | Production Operations | ☐ |

---

# 38. Final Summary

Phase 61 introduced the infrastructure and deployment technologies used to run modern TypeScript applications in production.

Remember these important distinctions:

| Technology | Primary Responsibility |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container development and deployment |
| Kubernetes | Container orchestration |
| GitHub Actions | CI/CD automation |
| Terraform | Infrastructure provisioning |
| Prometheus | Metrics collection |
| Grafana | Monitoring dashboards |
| Pino | Structured application logging |
| AWS | Cloud infrastructure |
| Redis | Caching and supporting distributed workloads |

**Professional principle:** Writing an application is only one part of software engineering. You must also know how to package, deploy, scale, secure, monitor and recover it.

---

# 39. Next Phase Preview

## Phase 62: Advanced TypeScript – Microservices Architecture, API Gateway, Inter-Service Communication, gRPC, Message Brokers, Event-Driven Architecture and Distributed Systems

Upcoming topics:

1. Microservices Architecture Deep Dive.
2. Domain-Driven Design (DDD).
3. Bounded Contexts.
4. Service Decomposition.
5. API Gateway Pattern.
6. Service Discovery.
7. Inter-Service Communication.
8. Synchronous vs Asynchronous Communication.
9. REST-Based Service Communication.
10. gRPC Fundamentals.
11. Protocol Buffers.
12. Message Brokers.
13. RabbitMQ.
14. Apache Kafka.
15. Event-Driven Architecture.
16. Event Producers and Consumers.
17. Eventual Consistency.
18. Saga Pattern.
19. Distributed Transactions.
20. Outbox Pattern.
21. CQRS.
22. Event Sourcing.
23. Idempotent Consumers.
24. Message Ordering.
25. Retry and Dead Letter Queues.
26. Distributed Caching.
27. Distributed Locking.
28. Service Resilience.
29. Distributed Tracing.
30. Microservices Security.
31. API Versioning.
32. Service-Level Observability.
33. Distributed System Design.
34. Microservices Testing.
35. Production Microservices Architecture.

**Phase 61 completed.** When you're ready, say **"OK, Phase 62"** to continue.
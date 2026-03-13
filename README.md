> **English** | [한국어](docs/ko/README.md)

# nest-mono

A monolithic architecture template based on NestJS. Uses a movie ticketing domain as an example to validate various concepts and techniques of layered architecture.

## Documentation

- [Design Guide](docs/en/design-guide.md) — System architecture, design principles
- [Domain Glossary](docs/en/glossary.md) — Domain term definitions
- [Entity Design](docs/en/designs/entities.md) — Entity attributes, relationships, ER diagram
- [Showtime Creation](docs/en/designs/showtime-creation.md) — Showtime creation flow
- [Ticket Purchase](docs/en/designs/tickets-purchase.md) — Ticket purchase flow
- [Decisions](docs/en/decisions.md) — Technical decision rationale
- [Development Setup](docs/en/development.md) — Environment files, Dev Container, VS Code configuration

## Tech Stack

| Category           | Technology                 |
| ------------------ | -------------------------- |
| **Framework**      | NestJS 11                  |
| **Language**       | TypeScript 5               |
| **Database**       | MongoDB (Mongoose)         |
| **Cache / Queue**  | Redis (BullMQ)             |
| **Events**         | EventEmitter2              |
| **Object Storage** | MinIO (S3-compatible)      |
| **Auth**           | JWT + Passport             |
| **Testing**        | Jest + Testcontainers      |
| **Build**          | Webpack                    |
| **Container**      | Docker (multi-stage build) |

## Getting Started

### Prerequisites

- Node.js 24+
- Docker & Docker Compose

### 1. Install Dependencies

```bash
npm ci
```

### 2. Start Infrastructure

```bash
npm run infra:reset
```

To run with admin consoles and monitoring dashboards (mongo-express, RedisInsight, Grafana):

```bash
npm run infra:gui
```

### 3. Run Tests

```bash
npm test
```

## Scripts

| Script                | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `npm run build`       | Production build                                                     |
| `npm run start`       | Run the built application                                            |
| `npm run debug`       | Run in watch mode for development                                    |
| `npm test`            | Run unit tests (with coverage)                                       |
| `npm run test:e2e`    | Run E2E tests (auto-restart infra + app)                             |
| `npm run lint`        | TypeScript type check, ESLint, Prettier check                        |
| `npm run format`      | ESLint auto-fix and Prettier formatting                              |
| `npm run infra:reset` | Reset infrastructure (down + up + wait)                              |
| `npm run infra:gui`   | Run infra with admin consoles (mongo-express, RedisInsight, Grafana) |
| `npm run apps:reset`  | Reset app services (down + up + wait)                                |

## Testing

### Unit Tests

Uses [Testcontainers](https://testcontainers.com/) to spin up real MongoDB, Redis, and MinIO containers for testing.

```bash
npm test

# Test a specific service only
TEST_ROOT=src/apps/__tests__/cores npm test
```

### E2E Tests

Runs the full infrastructure and application via Docker Compose, then validates scenarios through the HTTP API. Requires `curl` and `jq`.

```bash
npm run test:e2e
```

## Project Structure

```
src/
├── apps/
│   ├── gateway/          # HTTP API controllers, authentication
│   ├── applications/     # Business logic services (BullMQ)
│   ├── cores/            # Domain models, repositories
│   ├── infrastructures/  # External service integrations (payments, files)
│   ├── shared/           # Common config, business rules (Rules), pipes, middleware
│   └── __tests__/        # Unit/integration tests
├── libs/
│   ├── common/           # Common libraries (logging, DB, cache)
│   └── testlib/          # Test utilities
├── tests/e2e/            # E2E test specs
└── infra/local/          # Local infrastructure Docker Compose
```

## Key Concepts

### Layered Architecture

Code is separated into four layers: Gateway, Applications, Cores, and Infrastructures. Each layer has non-overlapping responsibilities. ESLint `no-restricted-imports` enforces unidirectional dependency flow and prevents circular dependencies.

### HTTP Layer

Cross-cutting concerns such as authentication, request validation, and logging are handled in the Gateway layer's HTTP controllers. Internal services can focus solely on business logic without awareness of these concerns.

### Async Job Processing

Long-running tasks like batch showtime creation are enqueued to BullMQ and respond immediately. Failed jobs are automatically retried, and progress status is delivered to clients via events.

### Event-Driven Architecture

Events such as ticket purchases are published via EventEmitter2. Publishers are unaware of subscribers, enabling loose coupling. Adding new subscribers requires no changes to publisher code.

### Repository Pattern

Mongoose queries are abstracted into common repositories so every service accesses data in the same way. Error handling, pagination, and transaction logic are centralized, reducing duplication and maintaining consistency.

### Clustered Infrastructure

MongoDB replica sets and Redis clusters are configured even in the local environment to develop and test with the same topology as production. This allows early detection of cluster synchronization and failover issues that do not surface on single-node setups.

### Health Check

Provides HTTP health check endpoints integrated with Docker health checks. Container orchestrators use these to detect service status and automatically restart unhealthy containers.

### Testing Strategy

Tests use Testcontainers to spin up real MongoDB, Redis, and MinIO containers. Using real infrastructure instead of mocks allows verifying behaviors like transactions, indexes, and TTL as-is. E2E tests run the full stack via Docker Compose and validate scenarios at the HTTP API level.

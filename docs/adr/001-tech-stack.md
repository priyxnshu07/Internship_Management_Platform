# ADR 001: Technology Stack

## Status: Accepted

## Backend
- Node.js + Express (or NestJS for enterprise structure)
- PostgreSQL (primary DB)
- Redis (sessions + caching)
- JWT + RBAC middleware

## Frontend  
- React + TypeScript
- TailwindCSS
- React Query (server state)

## DevOps & Infrastructure
- Docker + Docker Compose (local)
- Kubernetes (k8s) for orchestration
- Helm charts for deployment
- GitHub Actions (CI/CD)

## Monitoring & Observability
- Prometheus + Grafana (metrics)
- Loki (log aggregation)
- OpenTelemetry (tracing)
- Sentry (error tracking)

## Scalability
- Horizontal pod autoscaling (HPA) in k8s
- DB read replicas
- Redis caching layer
- CDN for static assets

## Rationale
Chosen for enterprise alignment, team familiarity, and OSS tooling.

# Internship Management Platform

A full-stack internship management system built with Node.js, Express, PostgreSQL, Redis, and React.

## Quick Start

```bash
# 1. Start Database and Redis
docker-compose up -d

# 2. Setup and Start Backend
cd backend
npm install
npm start

# 3. Setup and Start Frontend
cd frontend
npm install
npm run dev
```

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@intern.dev` | `admin123` |
| Mentor 1 | `mentor1@intern.dev` | `mentor123` |
| Mentor 2 | `mentor2@intern.dev` | `mentor123` |
| Intern 1 | `intern1@intern.dev` | `intern123` |
| Intern 2 | `intern2@intern.dev` | `intern123` |
| Intern 3 | `intern3@intern.dev` | `intern123` |

## Dashboards

### Intern Dashboard
Interns can view their assigned tasks, update task status (Todo, In Progress, Done), submit daily standups, and view their latest performance evaluations.

### Mentor Dashboard
Mentors can assign new tasks to interns, submit performance evaluations, and monitor intern progress through a comprehensive overview table that includes task completion stats and last standup dates.

### Admin Dashboard
Admins have access to global statistics (total interns, mentors, tasks) and a user management system to add new users (Interns, Mentors, or Admins) and view existing ones.

## Tech Stack
- **Backend:** Node.js, Express, PostgreSQL, Redis, JWT
- **Frontend:** React, TypeScript, Vite, TanStack Query, Axios
- **DevOps:** Docker, Docker Compose

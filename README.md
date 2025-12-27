# GearGuard - Maintenance Tracker

> The Ultimate Maintenance Management System built for the Odoo Hackathon

## Tech Stack

- **Frontend**: React.js 18 + Tailwind CSS 3.x
- **Backend**: Java 17 + Spring Boot 3.x
- **Database**: PostgreSQL
- **Authentication**: JWT

## Quick Start

### Prerequisites

- Node.js 18+
- Java 17+
- PostgreSQL 14+
- Maven 3.8+

### Database Setup

```sql
CREATE DATABASE gearguard;
```

### Backend Setup

```bash
cd gearguard-backend
mvn spring-boot:run
```

Backend runs on: http://localhost:8088

### Frontend Setup

```bash
cd gearguard-frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## User Roles

| Role | Access Level | Can Create Users |
|------|-------------|------------------|
| ADMIN | Full access | All roles |
| MANAGER | Teams & Requests | Technician, User |
| TECHNICIAN | Own tasks | None |
| USER | Report issues | None |

## First Time Setup

1. Open http://localhost:5173
2. Create admin account (first user only)
3. Login as admin to create other users

## Project Structure

```
OdooHackthon/
├── gearguard-backend/
│   ├── src/main/java/com/gearguard/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── pom.xml
│
└── gearguard-frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   └── pages/
    └── package.json
```

## Features

- Equipment tracking with health scores
- Maintenance team management
- Kanban board with drag & drop
- Calendar view for scheduled maintenance
- Role-based access control
- Dark mode support
- JWT authentication

## Team

Built with ❤️ for the Odoo Hackathon

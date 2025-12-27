<p align="center">
  <img src="gearguard-frontend/public/gearguard.svg" width="100" alt="GearGuard Logo">
</p>

<h1 align="center">GearGuard</h1>
<h3 align="center">The Ultimate Maintenance Tracker</h3>

<p align="center">
  <strong>A comprehensive maintenance management system for tracking assets and managing maintenance requests</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Swagger-API-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Workflows](#workflows)

---

## Overview

**GearGuard** is a full-stack maintenance management system designed to help organizations track their assets (machines, vehicles, computers) and manage maintenance requests efficiently.

<table>
  <tr>
    <td align="center"><img src="https://img.icons8.com/fluency/48/wrench.png" width="40"><br><strong>Equipment</strong><br>What needs maintenance</td>
    <td align="center"><img src="https://img.icons8.com/fluency/48/conference-call.png" width="40"><br><strong>Teams</strong><br>Who performs maintenance</td>
    <td align="center"><img src="https://img.icons8.com/fluency/48/clipboard-list.png" width="40"><br><strong>Requests</strong><br>The work to be done</td>
  </tr>
</table>

---

## Features

### <img src="https://img.icons8.com/fluency/24/box.png"> Equipment Management

| Feature | Description |
|---------|-------------|
| Asset Tracking | Name, serial number, category, location |
| Assignment | Department and employee ownership |
| Health Score | Track equipment condition (0-100%) |
| Warranty | Purchase date and warranty expiry tracking |
| QR Codes | Scannable codes for quick equipment lookup |
| Status | Active, Maintenance, Inactive states |

### <img src="https://img.icons8.com/fluency/24/conference-call.png"> Team Management

| Feature | Description |
|---------|-------------|
| Specialized Teams | Create teams (Mechanics, Electricians, IT Support) |
| Team Members | Assign technicians to teams |
| Team Lead | Designate team leaders |
| Color Coding | Visual team identification |
| Performance | Track completed vs active requests |

### <img src="https://img.icons8.com/fluency/24/maintenance.png"> Maintenance Requests

| Feature | Description |
|---------|-------------|
| Request Types | Corrective (breakdowns) & Preventive (routine) |
| Priority Levels | Low, Medium, High, Critical |
| Kanban Board | Drag-and-drop workflow management |
| Stage Tracking | New → In Progress → Repaired → Scrap |
| Auto-Fill | Equipment selection auto-fills team |
| Overdue Detection | Visual indicators for overdue requests |
| Scrap Logic | Auto-marks equipment inactive when scrapped |

### <img src="https://img.icons8.com/fluency/24/calendar.png"> Calendar View

| Feature | Description |
|---------|-------------|
| Visual Scheduling | See all scheduled maintenance on calendar |
| Click-to-Create | Create requests by clicking dates |
| Color-coded Events | Different colors for event types |

### <img src="https://img.icons8.com/fluency/24/graph-report.png"> Reports & Analytics

| Feature | Description |
|---------|-------------|
| Dashboard Stats | Real-time metrics and KPIs |
| Equipment Reports | Health scores, status breakdown |
| Request Analytics | By type, priority, team |
| Export | PDF and Excel downloads |

### <img src="https://img.icons8.com/fluency/24/new-post.png"> Email Notifications

| Notification | When | Recipients |
|--------------|------|------------|
| Assignment Alert | Technician assigned to request | Assigned technician |
| Overdue Alert | Every hour (if overdue exists) | Admins & Managers |
| Daily Digest | 8:00 AM daily | Managers & Technicians |

### <img src="https://img.icons8.com/fluency/24/lock.png"> Security & Access

| Feature | Description |
|---------|-------------|
| JWT Authentication | Secure token-based auth |
| Role-Based Access | Admin, Manager, Technician, User |
| Protected Routes | Role-specific page access |

### <img src="https://img.icons8.com/fluency/24/time-machine.png"> Audit Logs

| Feature | Description |
|---------|-------------|
| Activity Tracking | All CRUD operations logged |
| User Attribution | Who made what changes |
| Timestamps | When changes occurred |

---

## Tech Stack

### Backend

<p>
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white">
  <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white">
</p>

| Technology | Purpose |
|------------|---------|
| Spring Data JPA | Database ORM |
| JWT | Token Authentication |
| ZXing | QR Code Generation |
| Apache POI | Excel Export |
| OpenPDF | PDF Generation |
| SpringDoc OpenAPI | API Documentation |

### Frontend

<p>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
</p>

| Technology | Purpose |
|------------|---------|
| React Router | Navigation |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| @hello-pangea/dnd | Drag & Drop |
| FullCalendar | Calendar View |
| Chart.js | Data Visualization |

---

## Getting Started

### Prerequisites

<p>
  <img src="https://img.shields.io/badge/Java-17+-ED8B00?style=flat-square&logo=openjdk&logoColor=white">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Maven-3.8+-C71A36?style=flat-square&logo=apache-maven&logoColor=white">
</p>

### 1. Database Setup

```sql
CREATE DATABASE gearguard;
```

### 2. Backend Setup

```bash
cd gearguard-backend

# Configure database in application.properties
# Update: spring.datasource.url, username, password

# Run the application
mvn spring-boot:run
```

> Backend starts at: `http://localhost:8088`

### 3. Frontend Setup

```bash
cd gearguard-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

> Frontend starts at: `http://localhost:5173`

### 4. Initial Setup

1. Access `http://localhost:5173`
2. First user registration creates Admin account
3. Create departments, teams, and equipment
4. Add team members and start creating requests

---

## Project Structure

```
GearGuard/
│
├── gearguard-backend/
│   └── src/main/java/com/gearguard/
│       ├── config/          # Security, CORS, JWT
│       ├── controller/      # REST endpoints
│       ├── dto/             # Data Transfer Objects
│       ├── model/           # JPA Entities
│       ├── repository/      # Database access
│       └── service/         # Business logic
│
└── gearguard-frontend/
    └── src/
        ├── api/             # API clients
        ├── components/      # UI components
        ├── context/         # React Context
        └── pages/           # Page components
            ├── admin/
            ├── manager/
            ├── technician/
            ├── user/
            └── shared/
```

---

## API Documentation

<p>
  <a href="http://localhost:8088/swagger-ui.html">
    <img src="https://img.shields.io/badge/Swagger%20UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger UI">
  </a>
</p>

> Access Swagger UI at: `http://localhost:8088/swagger-ui.html`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |
| `GET` | `/api/equipment` | List all equipment |
| `POST` | `/api/equipment` | Create equipment |
| `GET` | `/api/teams` | List all teams |
| `GET` | `/api/requests` | List all requests |
| `PUT` | `/api/requests/{id}/stage` | Update request stage |
| `GET` | `/api/calendar` | Get calendar events |
| `GET` | `/api/qrcode/equipment/{id}` | Generate QR code |
| `GET` | `/api/audit-logs` | Get audit logs |

---

## User Roles

<table>
  <tr>
    <th>Role</th>
    <th>Icon</th>
    <th>Capabilities</th>
  </tr>
  <tr>
    <td><strong>Admin</strong></td>
    <td><img src="https://img.icons8.com/fluency/24/admin-settings-male.png"></td>
    <td>Full access - Users, departments, teams, equipment, requests, audit logs</td>
  </tr>
  <tr>
    <td><strong>Manager</strong></td>
    <td><img src="https://img.icons8.com/fluency/24/manager.png"></td>
    <td>Manage teams, assign requests, view reports, create technicians/users</td>
  </tr>
  <tr>
    <td><strong>Technician</strong></td>
    <td><img src="https://img.icons8.com/fluency/24/worker-male.png"></td>
    <td>View assigned requests, update status, record work duration</td>
  </tr>
  <tr>
    <td><strong>User</strong></td>
    <td><img src="https://img.icons8.com/fluency/24/user-male-circle.png"></td>
    <td>Report equipment issues, track own request status</td>
  </tr>
</table>

---

## Workflows

### Flow 1: The Breakdown (Corrective)

```mermaid
graph LR
    A[User Reports Issue] --> B[Request Created - NEW]
    B --> C[Team Auto-Filled]
    C --> D[Technician Assigned]
    D --> E[Stage: IN_PROGRESS]
    E --> F[Repair Complete]
    F --> G[Stage: REPAIRED]
```

### Flow 2: Routine Checkup (Preventive)

```mermaid
graph LR
    A[Manager Creates Request] --> B[Sets Scheduled Date]
    B --> C[Appears on Calendar]
    C --> D[Technician Completes]
    D --> E[Stage: REPAIRED]
```

---

## UI Features

| Feature | Description |
|---------|-------------|
| <img src="https://img.icons8.com/fluency/20/moon-symbol.png"> Dark/Light Mode | Toggle between themes |
| <img src="https://img.icons8.com/fluency/20/smartphone-tablet.png"> Responsive | Works on desktop and mobile |
| <img src="https://img.icons8.com/fluency/20/synchronize.png"> Real-time | Instant UI feedback |
| <img src="https://img.icons8.com/fluency/20/drag-and-drop.png"> Drag & Drop | Kanban request management |
| <img src="https://img.icons8.com/fluency/20/animation.png"> Animations | Smooth Framer Motion transitions |
| <img src="https://img.icons8.com/fluency/20/appointment-reminders.png"> Notifications | Toast success/error feedback |

---

## Email Configuration

Configure SMTP in `application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge">
  <img src="https://img.shields.io/badge/For-Odoo%20Hackathon-714B67?style=for-the-badge">
</p>
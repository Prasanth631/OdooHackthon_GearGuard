<p align="center">
  <img src="gearguard-frontend/public/gearguard.svg" width="80" alt="GearGuard Logo">
</p>

<h1 align="center">🔧 GearGuard</h1>
<h3 align="center">The Ultimate Maintenance Tracker</h3>

<p align="center">
  <strong>A comprehensive maintenance management system for tracking assets and managing maintenance requests</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?style=flat-square&logo=spring-boot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18.2.0-61dafb?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)

---

## 🎯 Overview

**GearGuard** is a full-stack maintenance management system designed to help organizations track their assets (machines, vehicles, computers) and manage maintenance requests efficiently. The system connects three core entities:

| Entity | Description |
|--------|-------------|
| **Equipment** | What needs maintenance |
| **Teams** | Who performs the maintenance |
| **Requests** | The work to be done |

---

## ✨ Features

### 📦 Equipment Management
- **Complete Asset Tracking** - Name, serial number, category, location
- **Department & Employee Assignment** - Track who owns/uses equipment
- **Maintenance Team Assignment** - Default team for each equipment
- **Health Score Monitoring** - Track equipment condition (0-100%)
- **Warranty Tracking** - Purchase date and warranty expiry
- **QR Code Generation** - Scannable codes for quick equipment lookup
- **Status Management** - Active, Maintenance, Inactive states

### 👥 Team Management
- **Specialized Teams** - Create teams (Mechanics, Electricians, IT Support)
- **Team Members** - Assign technicians to teams
- **Team Lead Designation** - Mark team leaders
- **Color Coding** - Visual team identification
- **Performance Tracking** - View completed vs active requests per team

### 🔧 Maintenance Requests
- **Request Types**
  - 🔴 **Corrective** - Unplanned repairs (breakdowns)
  - 🟣 **Preventive** - Scheduled maintenance (routine checkups)
- **Priority Levels** - Low, Medium, High, Critical
- **Kanban Board** - Drag-and-drop workflow management
- **Stage Tracking** - New → In Progress → Repaired → Scrap
- **Auto-Fill Logic** - Equipment selection auto-fills team
- **Overdue Detection** - Visual indicators for overdue requests
- **Scrap Logic** - Auto-marks equipment as inactive when scrapped

### 📅 Calendar View
- **Visual Scheduling** - See all scheduled maintenance on calendar
- **Click-to-Create** - Create requests by clicking dates
- **Color-coded Events** - Different colors for event types

### 📊 Reports & Analytics
- **Dashboard Statistics** - Real-time metrics and KPIs
- **Equipment Reports** - Health scores, status breakdown
- **Request Analytics** - By type, priority, team
- **Export Options** - PDF and Excel downloads

### 📧 Email Notifications
- **Assignment Alerts** - Notify technicians when assigned
- **Overdue Alerts** - Hourly alerts to managers for overdue requests
- **Daily Digest** - Morning summary of pending work

### 🔐 Security & Access Control
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Admin, Manager, Technician, User
- **Protected Routes** - Role-specific page access

### 📝 Audit Logs
- **Complete Activity Tracking** - All CRUD operations logged
- **User Attribution** - Who made what changes
- **Timestamp Recording** - When changes occurred

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Java 17 | Programming Language |
| Spring Boot 3.2 | Framework |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | Database ORM |
| PostgreSQL | Database |
| JWT | Token Authentication |
| ZXing | QR Code Generation |
| Apache POI | Excel Export |
| OpenPDF | PDF Generation |
| SpringDoc OpenAPI | API Documentation |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router | Navigation |
| Axios | HTTP Client |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| @hello-pangea/dnd | Drag & Drop |
| FullCalendar | Calendar View |
| Chart.js | Data Visualization |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.8+

### Database Setup
```sql
CREATE DATABASE gearguard;
```

### Backend Setup
```bash
cd gearguard-backend

# Configure database in application.properties
# Update spring.datasource.url, username, password

# Run the application
mvn spring-boot:run
```
Backend will start at: `http://localhost:8088`

### Frontend Setup
```bash
cd gearguard-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Frontend will start at: `http://localhost:5173`

### Initial Setup
1. Access the application at `http://localhost:5173`
2. First user to register becomes an Admin
3. Create departments, teams, and equipment
4. Add team members and start creating maintenance requests

---

## 📁 Project Structure

```
GearGuard/
├── gearguard-backend/
│   └── src/main/java/com/gearguard/
│       ├── config/          # Security, CORS, JWT config
│       ├── controller/      # REST API endpoints
│       ├── dto/             # Data Transfer Objects
│       ├── model/           # JPA Entities
│       ├── repository/      # Database repositories
│       └── service/         # Business logic
│
└── gearguard-frontend/
    └── src/
        ├── api/             # Axios API clients
        ├── components/      # Reusable UI components
        ├── context/         # React Context (Auth)
        ├── pages/           # Page components by role
        │   ├── admin/       # Admin pages
        │   ├── manager/     # Manager pages
        │   ├── technician/  # Technician pages
        │   ├── user/        # User pages
        │   └── shared/      # Shared pages
        └── styles/          # CSS styles
```

---

## 📚 API Documentation

Access Swagger UI at: `http://localhost:8088/swagger-ui.html`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/equipment` | List all equipment |
| POST | `/api/equipment` | Create equipment |
| GET | `/api/teams` | List all teams |
| GET | `/api/requests` | List all requests |
| PUT | `/api/requests/{id}/stage` | Update request stage |
| GET | `/api/calendar` | Get calendar events |
| GET | `/api/qrcode/equipment/{id}` | Generate QR code |

---

## 👤 User Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access - Manage users, departments, teams, equipment, requests, audit logs |
| **Manager** | Manage teams, assign requests, view reports, create users (technician/user) |
| **Technician** | View assigned requests, update status, record work duration |
| **User** | Report equipment issues, track own request status |

---

## 🔄 Workflow

### Flow 1: The Breakdown (Corrective)
```
1. User reports issue → Request created (NEW)
2. Equipment selected → Team auto-filled
3. Manager/Technician assigns themselves
4. Work begins → Stage: IN_PROGRESS
5. Repair complete → Stage: REPAIRED
```

### Flow 2: Routine Checkup (Preventive)
```
1. Manager creates scheduled maintenance
2. Sets scheduled date
3. Request appears on Calendar
4. Technician completes on scheduled date
```

---

## 🎨 UI Features

- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on desktop and mobile
- **Real-time Updates** - Instant UI feedback
- **Drag & Drop Kanban** - Intuitive request management
- **Animated Transitions** - Smooth user experience
- **Toast Notifications** - Success/error feedback

---

## 📧 Email Configuration

Configure in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for Odoo Hackathon
</p>
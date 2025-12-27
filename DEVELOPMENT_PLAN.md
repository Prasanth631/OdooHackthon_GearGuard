# GearGuard Development Plan

## Project Overview

GearGuard is a comprehensive maintenance management system designed to track equipment, manage maintenance teams, and streamline maintenance requests.

---

## Phase 1: Authentication and Foundation
**Status: Completed**

### Features
- JWT-based authentication
- Email-based login system
- Role-based access control (ADMIN, MANAGER, TECHNICIAN, USER)
- User creation with validation
- Dark mode support
- Responsive UI with Tailwind CSS

### Technical Implementation
- Spring Security with JWT
- BCrypt password encryption
- React Context for auth state
- Protected routes

---

## Phase 2: Equipment Management
**Status: Pending**

### Features
- CRUD operations for equipment
- Equipment categories (Machinery, IT, Vehicles, Office Equipment)
- Health score tracking (0-100%)
- Department assignment
- Location tracking
- Warranty management
- Equipment status (Active, Maintenance, Inactive, Scrapped)

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/equipment | List all equipment |
| GET | /api/equipment/{id} | Get equipment details |
| POST | /api/equipment | Create equipment |
| PUT | /api/equipment/{id} | Update equipment |
| DELETE | /api/equipment/{id} | Delete equipment |

### Frontend Pages
- Equipment list with filters
- Equipment detail view
- Add/Edit equipment form
- Equipment health dashboard

---

## Phase 3: Department Management
**Status: Pending**

### Features
- Create and manage departments
- Assign department managers
- Link equipment to departments
- Department-wise equipment overview

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/departments | List departments |
| POST | /api/departments | Create department |
| PUT | /api/departments/{id} | Update department |
| DELETE | /api/departments/{id} | Delete department |

---

## Phase 4: Team Management
**Status: Pending**

### Features
- Create maintenance teams
- Add/remove team members
- Assign team leads
- Team color coding for calendar
- Team workload overview

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/teams | List teams |
| POST | /api/teams | Create team |
| PUT | /api/teams/{id} | Update team |
| POST | /api/teams/{id}/members | Add member |
| DELETE | /api/teams/{id}/members/{userId} | Remove member |

---

## Phase 5: Maintenance Requests
**Status: Pending**

### Features
- Create maintenance requests
- Request types (Corrective, Preventive)
- Priority levels (Low, Medium, High, Critical)
- Request stages (New, In Progress, Repaired, Scrap)
- Assign to team or technician
- Overdue tracking
- Request notes and history

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/requests | List requests |
| GET | /api/requests/kanban | Get requests for kanban |
| POST | /api/requests | Create request |
| PUT | /api/requests/{id} | Update request |
| PATCH | /api/requests/{id}/stage | Update stage |
| POST | /api/requests/{id}/notes | Add note |

### Frontend Features
- Kanban board with drag-and-drop
- Request detail modal
- Filtering by status, priority, team
- Overdue indicators

---

## Phase 6: Calendar and Scheduling
**Status: Pending**

### Features
- View scheduled maintenance
- Schedule preventive maintenance
- Recurring schedules
- Calendar view (month, week, day)
- Integration with requests

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/requests/calendar | Get calendar events |
| POST | /api/schedules | Create schedule |
| PUT | /api/schedules/{id} | Update schedule |

---

## Phase 7: Dashboard and Analytics
**Status: Pending**

### Features
- Real-time statistics
- Equipment health overview
- Request status breakdown
- Team performance metrics
- Overdue alerts
- Recent activity feed

### Metrics to Track
- Total equipment count
- Active requests count
- Completed requests (today/week/month)
- Overdue requests
- Equipment by status
- Requests by priority
- Team workload

---

## Phase 8: Notifications
**Status: Pending**

### Features
- In-app notifications
- Email notifications
- Notification preferences
- Mark as read functionality

### Notification Types
- New request assigned
- Request status changed
- Maintenance due reminder
- Overdue alerts
- Equipment health warnings

---

## Phase 9: Reports
**Status: Pending**

### Features
- Generate reports
- Export to PDF/Excel
- Date range filtering
- Custom report builder

### Report Types
- Equipment inventory
- Maintenance history
- Team performance
- Cost analysis

---

## Phase 10: Advanced Features
**Status: Future**

### Features
- File attachments for requests
- QR code for equipment
- Mobile app (React Native)
- API documentation (Swagger)
- Audit logs
- Backup and restore

---

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication

### Frontend
- React.js 18
- Tailwind CSS 3.x
- Framer Motion
- Recharts
- React Big Calendar
- React Router DOM

---

## Database Schema

### Core Tables
- users
- departments
- equipment
- maintenance_teams
- team_members
- maintenance_requests

### Relationships
- Equipment belongs to Department
- Equipment has assigned User
- Equipment has MaintenanceTeam
- MaintenanceRequest belongs to Equipment
- MaintenanceRequest assigned to User or Team

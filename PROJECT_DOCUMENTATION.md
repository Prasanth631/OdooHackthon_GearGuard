# GearGuard - Complete Project Documentation

## Executive Summary

GearGuard is a comprehensive **Maintenance Management System** built for the Odoo Hackathon. It enables organizations to track their assets (machines, vehicles, computers) and manage maintenance requests through a seamless workflow connecting **Equipment**, **Teams**, and **Requests**.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [Core Modules](#3-core-modules)
4. [Detailed Workflows](#4-detailed-workflows)
5. [Feature List by Module](#5-feature-list-by-module)
6. [API Endpoints](#6-api-endpoints)
7. [Database Schema](#7-database-schema)
8. [Security Implementation](#8-security-implementation)

---

## 1. System Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Single Page Application |
| **Backend** | Spring Boot 3.2 | REST API Server |
| **Database** | PostgreSQL 15 | Data Persistence |
| **Authentication** | JWT | Secure Token-Based Auth |
| **Email** | Spring Mail + Gmail SMTP | Notifications |

### Application Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Spring Boot    │────▶│   PostgreSQL    │
│   (Port 5173)   │◀────│   (Port 8088)   │◀────│   (Port 5432)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌─────────────────┐
        │               │   Gmail SMTP    │
        │               │   (Emails)      │
        │               └─────────────────┘
        ▼
┌─────────────────┐
│   User Browser  │
└─────────────────┘
```

---

## 2. User Roles & Permissions

### Role Hierarchy

```
ADMIN (Full Access)
  └── MANAGER (Team & Request Management)
        └── TECHNICIAN (Execute Maintenance)
              └── USER (Report Issues)
```

### Detailed Role Permissions

#### ADMIN (System Administrator)
| Module | Permissions |
|--------|-------------|
| Dashboard | Full statistics, system health overview |
| Users | Create, view, edit, delete all users |
| Departments | Full CRUD operations |
| Teams | Full CRUD, assign members, set leads |
| Equipment | Full CRUD, QR code generation |
| Requests | View all, assign, change status |
| Calendar | View all events, create/edit/delete |
| Reports | Generate all reports, export PDF/Excel |
| Audit Logs | View all system activity |
| Settings | System configuration |

#### MANAGER (Team Manager)
| Module | Permissions |
|--------|-------------|
| Dashboard | Team performance metrics |
| Users | Create Technicians and Users only |
| Teams | Manage assigned teams |
| Equipment | View all, edit assigned |
| Requests | Full management within scope |
| Calendar | View all, manage team events |
| Reports | Team-specific reports |

#### TECHNICIAN (Maintenance Worker)
| Module | Permissions |
|--------|-------------|
| Dashboard | Personal task overview |
| Requests | View assigned, update status/duration |
| Equipment | View assigned equipment |
| Calendar | View personal schedule |
| Profile | Edit own profile |

#### USER (Regular Employee)
| Module | Permissions |
|--------|-------------|
| Dashboard | Personal request status |
| Requests | Create new (report issues), view own |
| Equipment | View only |
| Profile | Edit own profile |

---

## 3. Core Modules

### 3.1 Authentication Module

**Login Flow:**
```
1. User enters email + password
2. Backend validates credentials
3. JWT token generated (24hr expiry)
4. Token stored in localStorage
5. All API requests include Bearer token
```

**Registration Flow:**
```
1. First user → Automatically becomes ADMIN
2. Subsequent users → Register as USER
3. ADMIN/MANAGER can create users with specific roles
```

**Features:**
- Secure password hashing (BCrypt)
- JWT token authentication
- Role-based route protection
- Session persistence

---

### 3.2 Dashboard Module

**Admin Dashboard:**
- Total users count with role breakdown
- Equipment statistics (Active/Maintenance/Inactive)
- Request overview (New/In Progress/Completed)
- Recent activity feed
- Quick action buttons

**Manager Dashboard:**
- Team performance metrics
- Active requests count
- Team member overview
- Today's schedule
- Add Technician button

**Technician Dashboard:**
- My active jobs count
- Completed today count
- Urgent tasks (High/Critical priority)
- Job list with quick actions

**User Dashboard:**
- My submitted requests
- Request status tracking
- Report new issue button
- Equipment assigned to user

---

### 3.3 Equipment Module

**Data Fields:**
| Field | Description |
|-------|-------------|
| Name | Equipment name |
| Serial Number | Unique identifier |
| Category | Machinery, IT, Vehicle, HVAC, etc. |
| Department | Owning department |
| Assigned To | Employee using the equipment |
| Maintenance Team | Default team for repairs |
| Location | Physical location |
| Purchase Date | Date of purchase |
| Warranty Expiry | Warranty end date |
| Health Score | Condition (0-100%) |
| Status | ACTIVE, MAINTENANCE, INACTIVE |
| Notes | Additional information |

**Features:**
- CRUD operations
- Filter by status/category
- Search functionality
- QR Code generation & download
- Health score tracking
- Warranty status indicator
- **Scrap Logic:** Equipment marked INACTIVE when request is scrapped

**QR Code Feature:**
```
When scanned → Opens equipment page in browser
URL Format: http://localhost:5173/admin/equipment?id={equipmentId}
```

---

### 3.4 Team Module

**Data Fields:**
| Field | Description |
|-------|-------------|
| Name | Team name |
| Description | Team purpose |
| Color | Visual identifier |
| Members | List of technicians |
| Lead | Team lead designation |

**Features:**
- Create specialized teams
- Add/remove members
- Designate team leads
- Color-coded identification
- View team statistics
- Delete with cascade (unassigns requests first)

---

### 3.5 Maintenance Request Module

**Data Fields:**
| Field | Description |
|-------|-------------|
| Subject | Brief issue description |
| Description | Detailed problem |
| Equipment | Affected equipment |
| Type | CORRECTIVE or PREVENTIVE |
| Priority | LOW, MEDIUM, HIGH, CRITICAL |
| Stage | NEW, IN_PROGRESS, REPAIRED, SCRAP |
| Assigned Team | Responsible team |
| Assigned To | Specific technician |
| Scheduled Date | Planned date |
| Estimated Duration | Expected time (hours) |
| Notes | Additional notes |
| Overdue | Auto-calculated flag |
| Completed At | Completion timestamp |

**Request Types:**
```
CORRECTIVE → Unplanned repair (breakdown)
PREVENTIVE → Scheduled maintenance (routine)
```

**Request Stages:**
```
NEW → Request created, awaiting assignment
IN_PROGRESS → Work has started
REPAIRED → Work completed successfully
SCRAP → Equipment cannot be repaired (marks equipment INACTIVE)
```

**Features:**
- Kanban board with drag-and-drop
- Auto-fill team when equipment selected
- Overdue detection and visual indicators
- Priority color coding
- Technician avatar display
- Edit/Delete actions
- Stage transition workflow

---

### 3.6 Calendar Module

**Event Types:**
| Type | Color | Description |
|------|-------|-------------|
| MAINTENANCE | Green | Scheduled maintenance |
| INSPECTION | Red | Safety inspections |
| MEETING | Purple | Team meetings |
| OTHER | Orange | Miscellaneous |

**Features:**
- Month/Week/Day views
- Click date to create event
- Drag to reschedule
- Color-coded events
- Modal for event details
- Link to maintenance requests

---

### 3.7 Reports Module

**Report Types:**
1. **Equipment Reports**
   - Health score distribution
   - Status breakdown
   - Category analysis

2. **Request Reports**
   - By type (Corrective vs Preventive)
   - By priority distribution
   - By team workload

3. **Team Reports**
   - Active vs completed requests
   - Response time metrics

**Export Options:**
- PDF download
- Excel download

---

### 3.8 Audit Logs Module

**Logged Actions:**
| Action | Description |
|--------|-------------|
| CREATE | New record created |
| UPDATE | Record modified |
| DELETE | Record removed |
| LOGIN | User authentication |

**Logged Entities:**
- Equipment
- Teams
- Requests
- Users
- Calendar Events

**Log Fields:**
- Action type
- Entity type & ID
- User who performed action
- Timestamp
- Details/description
- Old and new values

---

### 3.9 Email Notification Module

**Notification Types:**

| Trigger | Recipients | Timing |
|---------|------------|--------|
| Assignment | Assigned technician | Immediately |
| Overdue Alert | Admins & Managers | Hourly |
| Daily Digest | All Managers + Technicians | 8:00 AM daily |

**Email Templates:**
- Beautiful HTML emails with gradient headers
- Priority badges and equipment details
- Call-to-action buttons
- Professional footer

---

## 4. Detailed Workflows

### 4.1 The Breakdown Flow (Corrective Maintenance)

```
Step 1: USER reports issue
        └── Creates request with type=CORRECTIVE
        └── Selects affected equipment
        └── Team auto-filled from equipment

Step 2: Request enters NEW stage
        └── Appears on Kanban board
        └── Visible to Managers and Technicians

Step 3: Assignment
        └── Manager assigns technician OR
        └── Technician self-assigns
        └── Email notification sent to assignee

Step 4: Work begins
        └── Drag to IN_PROGRESS column
        └── Status updates logged

Step 5: Completion
        └── Record duration (hours spent)
        └── Drag to REPAIRED column
        └── Completion timestamp recorded

Alternative: SCRAP
        └── If unrepairable, move to SCRAP
        └── Equipment status → INACTIVE
        └── Note added to equipment record
```

### 4.2 Routine Checkup Flow (Preventive Maintenance)

```
Step 1: MANAGER creates scheduled request
        └── Type = PREVENTIVE
        └── Sets scheduled date
        └── Assigns team/technician

Step 2: Calendar display
        └── Request appears on calendar
        └── Color-coded by priority

Step 3: Execution day
        └── Technician sees in daily tasks
        └── Daily digest email reminder

Step 4: Completion
        └── Execute maintenance
        └── Update to REPAIRED
```

### 4.3 User Registration Flow

```
Scenario A: First User (System Setup)
        └── Register at /register
        └── Automatically assigned ADMIN role
        └── Has full system access

Scenario B: Subsequent Users
        └── Self-register → USER role
        └── Limited to issue reporting

Scenario C: Admin Creates User
        └── Admin → Create User modal
        └── Select any role
        └── Email sent with credentials

Scenario D: Manager Creates User
        └── Manager → Add Technician
        └── Can only create TECHNICIAN or USER
```

---

## 5. Feature List by Module

### Equipment Features
- [x] CRUD operations
- [x] Category filtering
- [x] Status management
- [x] Health score tracking
- [x] QR code generation
- [x] QR code preview modal
- [x] QR code download
- [x] Warranty tracking
- [x] Department assignment
- [x] Team assignment
- [x] Employee assignment
- [x] Scrap logic (auto-inactive)

### Team Features
- [x] Create teams
- [x] Edit teams
- [x] Delete teams (cascade handling)
- [x] Add members
- [x] Remove members
- [x] Set team lead
- [x] Color coding
- [x] Performance stats

### Request Features
- [x] Create requests
- [x] Edit requests
- [x] Delete requests
- [x] Kanban drag-and-drop
- [x] Auto-fill team on equipment select
- [x] Priority indicators
- [x] Overdue detection
- [x] Stage transitions
- [x] Technician avatars
- [x] Duration tracking
- [x] Scrap → Equipment inactive

### Calendar Features
- [x] Month/Week/Day views
- [x] Create events
- [x] Edit events
- [x] Delete events
- [x] Click-to-create
- [x] Color-coded types

### Notification Features
- [x] Assignment emails
- [x] Overdue alerts (hourly)
- [x] Daily digest (8 AM)
- [x] HTML email templates

### Security Features
- [x] JWT authentication
- [x] Password hashing
- [x] Role-based access
- [x] Protected routes
- [x] Token refresh

### Audit Features
- [x] Create logging
- [x] Update logging
- [x] Delete logging
- [x] User attribution
- [x] Timestamp recording
- [x] Paginated view

---

## 6. API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - User login
POST   /api/auth/create-user   - Admin/Manager create user
GET    /api/auth/users         - List all users
GET    /api/auth/me            - Current user info
```

### Equipment
```
GET    /api/equipment          - List all
GET    /api/equipment/{id}     - Get by ID
POST   /api/equipment          - Create
PUT    /api/equipment/{id}     - Update
DELETE /api/equipment/{id}     - Delete
GET    /api/equipment/categories - Get categories
GET    /api/equipment/statuses   - Get statuses
```

### Teams
```
GET    /api/teams              - List all
GET    /api/teams/{id}         - Get by ID
POST   /api/teams              - Create
PUT    /api/teams/{id}         - Update
DELETE /api/teams/{id}         - Delete
POST   /api/teams/{id}/members - Add member
DELETE /api/teams/{id}/members/{memberId} - Remove member
PUT    /api/teams/{id}/lead/{memberId}    - Set lead
```

### Requests
```
GET    /api/requests           - List all
GET    /api/requests/{id}      - Get by ID
POST   /api/requests           - Create
PUT    /api/requests/{id}      - Update
DELETE /api/requests/{id}      - Delete
PUT    /api/requests/{id}/stage - Update stage
```

### Calendar
```
GET    /api/calendar           - List events
POST   /api/calendar           - Create event
PUT    /api/calendar/{id}      - Update event
DELETE /api/calendar/{id}      - Delete event
```

### Reports
```
GET    /api/reports/dashboard  - Dashboard stats
GET    /api/reports/export/pdf - Export PDF
GET    /api/reports/export/excel - Export Excel
```

### QR Codes
```
GET    /api/qrcode/equipment/{id}          - Get QR image
GET    /api/qrcode/equipment/{id}/download - Download QR
```

### Audit Logs
```
GET    /api/audit-logs         - Paginated logs
GET    /api/audit-logs/entity/{type}/{id} - By entity
```

---

## 7. Database Schema

### Core Tables
```
users
├── id (PK)
├── email (unique)
├── password (hashed)
├── full_name
├── role (ADMIN/MANAGER/TECHNICIAN/USER)
├── department_id (FK)
├── created_at
└── updated_at

departments
├── id (PK)
├── name
├── description
├── location
└── created_at

equipment
├── id (PK)
├── name
├── serial_number (unique)
├── category
├── department_id (FK)
├── assigned_to_id (FK → users)
├── maintenance_team_id (FK)
├── default_technician_id (FK → users)
├── purchase_date
├── warranty_expiry
├── location
├── status (ACTIVE/MAINTENANCE/INACTIVE)
├── health_score (0-100)
├── notes
├── created_at
└── updated_at

maintenance_teams
├── id (PK)
├── name
├── description
├── color
└── created_at

team_members
├── id (PK)
├── team_id (FK)
├── user_id (FK)
├── is_lead (boolean)
└── joined_at

maintenance_requests
├── id (PK)
├── subject
├── description
├── equipment_id (FK)
├── type (CORRECTIVE/PREVENTIVE)
├── priority (LOW/MEDIUM/HIGH/CRITICAL)
├── stage (NEW/IN_PROGRESS/REPAIRED/SCRAP)
├── assigned_team_id (FK)
├── assigned_to_id (FK → users)
├── requested_by_id (FK → users)
├── scheduled_date
├── estimated_duration
├── completed_at
├── is_overdue (boolean)
├── notes
├── created_at
└── updated_at

calendar_events
├── id (PK)
├── title
├── description
├── event_type
├── start_date
├── end_date
├── all_day (boolean)
├── color
├── created_by_id (FK)
└── created_at

audit_logs
├── id (PK)
├── action (CREATE/UPDATE/DELETE)
├── entity_type
├── entity_id
├── user_id (FK)
├── details
├── old_value
├── new_value
└── created_at
```

---

## 8. Security Implementation

### Authentication Flow
```
1. Login Request
   └── POST /api/auth/login
   └── Body: {email, password}

2. Server Validation
   └── Find user by email
   └── Compare BCrypt hashed password
   └── If valid, generate JWT

3. JWT Token
   └── Contains: userId, email, role
   └── Signed with secret key
   └── Expires in 24 hours

4. Client Storage
   └── Token stored in localStorage
   └── User info stored in AuthContext

5. Authenticated Requests
   └── Header: Authorization: Bearer {token}
   └── JwtAuthFilter validates token
   └── Extracts user details
```

### Route Protection

**Frontend (React):**
```javascript
<ProtectedRoute roles={['ADMIN', 'MANAGER']}>
  <AdminDashboard />
</ProtectedRoute>
```

**Backend (Spring Security):**
```java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
.requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")
```

---

## Summary

GearGuard is a complete maintenance management solution featuring:

- **4 User Roles** with hierarchical permissions
- **8 Core Modules** covering all maintenance operations
- **2 Workflow Types** for corrective and preventive maintenance
- **Real-time Notifications** via email
- **Complete Audit Trail** for compliance
- **Modern UI** with dark mode and responsive design
- **RESTful API** with Swagger documentation
- **Secure Authentication** with JWT

The system successfully implements all Odoo Hackathon requirements including equipment tracking, team management, request workflows, calendar scheduling, and reporting capabilities.

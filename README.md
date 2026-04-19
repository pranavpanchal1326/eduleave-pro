# 🎓 EduLeave Pro
### College Leave Management System (MERN)

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg?logo=express)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?logo=node.js)
![Status](https://img.shields.io/badge/status-production_ready-success.svg)

**A full-stack workflow platform for academic leave governance with role-based approvals, auditability, and operational analytics.**

</div>

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Key Capabilities](#2-key-capabilities)
- [3. Role Matrix](#3-role-matrix)
- [4. System Architecture](#4-system-architecture)
  - [4.1 High-Level Block Diagram](#41-high-level-block-diagram)
  - [4.2 Request Lifecycle](#42-request-lifecycle)
  - [4.3 Data Flow](#43-data-flow)
- [5. Tech Stack](#5-tech-stack)
- [6. Project Structure](#6-project-structure)
- [7. Quick Start](#7-quick-start)
- [8. Environment Configuration](#8-environment-configuration)
- [9. API Reference](#9-api-reference)
- [10. Database Models](#10-database-models)
- [11. Security Model](#11-security-model)
- [12. Testing Strategy](#12-testing-strategy)
- [13. Deployment](#13-deployment)
- [14. Operational Guidelines](#14-operational-guidelines)
- [15. Roadmap](#15-roadmap)
- [16. Contributing](#16-contributing)
- [17. License](#17-license)
- [18. Author](#18-author)

---

## 1. Overview

**EduLeave Pro** digitizes and standardizes the full leave approval lifecycle for higher education institutions.

It provides:
- Structured leave submission for students
- Multi-stage approval routing (Faculty → HOD/Admin)
- Real-time status visibility
- Institutional analytics for decision-makers
- Secure, role-based access with auditable workflows

The platform is designed for colleges needing transparency, control, and reduced administrative overhead.

---

## 2. Key Capabilities

### Workflow & Process Control
- Multi-level leave approval with status transitions
- Role-aware visibility of records and actions
- Leave history and decision traceability

### User Experience
- Responsive interface (desktop/tablet/mobile)
- Intuitive leave form with attachments
- Clear status timeline and notifications

### Analytics & Governance
- Department and institution-wide leave insights
- Trend tracking for policy decisions
- Dashboard metrics for HOD/Admin

### Notifications
- Automated email updates for submissions and decisions
- Event-triggered messaging for approval/rejection actions

---

## 3. Role Matrix

| Role | Responsibilities | Access Scope |
|------|------------------|--------------|
| **Student** | Submit requests, view status, track leave balance | Own profile + own leave records |
| **Faculty** | Review student requests, approve/reject | Department-level request queue |
| **HOD** | Final approval decisions, oversight | Department-wide records + analytics |
| **Admin** | User/role management, global analytics, system config | Full system access |

---

## 4. System Architecture

## 4.1 High-Level Block Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                      │
│  Pages, Forms, Dashboards, Role-based UI, Axios API Calls │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON + JWT
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                  │
│  Routing, Validation, Auth Middleware, RBAC Enforcement    │
└───────────────┬────────────────────────────┬───────────────┘
                │                            │
                ▼                            ▼
┌─────────────────────────────┐   ┌──────────────────────────┐
│    BUSINESS CONTROLLERS     │   │   INTEGRATION SERVICES   │
│  auth / leaves / users      │   │  NodeMailer (email)      │
│  analytics / approvals      │   │  file upload handlers    │
└───────────────┬─────────────┘   └──────────────┬───────────┘
                │                                │
                ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 DATA LAYER (MongoDB + Mongoose)            │
│  User, Leave, Approval metadata, audit fields, indexes     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4.2 Request Lifecycle

```text
Student submits leave request
        │
        ▼
API validation + authentication
        │
        ▼
Request stored as "pending"
        │
        ├── Faculty review
        │      ├─ approve → forwarded/escalated
        │      └─ reject  → closed with reason
        │
        ▼
HOD/Admin final decision
        │
        ▼
Status updated + leave balance recalculated
        │
        ▼
Notification dispatched to student
        │
        ▼
Request visible in analytics + audit trail
```

---

## 4.3 Data Flow

```text
React Form → Axios → Express Route
      → Auth Middleware (JWT)
      → Validation Layer
      → Controller Logic
      → Mongoose Model Operation
      → MongoDB Persistence
      → Notification Service
      → JSON Response
      → UI State Refresh
```

---

## 5. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| UI | Material-UI / Bootstrap |
| State | Context API (Redux optional) |
| HTTP | Axios |
| Backend | Node.js 18, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Uploads | Multer |
| Notifications | NodeMailer |
| DevOps | Docker / docker-compose |

---

## 6. Project Structure

```text
eduleave-pro/
├── client/
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── pages/           # Route-level screens
│   │   ├── services/        # Axios services/API wrappers
│   │   ├── context/         # Global state/context providers
│   │   └── App.js
│   └── package.json
├── server/
│   ├── config/              # DB and environment config
│   ├── controllers/         # Domain/business logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── middleware/          # Auth, RBAC, validation, errors
│   ├── services/            # Mail, uploads, utility services
│   └── index.js
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 7. Quick Start

### Prerequisites
- Node.js `18+`
- npm `9+`
- MongoDB local instance or Atlas
- Git

### 1) Clone repository
```bash
git clone https://github.com/pranavpanchal1326/eduleave-pro.git
cd eduleave-pro
```

### 2) Configure environment files
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update values before running.

### 3) Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 4) Start services

**Terminal 1 (if local MongoDB):**
```bash
mongod
```

**Terminal 2 (backend):**
```bash
cd server
npm run dev
```

**Terminal 3 (frontend):**
```bash
cd client
npm start
```

Application URL: `http://localhost:3000`

---

## 8. Environment Configuration

## Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/eduleave_pro
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Client (`client/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 9. API Reference

## Auth
- `POST /api/auth/register` — Register account
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/auth/me` — Current user profile

## Leaves
- `POST /api/leaves` — Create leave request
- `GET /api/leaves` — Role-filtered leave listing
- `GET /api/leaves/:id` — Fetch single leave request
- `PUT /api/leaves/:id` — Update status / details
- `DELETE /api/leaves/:id` — Delete request (policy-dependent)

## Users (Admin)
- `GET /api/users` — List users
- `PUT /api/users/:id/role` — Change role
- `DELETE /api/users/:id` — Remove user

## Analytics (Admin/HOD)
- `GET /api/analytics/dashboard` — Dashboard metrics
- `GET /api/analytics/reports` — Reporting endpoints

---

## 10. Database Models

## User
```js
{
  name: String,
  email: String,
  password: String, // hashed
  role: 'student' | 'faculty' | 'hod' | 'admin',
  department: String,
  leaveBalance: Number,
  createdAt: Date
}
```

## Leave
```js
{
  user: ObjectId, // ref User
  leaveType: 'sick' | 'casual' | 'emergency',
  startDate: Date,
  endDate: Date,
  reason: String,
  status: 'pending' | 'approved' | 'rejected',
  approvedBy: ObjectId, // ref User
  documents: [String],
  createdAt: Date
}
```

---

## 11. Security Model

- JWT-based stateless authentication
- Password hashing with bcryptjs
- Middleware-level RBAC enforcement
- Input sanitization + schema validation
- Secure environment variable usage
- CORS restrictions by trusted client URL

---

## 12. Testing Strategy

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

### Recommended quality checks
- Unit tests for controllers/services
- Integration tests for auth + leave lifecycle
- UI tests for role-based route protection
- Validation and permission boundary tests

---

## 13. Deployment

## Docker (full stack)
```bash
docker-compose up --build
```

## Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```
Deploy generated `build/` output.

## Backend (Render/Railway/Heroku-compatible)
```bash
cd server
npm run start
```
Configure production env vars in platform dashboard.

---

## 14. Operational Guidelines

- Use MongoDB indexes for heavy query fields (`status`, `department`, `createdAt`)
- Rotate JWT secret and email credentials periodically
- Enable centralized logging for audit events
- Add rate limiting to auth routes in production
- Track email failure rates for notification reliability

---

## 15. Roadmap

- [x] Multi-role authentication and RBAC
- [x] End-to-end leave workflow
- [x] Email notification pipeline
- [x] Analytics dashboard baseline
- [ ] SMS/WhatsApp notifications
- [ ] Calendar integrations (Google/Microsoft)
- [ ] Mobile client (React Native)
- [ ] PDF exports and compliance reports
- [ ] Configurable leave policy engine
- [ ] Multi-language localization

---

## 16. Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/<name>`
3. Commit changes: `git commit -m "feat: <summary>"`
4. Push: `git push origin feature/<name>`
5. Open a pull request

Recommended commit prefixes:
- `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`

---

## 17. License

Distributed under the MIT License. See [LICENSE](LICENSE).

---

## 18. Author

**Pranav Panchal**  
GitHub: [@pranavpanchal1326](https://github.com/pranavpanchal1326)  
Location: Pimpri-Chinchwad, Maharashtra, India

---

<div align="center">

**EduLeave Pro — designed for real institutional workflow, visibility, and control.**

</div>

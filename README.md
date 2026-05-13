# 🚀 TeamFlow – Team Task Manager

> A full-stack, production-ready team task management application with Role-Based Access Control, Kanban board UI, and real-time dashboard analytics.

<!-- PROJECT BADGES -->
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Railway](https://img.shields.io/badge/Deploy-Railway-purple)

---

## 🔗 Live Demo

- **Frontend:** [frontendsprintiq.up.railway.app](https://frontendsprintiq.up.railway.app)

- **Backend API:** [sprintiq-production.up.railway.app](https://sprintiq-production.up.railway.app)


---

## ✨ Features

### Core
- 🔐 **JWT Authentication** – Secure login/register with bcrypt password hashing
- 👥 **Role-Based Access Control** – Admin and Member roles with strict enforcement
- 📁 **Project Management** – Create, update, delete projects with team members
- ✅ **Task Kanban Board** – Drag-free 3-column board (Todo → In Progress → Completed)
- 📊 **Live Dashboard** – Metrics: totals, completion rate, overdue, priority breakdown
- 🔔 **Toast Notifications** – Elegant success/error feedback
- ⚡ **React Query** – Smart caching, refetching, and loading states

### Admin Capabilities
- Create/delete projects
- Invite/add members to projects  
- Create and assign tasks to any member
- Delete tasks
- Full task editing (title, priority, assignee, due date)

### Member Capabilities
- View assigned projects
- Update task status (Todo → In Progress → Completed) for assigned tasks
- View dashboard with personal metrics

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router v6 |
| **State/Data** | React Query v5, Context API |
| **Forms** | React Hook Form, Zod validation |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL (via Railway) |
| **ORM** | Prisma v5 |
| **Auth** | JWT, bcryptjs |
| **Validation** | Zod (both frontend & backend) |
| **Deployment** | Railway (Backend + Frontend + DB) |

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Seed script with demo data
│   ├── src/
│   │   ├── controllers/           # Business logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── middlewares/           # Express middleware
│   │   │   ├── auth.middleware.ts  # JWT verify + role guard
│   │   │   ├── validate.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── notFound.middleware.ts
│   │   ├── routes/                # Route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── lib/
│   │   │   └── prisma.ts          # Prisma singleton
│   │   ├── utils/
│   │   │   └── validators.ts      # Zod schemas
│   │   └── index.ts               # Express app entry
│   ├── package.json
│   ├── tsconfig.json
│   └── railway.json
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   │   ├── AppLayout.tsx      # Main layout with sidebar
    │   │   ├── Sidebar.tsx        # Navigation sidebar
    │   │   ├── Header.tsx         # Page header
    │   │   ├── TaskCard.tsx       # Task card with actions
    │   │   ├── CreateTaskModal.tsx
    │   │   ├── CreateProjectModal.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── DashboardPage.tsx  # Analytics dashboard
    │   │   ├── ProjectsPage.tsx   # Projects grid
    │   │   ├── ProjectDetailPage.tsx # Kanban board
    │   │   └── TeamPage.tsx
    │   ├── hooks/
    │   │   ├── useAuth.ts         # Auth mutations
    │   │   ├── useProjects.ts     # Project CRUD hooks
    │   │   └── useTasks.ts        # Task + dashboard hooks
    │   ├── context/
    │   │   └── AuthContext.tsx    # Global auth state
    │   ├── lib/
    │   │   ├── api.ts             # Axios instance + interceptors
    │   │   └── utils.ts           # Helpers & formatters
    │   ├── types/
    │   │   └── index.ts           # Shared TypeScript types
    │   ├── App.tsx                # Router config
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── railway.json
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ running locally
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL URL and JWT secret

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:push

# Seed demo data (optional)
npm run db:seed

# Start development server
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env: set VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔐 Demo Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin@123 |
| Member | bob@example.com | Member@123 |
| Member | carol@example.com | Member@123 |

---

## 🌐 API Reference

### Auth Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/auth/users` | ✅ Admin | Get all users |

### Project Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | ✅ | List accessible projects |
| POST | `/api/projects` | ✅ Admin | Create project |
| GET | `/api/projects/:id` | ✅ | Get project details |
| PUT | `/api/projects/:id` | ✅ Admin | Update project |
| DELETE | `/api/projects/:id` | ✅ Admin | Delete project |

### Task Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects/:projectId/tasks` | ✅ | Get project tasks |
| POST | `/api/projects/:projectId/tasks` | ✅ Admin | Create task |
| PATCH | `/api/tasks/:taskId/status` | ✅ Assignee/Admin | Update status |
| PUT | `/api/tasks/:taskId` | ✅ Admin | Full task update |
| DELETE | `/api/tasks/:taskId` | ✅ Admin | Delete task |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/metrics` | ✅ | Get aggregated metrics |

---

## 🚀 Deploying to Railway

### Step 1: Set Up PostgreSQL
1. Create a new Railway project
2. Add a **PostgreSQL** plugin/service
3. Note the `DATABASE_URL` connection string

### Step 2: Deploy Backend
1. Create a new service → connect your GitHub repo
2. Set the root directory to `/backend`
3. Add these environment variables in Railway dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | _(from PostgreSQL plugin)_ |
| `JWT_SECRET` | _(random 64-char string)_ |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | _(your frontend Railway URL)_ |
| `PORT` | `5000` |

4. Railway auto-detects `railway.json` and runs `npm run db:migrate && npm start`

### Step 3: Deploy Frontend
1. Create another service → connect same repo
2. Set root directory to `/frontend`
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | _(your backend Railway URL)_ |

4. Railway builds with `npm run build` and serves the `dist/` folder

### Step 4: Seed Database (Optional)
Access the Railway backend service shell and run:
```bash
npm run db:seed
```

---

## 🏗️ Database Schema

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(MEMBER)  // ADMIN | MEMBER
  createdAt    DateTime @default(now())
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdBy   User     @relation(...)
  members     ProjectMember[]
  tasks       Task[]
}

model Task {
  id          String       @id @default(cuid())
  title       String
  status      TaskStatus   // TODO | IN_PROGRESS | COMPLETED
  priority    TaskPriority // LOW | MEDIUM | HIGH
  dueDate     DateTime?
  assignee    User?
  project     Project
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License – feel free to use this for commercial and personal projects.

---

<p align="center">Built with ❤️ using React, Express, and PostgreSQL</p>

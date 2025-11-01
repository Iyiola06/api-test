# DevSync AI - Backend Server

## Overview
DevSync AI is an intelligent project management and development coordination platform that integrates AI automation across the entire CI/CD chain.

## Features
- **Built-in PRD Designer** - Collaborative product requirements documentation
- **Centralized Documentation Store** - Organized document management
- **AI PRD Compliance Agent** - Automated compliance monitoring
- **Role-Based Handoff System** - Automated workflow transitions
- **Smart CI/CD Integration** - Automated deployment and monitoring
- **AI Development Insights** - Intelligent progress analysis
- **Role Dashboards** - Customized views for each team role
- **Security & Compliance** - Role-based access control
- **Analytics & Reporting** - Comprehensive project insights

## Tech Stack
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Real-time**: Socket.IO

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account
- npm >= 9.0.0

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd devsync-ai-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables
See `.env.example` for all required configuration options.

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

#### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### PRDs
- `GET /prds` - List PRDs
- `POST /prds` - Create PRD
- `GET /prds/:id` - Get PRD details
- `PUT /prds/:id` - Update PRD
- `POST /prds/:id/compliance-check` - Run compliance check

#### Documents
- `GET /documents` - List documents
- `POST /documents` - Upload document
- `GET /documents/:id` - Get document
- `DELETE /documents/:id` - Delete document

#### Tasks
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `POST /tasks/:id/handoff` - Handoff to next role

#### CI/CD
- `POST /cicd/webhooks/github` - GitHub webhook
- `POST /cicd/webhooks/gitlab` - GitLab webhook
- `GET /cicd/pipelines` - List pipelines
- `POST /cicd/deploy` - Trigger deployment

#### Analytics
- `GET /analytics/dashboard/:role` - Role-specific dashboard
- `GET /analytics/compliance` - Compliance analytics
- `GET /analytics/velocity` - Team velocity metrics

## Project Structure
```
??? config/          # Configuration files
??? controllers/     # Route controllers
??? middleware/      # Express middleware
??? models/          # MongoDB models
??? routes/          # API routes
??? services/        # Business logic
??? utils/           # Utility functions
??? validators/      # Request validation
??? uploads/         # File uploads (gitignored)
??? server.js        # Entry point
```

## User Roles
- Product Manager (PM)
- Product Owner (PO)
- Product Designer (UX/UI)
- Frontend Developer
- Backend Developer
- DevOps Engineer
- Cybersecurity Engineer
- QA Engineer
- AI/ML Engineer
- Stakeholder

## Security
- JWT-based authentication
- Role-based access control (RBAC)
- Request rate limiting
- Input validation and sanitization
- Helmet.js security headers
- CORS configuration
- Password hashing with bcrypt

## License
MIT

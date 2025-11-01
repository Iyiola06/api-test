# DevSync AI - API Examples

## Authentication

### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "backend_developer",
  "department": "Engineering"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "backend_developer"
  }
}
```

## Projects

### Create Project
```bash
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mobile App Redesign",
  "description": "Complete redesign of mobile application",
  "key": "MAR",
  "priority": "high",
  "targetEndDate": "2025-12-31",
  "tags": ["mobile", "redesign", "ui"]
}
```

### Get All Projects
```bash
GET /api/v1/projects?page=1&limit=10&status=active
Authorization: Bearer <token>
```

### Add Team Member
```bash
POST /api/v1/projects/507f1f77bcf86cd799439011/team
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439012",
  "role": "frontend_developer"
}
```

## PRDs

### Create PRD
```bash
POST /api/v1/prds
Authorization: Bearer <token>
Content-Type: application/json

{
  "project": "507f1f77bcf86cd799439011",
  "title": "User Authentication System",
  "version": "1.0.0",
  "overview": "Implement secure user authentication with JWT...",
  "objectives": [
    {
      "description": "Implement JWT-based authentication",
      "priority": "high",
      "status": "not_started"
    }
  ],
  "features": [
    {
      "name": "User Login",
      "description": "Allow users to login with email/password",
      "priority": "must_have",
      "userStories": [
        {
          "story": "As a user, I want to login with email and password",
          "acceptanceCriteria": [
            "User can enter email and password",
            "System validates credentials",
            "JWT token is returned on success"
          ],
          "estimatedEffort": 5
        }
      ]
    }
  ]
}
```

### Run Compliance Check
```bash
POST /api/v1/prds/507f1f77bcf86cd799439011/compliance-check
Authorization: Bearer <token>
```

## Tasks

### Create Task
```bash
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "project": "507f1f77bcf86cd799439011",
  "prd": "507f1f77bcf86cd799439012",
  "title": "Implement login API endpoint",
  "description": "Create POST /auth/login endpoint with validation",
  "type": "feature",
  "priority": "high",
  "assignee": "507f1f77bcf86cd799439013",
  "estimation": {
    "storyPoints": 5,
    "hours": 8
  },
  "acceptanceCriteria": [
    {
      "description": "Endpoint accepts email and password"
    },
    {
      "description": "Returns JWT token on success"
    }
  ]
}
```

### Get My Tasks
```bash
GET /api/v1/tasks?assignee=me&status=in_progress
Authorization: Bearer <token>
```

### Handoff Task
```bash
POST /api/v1/tasks/507f1f77bcf86cd799439011/handoff
Authorization: Bearer <token>
Content-Type: application/json

{
  "toRole": "qa_engineer",
  "toUser": "507f1f77bcf86cd799439014",
  "notes": "Feature completed, ready for QA testing"
}
```

## Documents

### Upload Document
```bash
POST /api/v1/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "project": "507f1f77bcf86cd799439011",
  "title": "API Design Specifications",
  "description": "Detailed API design document",
  "type": "technical_spec",
  "uploadType": "file",
  "file": <binary>,
  "tags": ["api", "design", "backend"]
}
```

### Add Document Link
```bash
POST /api/v1/documents
Authorization: Bearer <token>
Content-Type: application/json

{
  "project": "507f1f77bcf86cd799439011",
  "title": "Competitor Analysis - Slack",
  "description": "Analysis of Slack's collaboration features",
  "type": "competitor_analysis",
  "uploadType": "link",
  "url": "https://notion.so/competitor-analysis",
  "tags": ["competitor", "research"]
}
```

### Generate AI Summary
```bash
POST /api/v1/documents/507f1f77bcf86cd799439011/summarize
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Long document content here..."
}
```

## CI/CD

### Trigger Deployment
```bash
POST /api/v1/cicd/deploy
Authorization: Bearer <token>
Content-Type: application/json

{
  "project": "507f1f77bcf86cd799439011",
  "branch": "main",
  "environment": "production",
  "type": "deploy"
}
```

### Get Pipelines
```bash
GET /api/v1/cicd/pipelines?project=507f1f77bcf86cd799439011&status=success
Authorization: Bearer <token>
```

## Notifications

### Get Notifications
```bash
GET /api/v1/notifications?isRead=false&page=1&limit=20
Authorization: Bearer <token>
```

### Mark as Read
```bash
PUT /api/v1/notifications/507f1f77bcf86cd799439011/read
Authorization: Bearer <token>
```

### Mark All as Read
```bash
PUT /api/v1/notifications/read-all
Authorization: Bearer <token>
```

## Analytics

### Get Role Dashboard
```bash
GET /api/v1/analytics/dashboard/backend_developer?projectId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

### Get Velocity Metrics
```bash
GET /api/v1/analytics/velocity?projectId=507f1f77bcf86cd799439011&startDate=2025-01-01&endDate=2025-11-01
Authorization: Bearer <token>
```

### Get Compliance Analytics
```bash
GET /api/v1/analytics/compliance?projectId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

### Get Deployment Analytics
```bash
GET /api/v1/analytics/deployments?projectId=507f1f77bcf86cd799439011&days=30
Authorization: Bearer <token>
```

## WebSocket Events

### Connect and Join
```javascript
const socket = io('http://localhost:5000');

// Join user room
socket.emit('join', userId);

// Join project room
socket.emit('join-project', projectId);

// Listen for notifications
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
});

// Listen for task updates
socket.on('task-update', (taskData) => {
  console.log('Task updated:', taskData);
});
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

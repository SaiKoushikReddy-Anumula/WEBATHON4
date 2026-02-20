# API Documentation

Base URL: `http://localhost:5000/api` (Development)

All endpoints except authentication require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Sign Up
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created. Please check your email to verify your account.",
  "userId": "64abc123def456789"
}
```

---

### Verify Email
Verify user email with token sent via email.

**Endpoint:** `GET /auth/verify-email/:token`

**Response:** `200 OK`
```json
{
  "message": "Email verified successfully"
}
```

---

### Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "identifier": "johndoe",  // username or email
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456789",
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
      "name": "John Doe",
      "skills": [],
      "availability": "Available"
    }
  }
}
```

---

### Forgot Password
Request password reset OTP.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "OTP sent to email"
}
```

---

### Reset Password
Reset password using OTP.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset successful"
}
```

---

## 👤 User Endpoints

### Get Current User Profile
Get authenticated user's profile.

**Endpoint:** `GET /users/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "64abc123def456789",
  "username": "johndoe",
  "email": "john@example.com",
  "profile": {
    "name": "John Doe",
    "branch": "Computer Science",
    "year": "3rd Year",
    "bio": "Passionate developer",
    "skills": [
      {
        "name": "React",
        "proficiency": "Advanced"
      },
      {
        "name": "Node.js",
        "proficiency": "Intermediate"
      }
    ],
    "interests": ["Web Development", "AI"],
    "workExperience": [
      {
        "projectName": "E-commerce App",
        "role": "Full Stack Developer",
        "description": "Built MERN stack application",
        "duration": "3 months"
      }
    ],
    "availability": "Available"
  },
  "activeProjectCount": 2,
  "selectionFrequency": 5,
  "currentProjects": [...]
}
```

---

### Get User Profile by ID
Get any user's profile by ID.

**Endpoint:** `GET /users/profile/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK` (Same structure as above)

---

### Update Profile
Update authenticated user's profile.

**Endpoint:** `PUT /users/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "branch": "Computer Science",
  "year": "3rd Year",
  "bio": "Updated bio",
  "skills": [
    {
      "name": "React",
      "proficiency": "Advanced"
    }
  ],
  "interests": ["Web Development", "AI"],
  "availability": "Limited"
}
```

**Response:** `200 OK` (Returns updated user object)

---

### Search Users
Search users by skills and availability.

**Endpoint:** `GET /users/search`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `skills` (optional): Comma-separated skills (e.g., "React,Node.js")
- `availability` (optional): "Available", "Limited", or "Not available"

**Example:** `GET /users/search?skills=React,Node.js&availability=Available`

**Response:** `200 OK`
```json
[
  {
    "_id": "64abc123def456789",
    "username": "johndoe",
    "profile": {
      "name": "John Doe",
      "skills": [...],
      "availability": "Available"
    }
  }
]
```

---

## 📁 Project Endpoints

### Create Project
Create a new project.

**Endpoint:** `POST /projects`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "AI Chatbot Project",
  "description": "Building an intelligent chatbot using NLP",
  "category": "Hackathon",
  "teamSize": 4,
  "requiredRoles": [
    {
      "role": "Backend Developer",
      "count": 2
    },
    {
      "role": "ML Engineer",
      "count": 1
    }
  ],
  "requiredSkills": [
    {
      "skill": "Python",
      "minProficiency": "Intermediate"
    },
    {
      "skill": "Machine Learning",
      "minProficiency": "Beginner"
    }
  ],
  "deadline": "2024-12-31",
  "weeklyCommitment": "10-15 hours"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64xyz789abc123456",
  "title": "AI Chatbot Project",
  "host": "64abc123def456789",
  "members": ["64abc123def456789"],
  "status": "Open",
  ...
}
```

---

### Get All Projects
Get all projects with optional filters.

**Endpoint:** `GET /projects`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `skills` (optional): Comma-separated skills
- `role` (optional): Required role
- `category` (optional): Project category
- `status` (optional): "Open", "In Progress", "Completed"

**Example:** `GET /projects?category=Hackathon&status=Open`

**Response:** `200 OK`
```json
[
  {
    "_id": "64xyz789abc123456",
    "title": "AI Chatbot Project",
    "description": "Building an intelligent chatbot...",
    "category": "Hackathon",
    "host": {
      "_id": "64abc123def456789",
      "username": "johndoe",
      "profile": {
        "name": "John Doe"
      }
    },
    "members": [...],
    "teamSize": 4,
    "deadline": "2024-12-31T00:00:00.000Z",
    "status": "Open",
    "requiredSkills": [...],
    "requiredRoles": [...]
  }
]
```

---

### Get Project Details
Get detailed information about a specific project.

**Endpoint:** `GET /projects/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "64xyz789abc123456",
  "title": "AI Chatbot Project",
  "description": "Building an intelligent chatbot using NLP",
  "category": "Hackathon",
  "host": {
    "_id": "64abc123def456789",
    "username": "johndoe",
    "profile": {...}
  },
  "members": [...],
  "applications": [
    {
      "user": {
        "_id": "64def456ghi789012",
        "username": "janedoe",
        "profile": {...}
      },
      "status": "Pending",
      "appliedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "teamSize": 4,
  "requiredRoles": [...],
  "requiredSkills": [...],
  "deadline": "2024-12-31T00:00:00.000Z",
  "weeklyCommitment": "10-15 hours",
  "status": "Open"
}
```

---

### Update Project
Update project details (host only).

**Endpoint:** `PUT /projects/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Any fields to update)
```json
{
  "description": "Updated description",
  "status": "In Progress"
}
```

**Response:** `200 OK` (Returns updated project)

---

### Apply to Project
Apply to join a project.

**Endpoint:** `POST /projects/:id/apply`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Application submitted"
}
```

---

### Handle Application
Accept or reject an application (host only).

**Endpoint:** `POST /projects/applications/handle`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "projectId": "64xyz789abc123456",
  "userId": "64def456ghi789012",
  "action": "accept"  // or "reject"
}
```

**Response:** `200 OK`
```json
{
  "message": "Application accepted"
}
```

---

### Get Matching Suggestions
Get AI-powered candidate suggestions (host only).

**Endpoint:** `GET /projects/:id/suggestions`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "user": {
      "_id": "64def456ghi789012",
      "username": "janedoe",
      "profile": {
        "name": "Jane Doe",
        "skills": [...]
      }
    },
    "score": 0.85,
    "breakdown": {
      "skillMatch": 0.9,
      "experienceScore": 0.8,
      "fairnessPenalty": 0.95,
      "workloadPenalty": 1.0
    }
  }
]
```

---

### Get Recommendations
Get personalized project recommendations.

**Endpoint:** `GET /projects/recommendations`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "64xyz789abc123456",
    "title": "AI Chatbot Project",
    "description": "...",
    "category": "Hackathon",
    "host": {...},
    ...
  }
]
```

---

## 💼 Workspace Endpoints

### Get Workspace
Get workspace data for a project.

**Endpoint:** `GET /workspace/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "threads": [
    {
      "name": "General",
      "messages": [
        {
          "user": {
            "_id": "64abc123def456789",
            "profile": {
              "name": "John Doe"
            }
          },
          "content": "Hello team!",
          "timestamp": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  ],
  "tasks": [
    {
      "_id": "64task123",
      "title": "Setup backend",
      "description": "Initialize Node.js project",
      "assignedTo": {
        "_id": "64abc123def456789",
        "profile": {
          "name": "John Doe"
        }
      },
      "status": "In Progress",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ],
  "files": [],
  "activityLog": [
    {
      "user": {
        "_id": "64abc123def456789",
        "profile": {
          "name": "John Doe"
        }
      },
      "action": "Created task: Setup backend",
      "timestamp": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

---

### Add Task
Create a new task in workspace.

**Endpoint:** `POST /workspace/:id/tasks`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Design database schema",
  "description": "Create MongoDB schema for users and projects",
  "assignedTo": "64abc123def456789"
}
```

**Response:** `200 OK` (Returns all tasks)

---

### Update Task
Update task status or details.

**Endpoint:** `PUT /workspace/:id/tasks/:taskId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "Done"
}
```

**Response:** `200 OK` (Returns updated task)

---

### Add Message
Send a message in workspace thread.

**Endpoint:** `POST /workspace/:id/messages`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "threadName": "Backend",
  "content": "I've completed the API endpoints"
}
```

**Response:** `200 OK` (Returns thread with messages)

---

## 🔔 Notification Endpoints

### Get Notifications
Get all notifications for authenticated user.

**Endpoint:** `GET /notifications`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "64notif123",
    "recipient": "64abc123def456789",
    "type": "application",
    "title": "New Application",
    "message": "Jane Doe applied to AI Chatbot Project",
    "link": "/projects/64xyz789abc123456/applications",
    "read": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Mark as Read
Mark a notification as read.

**Endpoint:** `PUT /notifications/:id/read`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Marked as read"
}
```

---

### Mark All as Read
Mark all notifications as read.

**Endpoint:** `PUT /notifications/read-all`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "All marked as read"
}
```

---

## 💬 Interview Chat Endpoints

### Create Interview Chat
Create a private interview chat (host only).

**Endpoint:** `POST /interview`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "projectId": "64xyz789abc123456",
  "applicantId": "64def456ghi789012"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64chat123",
  "project": "64xyz789abc123456",
  "host": "64abc123def456789",
  "applicant": "64def456ghi789012",
  "messages": [],
  "status": "Active"
}
```

---

### Get Interview Chats
Get all interview chats for authenticated user.

**Endpoint:** `GET /interview`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "64chat123",
    "project": {
      "_id": "64xyz789abc123456",
      "title": "AI Chatbot Project"
    },
    "host": {...},
    "applicant": {...},
    "status": "Active"
  }
]
```

---

### Get Interview Chat Details
Get specific interview chat with messages.

**Endpoint:** `GET /interview/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "64chat123",
  "project": {...},
  "host": {...},
  "applicant": {...},
  "messages": [
    {
      "sender": "64abc123def456789",
      "content": "Hi, I'd like to discuss your application",
      "timestamp": "2024-01-15T11:00:00.000Z"
    }
  ],
  "status": "Active"
}
```

---

## 🔌 Socket.IO Events

### Client → Server

**register**
```javascript
socket.emit('register', userId);
```

**join_workspace**
```javascript
socket.emit('join_workspace', projectId);
```

**workspace_message**
```javascript
socket.emit('workspace_message', {
  projectId: '64xyz789abc123456',
  threadName: 'Backend',
  content: 'Hello team!',
  user: { _id: '64abc123', profile: { name: 'John' } }
});
```

**join_interview**
```javascript
socket.emit('join_interview', chatId);
```

**interview_message**
```javascript
socket.emit('interview_message', {
  chatId: '64chat123',
  content: 'Thanks for applying!',
  sender: '64abc123def456789'
});
```

### Server → Client

**notification**
```javascript
socket.on('notification', (notification) => {
  console.log(notification);
});
```

**new_message**
```javascript
socket.on('new_message', (data) => {
  console.log(data.threadName, data.message);
});
```

**new_interview_message**
```javascript
socket.on('new_interview_message', (data) => {
  console.log(data.sender, data.content);
});
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error message"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectIds
- Token expires based on JWT_EXPIRE env variable (default: 7 days)
- Rate limiting may apply in production
- File uploads not yet implemented (coming soon)

---

## 🧪 Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser","password":"Test123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Project","description":"Test","category":"Hackathon","teamSize":3,"deadline":"2024-12-31","weeklyCommitment":"10 hours","requiredSkills":[],"requiredRoles":[]}'
```

---

For more examples and integration guides, see the main README.md

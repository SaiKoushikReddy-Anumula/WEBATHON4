# Smart Campus Collaboration Platform

A full-stack web application that enables intelligent, fair, and sustainable team formation for campus projects, hackathons, and research initiatives.

## 🚀 Features

### Authentication System
- Sign up / Sign in with email or username
- Email verification during signup
- Forgot password with OTP via email
- JWT-based authentication
- Secure password hashing with bcrypt

### User Profile System
- Comprehensive profile management
- Skills with proficiency levels (Beginner, Intermediate, Advanced)
- Areas of interest
- Work experience tracking
- Availability status
- Active project count and selection frequency

### Project Management
- Create and manage projects
- Define required skills, roles, and team size
- Set deadlines and weekly commitment expectations
- Project categories (Hackathon, Research, Startup, Academic)
- Project status tracking (Open, In Progress, Completed)

### Intelligent Matching Engine
- AI-powered candidate suggestions
- Skill-based matching algorithm
- Experience scoring
- Fairness weighting to prevent repeated selection
- Workload balancing
- Team combination recommendations

### Application & Selection Workflow
- Apply to projects
- View applicants (for project hosts)
- Private interview chat
- Accept/reject applications
- Automatic project count updates

### Project Workspace
- Dedicated group chat with threaded discussions
- Task board (To Do / In Progress / Done)
- Activity logs
- Real-time collaboration

### Search & Discovery
- Search projects by skills, role, category
- Personalized project recommendations
- Filter by deadline and commitment level

### Real-Time Features
- Group chat with Socket.IO
- Interview chat
- Real-time notifications
- Live workspace updates

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Socket.IO Client for real-time features

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email
- Socket.IO for real-time communication

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Gmail account for email functionality

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-campus
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI` in backend `.env`

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGODB_URI` in backend `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/smart-campus
```

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS` environment variable

## 🚀 Deployment

### Backend Deployment (Render/Railway)

#### Render:
1. Create account at [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables from `.env`
6. Deploy

#### Railway:
1. Create account at [Railway](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Add environment variables
5. Deploy automatically

### Frontend Deployment (Vercel)

1. Create account at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
4. Add environment variables:
   - `REACT_APP_API_URL`: Your deployed backend URL
   - `REACT_APP_SOCKET_URL`: Your deployed backend URL
5. Deploy

### Environment Variables for Production

Update these in your deployment platforms:

**Backend:**
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Strong random string
- `EMAIL_USER`: Your email
- `EMAIL_PASS`: App password
- `CLIENT_URL`: Your deployed frontend URL

**Frontend:**
- `REACT_APP_API_URL`: Your deployed backend URL + /api
- `REACT_APP_SOCKET_URL`: Your deployed backend URL

## 📁 Project Structure

```
smart-campus-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── workspaceController.js
│   │   ├── notificationController.js
│   │   └── interviewController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Notification.js
│   │   └── InterviewChat.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── workspace.js
│   │   ├── notifications.js
│   │   └── interview.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── email.js
│   │   └── matching.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Notifications.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── ForgotPassword.js
    │   │   ├── Dashboard.js
    │   │   ├── Profile.js
    │   │   ├── CreateProject.js
    │   │   ├── ProjectDetails.js
    │   │   └── Workspace.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── socket.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    ├── package.json
    └── tailwind.config.js
```

## 🔑 Key Features Explained

### Intelligent Matching Algorithm

The matching engine uses a sophisticated scoring system:

```javascript
Total Score = (Skill Match × 0.4) + (Experience × 0.2) + (Fairness × 0.2) + (Workload × 0.2)
```

- **Skill Match**: Evaluates if candidate has required skills at minimum proficiency
- **Experience Score**: Based on past project experience
- **Fairness Penalty**: Reduces score for frequently selected users
- **Workload Penalty**: Reduces score for users with many active projects

### Real-Time Communication

Socket.IO enables:
- Live group chat in project workspaces
- Private interview chats between hosts and applicants
- Real-time notifications for applications, selections, and updates
- Live activity feeds

### Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- Email verification required before login
- OTP-based password reset (10-minute expiry)
- Protected API routes with authentication middleware

## 🧪 Testing

### Test User Flow

1. **Sign Up**: Create account → Verify email
2. **Profile**: Complete profile with skills and interests
3. **Browse**: View recommended and all open projects
4. **Apply**: Apply to projects matching your skills
5. **Create**: Create your own project
6. **Manage**: Review applications, use AI suggestions
7. **Collaborate**: Work in project workspace with team

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Register new user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### User Endpoints

- `GET /api/users/profile` - Get current user profile
- `GET /api/users/profile/:id` - Get user profile by ID
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users

### Project Endpoints

- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/recommendations` - Get personalized recommendations
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/apply` - Apply to project
- `POST /api/projects/applications/handle` - Accept/reject application
- `GET /api/projects/:id/suggestions` - Get AI candidate suggestions

### Workspace Endpoints

- `GET /api/workspace/:id` - Get workspace data
- `POST /api/workspace/:id/tasks` - Create task
- `PUT /api/workspace/:id/tasks/:taskId` - Update task
- `POST /api/workspace/:id/messages` - Send message

### Notification Endpoints

- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Smart Campus Collaboration Platform Team

## 🙏 Acknowledgments

- MongoDB for database
- Socket.IO for real-time features
- Tailwind CSS for styling
- React team for the framework
- Express.js for backend framework

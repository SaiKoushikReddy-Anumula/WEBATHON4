# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone and Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and email credentials

# Frontend (in new terminal)
cd frontend
npm install
cp .env.example .env
```

### Step 2: Configure Environment

**Backend `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-campus
JWT_SECRET=mysecretkey123
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:3000
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 3: Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 4: Test the Application

1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Create an account (use a real email for verification)
4. Check your email and verify
5. Login and explore!

## 📧 Gmail App Password Setup

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Select "Mail" and generate
5. Copy the 16-character password to `.env`

## 🗄️ MongoDB Atlas Quick Setup

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier)
4. Database Access → Add user
5. Network Access → Add IP (0.0.0.0/0 for testing)
6. Connect → Get connection string
7. Replace `<password>` in connection string
8. Add to backend `.env`

## 🎯 Key User Flows to Test

### As a Student Looking for Projects:
1. Complete your profile with skills
2. Browse recommended projects
3. Apply to projects matching your skills
4. Wait for host to accept
5. Join workspace and collaborate

### As a Project Host:
1. Create a new project
2. Define required skills and roles
3. Review applications
4. Check AI-powered candidate suggestions
5. Accept team members
6. Manage workspace (chat, tasks, activity)

## 🔧 Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify all environment variables are set

**Email not sending:**
- Verify Gmail App Password is correct
- Check 2FA is enabled on Gmail
- Ensure EMAIL_USER and EMAIL_PASS are set

**Frontend can't connect:**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Clear browser cache

**Socket.IO not working:**
- Verify REACT_APP_SOCKET_URL matches backend URL
- Check browser console for connection errors
- Ensure backend server.js has CORS configured

## 📱 Features to Explore

1. **Intelligent Matching**: Create a project and check AI suggestions
2. **Real-time Chat**: Join a workspace and test group chat
3. **Task Management**: Create and move tasks across boards
4. **Notifications**: Apply to projects and watch for real-time notifications
5. **Profile System**: Add skills with proficiency levels
6. **Search & Filter**: Search projects by skills, category, role

## 🎓 Sample Data

Create test users with different skill sets:
- User 1: React, Node.js, MongoDB (Advanced)
- User 2: Python, ML, Data Science (Intermediate)
- User 3: UI/UX, Figma, Design (Advanced)

Create diverse projects:
- Hackathon: Web app requiring React + Node.js
- Research: ML project requiring Python + Data Science
- Startup: Full-stack app requiring multiple roles

## 🚀 Next Steps

1. Customize the matching algorithm weights
2. Add more project categories
3. Implement file upload for workspace
4. Add video call integration
5. Create mobile app version
6. Add analytics dashboard

## 📞 Support

For issues or questions:
- Check README.md for detailed documentation
- Review API documentation section
- Check console logs for errors
- Verify all environment variables

Happy Collaborating! 🎉

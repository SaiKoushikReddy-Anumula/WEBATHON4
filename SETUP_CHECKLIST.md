# Setup Verification Checklist

Use this checklist to ensure your Smart Campus Collaboration Platform is properly set up and running.

## ✅ Pre-Installation Checklist

### System Requirements
- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm v6+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

### Account Setup
- [ ] MongoDB Atlas account created
- [ ] Gmail account with 2FA enabled
- [ ] Gmail App Password generated
- [ ] GitHub account (for deployment)

---

## ✅ Backend Setup Checklist

### Installation
- [ ] Navigated to `backend` directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors
- [ ] Created `.env` file from `.env.example`

### Environment Configuration
- [ ] `PORT` set (default: 5000)
- [ ] `MONGODB_URI` configured with valid connection string
- [ ] `JWT_SECRET` set to strong random string
- [ ] `JWT_EXPIRE` configured (default: 7d)
- [ ] `EMAIL_HOST` set to smtp.gmail.com
- [ ] `EMAIL_PORT` set to 587
- [ ] `EMAIL_USER` set to your Gmail address
- [ ] `EMAIL_PASS` set to Gmail App Password
- [ ] `CLIENT_URL` set to http://localhost:3000

### Database Connection
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for testing)
- [ ] Connection string tested
- [ ] Database name set to `smart-campus`

### Server Start
- [ ] Ran `npm start` or `npm run dev`
- [ ] Server started without errors
- [ ] Console shows "Server running on port 5000"
- [ ] Console shows "MongoDB connected successfully"
- [ ] No error messages in terminal

### API Testing
- [ ] Visited http://localhost:5000 in browser
- [ ] Received JSON response: `{"message": "Smart Campus Collaboration Platform API"}`
- [ ] No CORS errors in browser console

---

## ✅ Frontend Setup Checklist

### Installation
- [ ] Navigated to `frontend` directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors
- [ ] Created `.env` file from `.env.example`

### Environment Configuration
- [ ] `REACT_APP_API_URL` set to http://localhost:5000/api
- [ ] `REACT_APP_SOCKET_URL` set to http://localhost:5000

### Build Test
- [ ] Ran `npm start` successfully
- [ ] Development server started on port 3000
- [ ] Browser opened automatically
- [ ] No compilation errors

### UI Verification
- [ ] Login page loads correctly
- [ ] Signup page loads correctly
- [ ] Tailwind CSS styles applied
- [ ] No console errors in browser
- [ ] Responsive design works on mobile view

---

## ✅ Feature Testing Checklist

### Authentication Flow
- [ ] **Sign Up**
  - [ ] Can access signup page
  - [ ] Form validation works
  - [ ] Can submit signup form
  - [ ] Receives success message
  - [ ] Verification email sent
  - [ ] Email received in inbox

- [ ] **Email Verification**
  - [ ] Verification link in email works
  - [ ] Redirects to verification success page
  - [ ] User marked as verified in database

- [ ] **Login**
  - [ ] Can access login page
  - [ ] Can login with username
  - [ ] Can login with email
  - [ ] Receives JWT token
  - [ ] Redirects to dashboard
  - [ ] Cannot login without verification

- [ ] **Forgot Password**
  - [ ] Can access forgot password page
  - [ ] OTP sent to email
  - [ ] OTP received in inbox
  - [ ] Can reset password with OTP
  - [ ] Can login with new password

### Profile Management
- [ ] **View Profile**
  - [ ] Profile page loads
  - [ ] Shows user information
  - [ ] Shows statistics (active projects, selection frequency)

- [ ] **Edit Profile**
  - [ ] Can click edit button
  - [ ] All fields editable
  - [ ] Can add skills with proficiency
  - [ ] Can remove skills
  - [ ] Can update availability
  - [ ] Changes save successfully
  - [ ] Profile updates reflected immediately

### Project Management
- [ ] **Create Project**
  - [ ] Can access create project page
  - [ ] All form fields work
  - [ ] Can add required skills
  - [ ] Can add required roles
  - [ ] Form validation works
  - [ ] Project created successfully
  - [ ] Redirects to project details

- [ ] **Browse Projects**
  - [ ] Dashboard shows projects
  - [ ] Can see recommended projects
  - [ ] Can search by skills
  - [ ] Can filter by category
  - [ ] Can filter by role
  - [ ] Project cards display correctly

- [ ] **View Project Details**
  - [ ] Project details page loads
  - [ ] Shows all project information
  - [ ] Shows team members
  - [ ] Shows required skills and roles
  - [ ] Apply button visible (if not member)

- [ ] **Apply to Project**
  - [ ] Can click apply button
  - [ ] Application submitted successfully
  - [ ] Notification sent to host
  - [ ] Cannot apply twice

### Host Features
- [ ] **View Applications**
  - [ ] Can see applications tab (as host)
  - [ ] Shows pending applications
  - [ ] Shows applicant details
  - [ ] Shows applicant skills

- [ ] **AI Suggestions**
  - [ ] Can see suggestions tab (as host)
  - [ ] Shows candidate suggestions
  - [ ] Shows match scores
  - [ ] Shows score breakdown
  - [ ] Candidates ranked by score

- [ ] **Handle Applications**
  - [ ] Can accept application
  - [ ] Can reject application
  - [ ] Notification sent to applicant
  - [ ] Member added to project (on accept)
  - [ ] Active project count updated

### Workspace Features
- [ ] **Access Workspace**
  - [ ] Can access workspace (as member)
  - [ ] Workspace loads correctly
  - [ ] Shows all tabs (Chat, Tasks, Activity)

- [ ] **Group Chat**
  - [ ] Can see thread list
  - [ ] Can switch between threads
  - [ ] Can send messages
  - [ ] Messages appear in real-time
  - [ ] Messages persist after refresh

- [ ] **Task Management**
  - [ ] Can create new task
  - [ ] Task appears in "To Do" column
  - [ ] Can update task status
  - [ ] Task moves between columns
  - [ ] Activity logged

- [ ] **Activity Log**
  - [ ] Shows all workspace activities
  - [ ] Shows user who performed action
  - [ ] Shows timestamp
  - [ ] Updates in real-time

### Real-Time Features
- [ ] **Socket.IO Connection**
  - [ ] Socket connects on login
  - [ ] No connection errors in console
  - [ ] Connection maintained during session

- [ ] **Real-Time Chat**
  - [ ] Messages appear instantly
  - [ ] Works across multiple browser tabs
  - [ ] No message delay

- [ ] **Real-Time Notifications**
  - [ ] Notification bell shows count
  - [ ] New notifications appear instantly
  - [ ] Can mark as read
  - [ ] Can mark all as read
  - [ ] Notification count updates

### Search & Discovery
- [ ] **Search Projects**
  - [ ] Can search by skills
  - [ ] Can filter by category
  - [ ] Can filter by role
  - [ ] Results update correctly

- [ ] **Recommendations**
  - [ ] Shows personalized recommendations
  - [ ] Based on user skills
  - [ ] Based on user interests
  - [ ] Updates when profile changes

---

## ✅ Integration Testing

### End-to-End User Flow 1: Student Joining Project
1. [ ] Sign up as new user
2. [ ] Verify email
3. [ ] Login successfully
4. [ ] Complete profile with skills
5. [ ] Browse projects
6. [ ] Apply to matching project
7. [ ] Wait for acceptance
8. [ ] Receive notification
9. [ ] Access workspace
10. [ ] Send message in chat
11. [ ] Create a task

### End-to-End User Flow 2: Host Creating Project
1. [ ] Login as existing user
2. [ ] Click create project
3. [ ] Fill all project details
4. [ ] Add required skills
5. [ ] Add required roles
6. [ ] Submit project
7. [ ] View project details
8. [ ] Check AI suggestions
9. [ ] Receive application
10. [ ] Review applicant profile
11. [ ] Accept application
12. [ ] Access workspace
13. [ ] Collaborate with team

---

## ✅ Performance Checklist

### Backend Performance
- [ ] API responses under 500ms
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Handles multiple concurrent requests
- [ ] Socket.IO connections stable

### Frontend Performance
- [ ] Page load time under 3 seconds
- [ ] No unnecessary re-renders
- [ ] Images optimized
- [ ] Smooth animations
- [ ] Responsive on mobile

---

## ✅ Security Checklist

### Authentication Security
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens expire correctly
- [ ] Email verification required
- [ ] OTP expires after 10 minutes
- [ ] Cannot access protected routes without token

### API Security
- [ ] Protected routes require authentication
- [ ] Authorization checks work
- [ ] Cannot access other users' data
- [ ] Cannot modify other users' projects
- [ ] Input validation works

### Data Security
- [ ] No credentials in code
- [ ] Environment variables used
- [ ] .env in .gitignore
- [ ] No sensitive data in logs
- [ ] CORS configured correctly

---

## ✅ Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)

---

## ✅ Error Handling

### Backend Errors
- [ ] Invalid credentials show error
- [ ] Duplicate email shows error
- [ ] Invalid token shows error
- [ ] Database errors handled
- [ ] Email errors handled

### Frontend Errors
- [ ] Network errors show message
- [ ] Form validation errors display
- [ ] API errors show user-friendly messages
- [ ] Loading states work
- [ ] Empty states display correctly

---

## ✅ Documentation

- [ ] README.md complete and accurate
- [ ] QUICKSTART.md tested and working
- [ ] API_DOCUMENTATION.md accurate
- [ ] DEPLOYMENT.md tested
- [ ] Code comments present
- [ ] Environment variables documented

---

## ✅ Deployment Readiness

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] Production environment variables ready
- [ ] MongoDB Atlas production cluster ready

### Deployment
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Email service working

### Post-Deployment
- [ ] Production site accessible
- [ ] All features working
- [ ] Real-time features working
- [ ] Email sending working
- [ ] No errors in production logs

---

## 🎉 Final Verification

If all items are checked, congratulations! Your Smart Campus Collaboration Platform is fully set up and ready to use.

### Quick Test Commands

**Backend Health Check:**
```bash
curl http://localhost:5000
```

**Frontend Build Test:**
```bash
cd frontend && npm run build
```

**Database Connection Test:**
```bash
# Check MongoDB Atlas dashboard for active connections
```

### Common Issues & Solutions

**Issue:** MongoDB connection failed
**Solution:** Check connection string, IP whitelist, and credentials

**Issue:** Email not sending
**Solution:** Verify Gmail App Password and 2FA enabled

**Issue:** Frontend can't connect to backend
**Solution:** Check REACT_APP_API_URL and ensure backend is running

**Issue:** Socket.IO not connecting
**Solution:** Verify REACT_APP_SOCKET_URL and CORS configuration

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Review the relevant documentation section
3. Check browser console for errors
4. Check backend terminal for errors
5. Verify all environment variables
6. Ensure all services are running

---

**Happy Collaborating! 🚀**

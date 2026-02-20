# Deployment Guide

## 🌐 Production Deployment

This guide covers deploying the Smart Campus Collaboration Platform to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account
- Render/Railway account (for backend)
- Vercel account (for frontend)
- Gmail account with App Password

---

## 📦 Part 1: MongoDB Atlas Setup

### 1. Create Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project: "Smart Campus"
4. Build a cluster (Free tier M0)
5. Choose cloud provider and region

### 2. Configure Database Access

1. Database Access → Add New Database User
2. Authentication Method: Password
3. Username: `smartcampus`
4. Password: Generate secure password (save it!)
5. Database User Privileges: Read and write to any database

### 3. Configure Network Access

1. Network Access → Add IP Address
2. For production: Add your server IPs
3. For testing: Add `0.0.0.0/0` (allow from anywhere)
4. Confirm

### 4. Get Connection String

1. Clusters → Connect
2. Connect your application
3. Copy connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `smart-campus`

Example:
```
mongodb+srv://smartcampus:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smart-campus?retryWrites=true&w=majority
```

---

## 🚀 Part 2: Backend Deployment (Render)

### 1. Prepare Repository

1. Push your code to GitHub
2. Ensure `.env` is in `.gitignore`
3. Verify `package.json` has correct scripts:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 2. Deploy on Render

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. New → Web Service
4. Connect your repository
5. Configure:
   - **Name**: smart-campus-backend
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Add Environment Variables

In Render dashboard, add these environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://smartcampus:PASSWORD@cluster0.xxxxx.mongodb.net/smart-campus
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://your-frontend-url.vercel.app
```

### 4. Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://smart-campus-backend.onrender.com`

### 5. Test Backend

Visit: `https://your-backend-url.onrender.com`

You should see:
```json
{
  "message": "Smart Campus Collaboration Platform API"
}
```

---

## 🎨 Part 3: Frontend Deployment (Vercel)

### 1. Prepare Frontend

1. Ensure frontend builds successfully locally:
```bash
cd frontend
npm run build
```

2. Verify `package.json`:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import Project
4. Select your repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

### 3. Add Environment Variables

In Vercel project settings → Environment Variables:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

### 4. Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://smart-campus.vercel.app`

### 5. Update Backend CLIENT_URL

Go back to Render → Environment Variables:
- Update `CLIENT_URL` to your Vercel URL
- Redeploy backend

---

## 🔄 Alternative: Railway Deployment (Backend)

### 1. Deploy on Railway

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Select repository and backend folder

### 2. Add Environment Variables

Same as Render (see Part 2, Step 3)

### 3. Configure

Railway auto-detects Node.js and runs `npm start`

### 4. Get URL

Railway provides a URL like: `https://smart-campus-backend.up.railway.app`

---

## ✅ Post-Deployment Checklist

### Backend Verification

- [ ] API endpoint responds: `GET /`
- [ ] Health check works
- [ ] MongoDB connection successful (check logs)
- [ ] CORS configured for frontend URL
- [ ] Email sending works (test signup)

### Frontend Verification

- [ ] Site loads without errors
- [ ] Can access login/signup pages
- [ ] API calls work (check Network tab)
- [ ] Socket.IO connects (check Console)
- [ ] No CORS errors

### Full Flow Test

1. [ ] Sign up new user
2. [ ] Receive verification email
3. [ ] Verify email and login
4. [ ] Complete profile
5. [ ] Create a project
6. [ ] Browse projects
7. [ ] Apply to a project
8. [ ] Test real-time chat
9. [ ] Test notifications

---

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
```
Error: MongoServerError: bad auth
```
- Verify MongoDB username/password
- Check connection string format
- Ensure IP whitelist includes 0.0.0.0/0

**Email Not Sending:**
```
Error: Invalid login
```
- Verify Gmail App Password
- Check 2FA is enabled
- Ensure EMAIL_USER and EMAIL_PASS are correct

**CORS Errors:**
```
Access to XMLHttpRequest blocked by CORS policy
```
- Update CLIENT_URL in backend env vars
- Redeploy backend
- Clear browser cache

### Frontend Issues

**API Calls Failing:**
```
Network Error
```
- Verify REACT_APP_API_URL is correct
- Check backend is running
- Test backend URL directly

**Socket.IO Not Connecting:**
```
WebSocket connection failed
```
- Verify REACT_APP_SOCKET_URL
- Check backend Socket.IO configuration
- Ensure backend allows WebSocket connections

**Build Fails:**
```
Module not found
```
- Run `npm install` in frontend
- Check all imports are correct
- Verify all dependencies in package.json

---

## 🔐 Security Best Practices

### Production Environment Variables

1. **JWT_SECRET**: Use strong random string (32+ characters)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **MongoDB**: Use strong password, restrict IP access

3. **Email**: Use dedicated email account, rotate passwords

### Additional Security

1. Enable rate limiting on backend
2. Add helmet.js for security headers
3. Implement request validation
4. Use HTTPS only (Render/Vercel provide this)
5. Regular dependency updates: `npm audit fix`

---

## 📊 Monitoring

### Render Dashboard

- View logs: Logs tab
- Monitor performance: Metrics tab
- Check deployments: Events tab

### Vercel Dashboard

- View deployments: Deployments tab
- Check analytics: Analytics tab
- Monitor errors: Logs tab

### MongoDB Atlas

- Monitor database: Metrics tab
- Check queries: Performance Advisor
- View logs: Activity Feed

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Render and Vercel support automatic deployments:

1. Push to GitHub main branch
2. Automatic build and deploy
3. Zero downtime deployment

### Manual Deployments

**Render:**
- Dashboard → Manual Deploy → Deploy latest commit

**Vercel:**
- Dashboard → Deployments → Redeploy

---

## 📈 Scaling

### Backend Scaling (Render)

1. Upgrade to paid plan
2. Enable auto-scaling
3. Configure instance size

### Database Scaling (MongoDB Atlas)

1. Upgrade cluster tier
2. Enable auto-scaling
3. Add read replicas

### Frontend Scaling (Vercel)

- Automatic edge caching
- Global CDN distribution
- No configuration needed

---

## 💰 Cost Estimates

### Free Tier (Development/Testing)

- MongoDB Atlas: Free (M0 cluster)
- Render: Free (with limitations)
- Vercel: Free (hobby plan)
- **Total: $0/month**

### Production (Small Scale)

- MongoDB Atlas: $9/month (M10 cluster)
- Render: $7/month (starter plan)
- Vercel: Free (hobby plan)
- **Total: ~$16/month**

### Production (Medium Scale)

- MongoDB Atlas: $25/month (M20 cluster)
- Render: $25/month (standard plan)
- Vercel: $20/month (pro plan)
- **Total: ~$70/month**

---

## 🎉 Success!

Your Smart Campus Collaboration Platform is now live!

**Share your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com`

**Next Steps:**
1. Set up custom domain
2. Configure SSL certificates
3. Add monitoring and analytics
4. Implement backup strategy
5. Create user documentation

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **GitHub Issues**: Create issues in your repository

Happy Deploying! 🚀

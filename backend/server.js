require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const workspaceRoutes = require('./routes/workspace');
const notificationRoutes = require('./routes/notifications');
const interviewRoutes = require('./routes/interview');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/interview', interviewRoutes);

const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id);
    socket.userId = userId;
  });
  
  socket.on('join_workspace', (projectId) => {
    socket.join(`workspace_${projectId}`);
  });
  
  socket.on('workspace_message', async (data) => {
    try {
      const { projectId, threadName, content, user } = data;
      io.to(`workspace_${projectId}`).emit('new_message', {
        threadName,
        message: { user, content, timestamp: new Date() }
      });
    } catch (error) {
      console.error('Workspace message error:', error);
    }
  });
  
  socket.on('join_interview', (chatId) => {
    socket.join(`interview_${chatId}`);
  });
  
  socket.on('interview_message', async (data) => {
    try {
      const { chatId, content, sender } = data;
      
      const InterviewChat = require('./models/InterviewChat');
      const chat = await InterviewChat.findById(chatId);
      
      if (chat) {
        chat.messages.push({ sender, content });
        await chat.save();
        
        io.to(`interview_${chatId}`).emit('new_interview_message', {
          sender,
          content,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Interview message error:', error);
    }
  });
  
  socket.on('send_notification', (data) => {
    const { recipientId, notification } = data;
    const recipientSocket = userSockets.get(recipientId);
    
    if (recipientSocket) {
      io.to(recipientSocket).emit('notification', notification);
    }
  });
  
  socket.on('disconnect', () => {
    if (socket.userId) {
      userSockets.delete(socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Smart Campus Collaboration Platform API' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/database');
const { errorHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// API version
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DevSync AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use(`/api/${API_VERSION}/auth`, require('./routes/auth'));
app.use(`/api/${API_VERSION}/projects`, require('./routes/projects'));
app.use(`/api/${API_VERSION}/prds`, require('./routes/prds'));
app.use(`/api/${API_VERSION}/documents`, require('./routes/documents'));
app.use(`/api/${API_VERSION}/tasks`, require('./routes/tasks'));
app.use(`/api/${API_VERSION}/cicd`, require('./routes/cicd'));
app.use(`/api/${API_VERSION}/notifications`, require('./routes/notifications'));
app.use(`/api/${API_VERSION}/analytics`, require('./routes/analytics'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO for real-time features
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Join user-specific room
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  // Join project room
  socket.on('join-project', (projectId) => {
    socket.join(`project:${projectId}`);
    logger.info(`Socket ${socket.id} joined project ${projectId}`);
  });

  // Handle real-time notifications
  socket.on('notification', (data) => {
    io.to(`user:${data.userId}`).emit('notification', data);
  });

  // Handle task updates
  socket.on('task-update', (data) => {
    io.to(`project:${data.projectId}`).emit('task-update', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
server.listen(PORT, () => {
  logger.info(`DevSync AI Backend Server running in ${NODE_ENV} mode on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}/api/${API_VERSION}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

module.exports = app;

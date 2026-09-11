require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');

const { router: authRouter } = require('./routes/auth');
const applicationsRouter = require('./routes/applications');
const officerRouter = require('./routes/officer');
const policyRouter = require('./routes/policy');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend dev server, preview server, and file:// origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint (used by frontend to detect backend presence)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SparkLine SIH26092 Backend',
    database: 'SQLite (native node:sqlite)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Root summary
app.get('/api', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SparkLine SIH26092 Backend API',
    endpoints: {
      health: 'GET /api/health',
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      applications: ['POST /api/applications/submit', 'GET /api/applications/track/:refId', 'GET /api/applications/my'],
      officer: ['GET /api/officer/applications', 'PUT /api/officer/applications/:refId/status', 'GET /api/officer/stats'],
      policy: ['GET /api/policy/income-ceiling', 'PUT /api/policy/income-ceiling'],
      ai: ['POST /api/ai/chat']
    }
  });
});

// Mount modular route handlers
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/officer', officerRouter);
app.use('/api/policy', policyRouter);
app.use('/api/ai', aiRouter);

// Serve the compiled SparkLine Website directly on root http://localhost:5000/
const websiteHtmlPath = path.join(__dirname, '..', 'SparkLine_Website.html');
const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');

app.get('/', (req, res) => {
  if (fs.existsSync(websiteHtmlPath)) {
    return res.sendFile(websiteHtmlPath);
  } else if (fs.existsSync(distIndexPath)) {
    return res.sendFile(distIndexPath);
  }
  res.json({
    message: 'SparkLine Backend Server is running',
    api: 'http://localhost:5000/api/health'
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API endpoint ${req.method} ${req.originalUrl} not found` });
});

// Fallback to website for any non-API routes
app.use((req, res) => {
  if (fs.existsSync(websiteHtmlPath)) {
    return res.sendFile(websiteHtmlPath);
  }
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log(`⚡ SparkLine Full-Stack running at http://localhost:${PORT}`);
  console.log(`⚡ Web App: http://localhost:${PORT}/`);
  console.log(`⚡ API Health: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Database: sparkline.db (node:sqlite)`);
  console.log('====================================================');
});

module.exports = { app, server };
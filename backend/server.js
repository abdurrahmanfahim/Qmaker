const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { securityHeaders, generalLimiter, sanitizeInput } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(sanitizeInput);
app.use(generalLimiter);

// Routes
const authRoutes = require('./routes/auth');
const papersRoutes = require('./routes/papers');
const templatesRoutes = require('./routes/templates');

app.use('/api/auth', authRoutes);
app.use('/api/papers', papersRoutes);
app.use('/api/templates', templatesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 QMaker Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Available routes:`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/papers`);
  console.log(`   GET  /api/templates`);
});
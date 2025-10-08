const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authLimiter } = require('../middleware/security');
const router = express.Router();

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// In-memory user storage (replace with database)
const users = [];

// CSRF protection for state-changing operations
const csrfProtection = (req, res, next) => {
  const token = req.header('X-CSRF-Token');
  if (!token && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return res.status(403).json({ error: 'CSRF token required' });
  }
  next();
};

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.replace(/[<>"'&]/g, (match) => {
      const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return entities[match];
    }).trim();
  }
  return input;
};

// Register
router.post('/register', authLimiter, csrfProtection, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate and sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    
    if (!sanitizedEmail || !password || !sanitizedName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Check if user exists
    const existingUser = users.find(u => u.email === sanitizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      email: sanitizedEmail,
      password: hashedPassword,
      name: sanitizedName,
      createdAt: new Date()
    };
    
    users.push(user);
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', authLimiter, csrfProtection, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate and sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    
    if (!sanitizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = users.find(u => u.email === sanitizedEmail);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
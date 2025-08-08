const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user storage (replace with database)
const users = [];

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    };
    
    users.push(user);
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
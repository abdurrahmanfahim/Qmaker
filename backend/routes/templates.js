const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory storage (replace with database)
const templates = [
  {
    id: '1',
    name: 'Basic Math Template',
    subject: 'Mathematics',
    sections: [
      { title: 'Section A - Multiple Choice', instructions: 'Choose the correct answer' },
      { title: 'Section B - Short Questions', instructions: 'Answer in 2-3 sentences' }
    ]
  },
  {
    id: '2',
    name: 'Science Quiz Template',
    subject: 'Science',
    sections: [
      { title: 'Section A - True/False', instructions: 'Mark T for True, F for False' },
      { title: 'Section B - Fill in the blanks', instructions: 'Complete the sentences' }
    ]
  }
];

// Middleware to verify token
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

// Get all templates
router.get('/', (req, res) => {
  res.json(templates);
});

// Get single template
router.get('/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

module.exports = router;
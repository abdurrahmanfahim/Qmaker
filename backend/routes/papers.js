const express = require('express');
const router = express.Router();

// In-memory storage (replace with database)
const papers = [];

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all papers for user
router.get('/', auth, (req, res) => {
  const userPapers = papers.filter(p => p.userId === req.userId);
  res.json(userPapers);
});

// Get single paper
router.get('/:id', auth, (req, res) => {
  const paper = papers.find(p => p.id === req.params.id && p.userId === req.userId);
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  res.json(paper);
});

// Create paper
router.post('/', auth, (req, res) => {
  const paper = {
    id: Date.now().toString(),
    userId: req.userId,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  papers.push(paper);
  res.status(201).json(paper);
});

// Update paper
router.put('/:id', auth, (req, res) => {
  const paperIndex = papers.findIndex(p => p.id === req.params.id && p.userId === req.userId);
  if (paperIndex === -1) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  
  papers[paperIndex] = {
    ...papers[paperIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json(papers[paperIndex]);
});

// Delete paper
router.delete('/:id', auth, (req, res) => {
  const paperIndex = papers.findIndex(p => p.id === req.params.id && p.userId === req.userId);
  if (paperIndex === -1) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  
  papers.splice(paperIndex, 1);
  res.json({ message: 'Paper deleted successfully' });
});

module.exports = router;
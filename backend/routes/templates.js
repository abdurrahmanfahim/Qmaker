const express = require('express');
const router = express.Router();

// Predefined question templates
const templates = [
  {
    id: '1',
    name: 'Translation',
    type: 'translation',
    content: 'Translate the following text:',
    language: 'english'
  },
  {
    id: '2',
    name: 'Fill in the Blanks',
    type: 'fill_blanks',
    content: 'Fill in the blanks: The _____ is very _____.',
    language: 'english'
  },
  {
    id: '3',
    name: 'Arabic Translation',
    type: 'translation',
    content: 'ترجم النص التالي:',
    language: 'arabic'
  },
  {
    id: '4',
    name: 'Bangla Essay',
    type: 'essay',
    content: 'নিম্নলিখিত বিষয়ে একটি রচনা লিখুন:',
    language: 'bangla'
  }
];

// Get all templates
router.get('/', (req, res) => {
  const { language, type } = req.query;
  let filteredTemplates = templates;
  
  if (language) {
    filteredTemplates = filteredTemplates.filter(t => t.language === language);
  }
  
  if (type) {
    filteredTemplates = filteredTemplates.filter(t => t.type === type);
  }
  
  res.json(filteredTemplates);
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
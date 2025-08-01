class AIQuestionGenerator {
  constructor() {
    this.questionPatterns = {
      math: {
        arithmetic: ['Calculate: {a} + {b}', 'Find: {a} × {b}', 'Solve: {a} ÷ {b}'],
        algebra: ['Solve for x: {a}x + {b} = {c}', 'If x = {a}, find {b}x + {c}'],
        geometry: ['Find the area of a {shape} with {dimension} = {value}']
      },
      english: {
        grammar: ['Correct the error: "{sentence}"', 'Choose the right word: {options}'],
        vocabulary: ['Define: {word}', 'Use "{word}" in a sentence'],
        comprehension: ['Read the passage and answer: {question}']
      },
      science: {
        physics: ['What is {concept}?', 'Calculate {formula} when {variables}'],
        chemistry: ['Name the compound: {formula}', 'Balance: {equation}'],
        biology: ['Explain the function of {organ}', 'What is {process}?']
      }
    };

    this.contextData = {
      math: { numbers: [1,2,3,4,5,6,7,8,9,10], shapes: ['circle', 'square', 'triangle'] },
      english: { words: ['beautiful', 'quickly', 'important', 'necessary'] },
      science: { concepts: ['gravity', 'photosynthesis', 'evolution'] }
    };
  }

  generateQuestion(subject, difficulty = 'medium', language = 'english') {
    const subjectPatterns = this.questionPatterns[subject.toLowerCase()];
    if (!subjectPatterns) return null;

    const categories = Object.keys(subjectPatterns);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const patterns = subjectPatterns[category];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    return this.fillPattern(pattern, subject, difficulty, language);
  }

  fillPattern(pattern, subject, difficulty, language) {
    let question = pattern;
    const data = this.contextData[subject.toLowerCase()] || {};

    // Replace placeholders with actual values
    question = question.replace(/{a}/g, this.getRandomNumber(difficulty));
    question = question.replace(/{b}/g, this.getRandomNumber(difficulty));
    question = question.replace(/{c}/g, this.getRandomNumber(difficulty));
    question = question.replace(/{word}/g, this.getRandomItem(data.words));
    question = question.replace(/{shape}/g, this.getRandomItem(data.shapes));
    question = question.replace(/{concept}/g, this.getRandomItem(data.concepts));

    return {
      id: Date.now(),
      question: this.translateQuestion(question, language),
      subject,
      difficulty,
      language,
      category: 'ai-generated',
      marks: this.getMarksForDifficulty(difficulty)
    };
  }

  getRandomNumber(difficulty) {
    const ranges = {
      easy: [1, 10],
      medium: [10, 50],
      hard: [50, 100]
    };
    const [min, max] = ranges[difficulty] || ranges.medium;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomItem(array) {
    return array ? array[Math.floor(Math.random() * array.length)] : '';
  }

  getMarksForDifficulty(difficulty) {
    const marks = { easy: 2, medium: 5, hard: 10 };
    return marks[difficulty] || 5;
  }

  translateQuestion(question, language) {
    const translations = {
      arabic: {
        'Calculate:': 'احسب:',
        'Find:': 'أوجد:',
        'Solve:': 'حل:',
        'Define:': 'عرّف:',
        'What is': 'ما هو'
      },
      bangla: {
        'Calculate:': 'গণনা করুন:',
        'Find:': 'খুঁজে বের করুন:',
        'Solve:': 'সমাধান করুন:',
        'Define:': 'সংজ্ঞা দিন:',
        'What is': 'কী'
      }
    };

    if (language === 'english') return question;

    const langTranslations = translations[language];
    if (!langTranslations) return question;

    let translated = question;
    Object.entries(langTranslations).forEach(([en, trans]) => {
      translated = translated.replace(new RegExp(en, 'g'), trans);
    });

    return translated;
  }

  generateBulkQuestions(subject, count = 5, difficulty = 'medium', language = 'english') {
    const questions = [];
    for (let i = 0; i < count; i++) {
      const question = this.generateQuestion(subject, difficulty, language);
      if (question) questions.push(question);
    }
    return questions;
  }

  suggestQuestionImprovement(questionText) {
    const suggestions = [];

    if (questionText.length < 10) {
      suggestions.push('Question is too short. Add more context.');
    }

    if (!questionText.includes('?') && !questionText.includes(':')) {
      suggestions.push('Add a question mark or colon for clarity.');
    }

    if (questionText.split(' ').length > 50) {
      suggestions.push('Question is too long. Consider breaking it down.');
    }

    const hasNumbers = /\d/.test(questionText);
    const hasMath = /[+\-×÷=]/.test(questionText);
    if (hasNumbers && !hasMath) {
      suggestions.push('Consider adding mathematical operations.');
    }

    return suggestions;
  }
}

export default new AIQuestionGenerator();
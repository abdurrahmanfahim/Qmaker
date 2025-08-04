// App-wide constants
export const APP_CONFIG = {
  NAME: 'Qmaker',
  VERSION: '1.0.0',
  DESCRIPTION: 'Question Paper Builder'
};

// Language configurations
export const LANGUAGES = {
  ENGLISH: 'english',
  ARABIC: 'arabic',
  BANGLA: 'bangla',
  URDU: 'urdu'
};

// Default titles by language
export const DEFAULT_TITLES = {
  [LANGUAGES.ENGLISH]: 'Untitled Paper',
  [LANGUAGES.ARABIC]: 'ورقة أسئلة بدون عنوان',
  [LANGUAGES.BANGLA]: 'শিরোনামহীন প্রশ্নপত্র',
  [LANGUAGES.URDU]: 'بے نام سوالیہ کاغذ'
};

// Color options for paper tagging
export const PAPER_COLORS = [
  { name: 'None', value: null, bg: 'bg-transparent', border: 'border-gray-300' },
  { name: 'Red', value: 'red', bg: 'bg-red-100', border: 'border-red-300' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-100', border: 'border-blue-300' },
  { name: 'Green', value: 'green', bg: 'bg-green-100', border: 'border-green-300' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-100', border: 'border-purple-300' }
];

// Storage keys
export const STORAGE_KEYS = {
  RECENT_PAPERS: 'qmaker-recent-papers',
  VISITED: 'qmaker-visited',
  PROFILE: 'qmaker-profile',
  PAPER_PREFIX: 'qmaker-paper-'
};

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#09302f',
  PRIMARY_HOVER: '#072625',
  PRIMARY_LIGHT: '#4ade80',
  PRIMARY_LIGHT_HOVER: '#22c55e'
};
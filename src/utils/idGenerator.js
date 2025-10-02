export const generateQsnId = (language = 'en') => {
  const langCodes = {
    'english': 'en',
    'bangla': 'bn', 
    'arabic': 'ar',
    'urdu': 'ur'
  };
  
  const langCode = langCodes[language] || language;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${langCode}-${timestamp}-${random}`;
};
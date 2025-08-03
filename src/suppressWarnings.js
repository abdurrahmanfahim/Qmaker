// Suppress react-beautiful-dnd defaultProps warning
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Support for defaultProps will be removed from memo components')) {
    return;
  }
  originalError(...args);
};
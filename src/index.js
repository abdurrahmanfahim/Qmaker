import React from 'react';
import ReactDOM from 'react-dom/client';
import './suppressWarnings';
import './index.css';
import App from './App';

// Simple autofill disable
const disableAutofill = () => {
  const processInput = (input) => {
    const randomId = 'field_' + Math.random().toString(36).substring(7);
    input.setAttribute('autocomplete', 'new-password');
    input.setAttribute('data-form-type', 'other');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
  };
  
  // Process all inputs periodically
  setInterval(() => {
    document.querySelectorAll('input:not([data-processed]), textarea:not([data-processed])').forEach(input => {
      processInput(input);
      input.setAttribute('data-processed', 'true');
    });
  }, 500);
};

disableAutofill();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
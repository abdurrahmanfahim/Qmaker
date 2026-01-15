import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      try {
        const decoded = decodeURIComponent(escape(atob(item)));
        return JSON.parse(decoded);
      } catch (e) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${encodeURIComponent(key)}":`, encodeURIComponent(error.message));
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const jsonStr = JSON.stringify(valueToStore);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      window.localStorage.setItem(key, encoded);
    } catch (error) {
      console.error(`Error setting localStorage key "${encodeURIComponent(key)}":`, encodeURIComponent(error.message));
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${encodeURIComponent(key)}":`, encodeURIComponent(error.message));
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
import React, { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import cloudSync from './utils/cloudSync';
import './styles/typography.css';

function App() {
  useEffect(() => {
    cloudSync.init();
    return () => cloudSync.destroy();
  }, []);

  return <AppRouter />;
}

export default App;

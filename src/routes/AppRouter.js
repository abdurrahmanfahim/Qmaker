import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import QuestionPaper from '../pages/QuestionPaper';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/qsn/:qsnId" element={<QuestionPaper />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
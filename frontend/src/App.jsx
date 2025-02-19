import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import TeamScanner from './components/TeamScanner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan/:shopId" element={<Scanner />} />
        <Route path="/team-scan/:teamId" element={<TeamScanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
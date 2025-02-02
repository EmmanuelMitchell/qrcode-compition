import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/Dashboard"
// import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
// import Scanner from './components/Scanner';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan/:shopId" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
}


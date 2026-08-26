import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Folder names must be Capitalized to match VS Code tree
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';

export default function App() {
  const [unit, setUnit] = useState(() => localStorage.getItem('weather_unit') || 'C');
  const [theme, setTheme] = useState(() => localStorage.getItem('weather_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('weather_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('weather_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Navbar unit={unit} setUnit={setUnit} theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<Home unit={unit} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
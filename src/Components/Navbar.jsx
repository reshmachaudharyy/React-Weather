import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ unit, setUnit, theme, setTheme }) {
  return (
    <header className="navbar-container">
      <div className="nav-brand">
        <span style={{ color: '#facc15' }}>☀️</span>
        <span>WeatherPulse</span>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
          Contact
        </NavLink>
      </nav>

      <div className="nav-controls">
        <select 
          className="theme-select" 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="dark">Theme: Dark</option>
          <option value="light">Theme: Light</option>
        </select>

        <button 
          className={`control-btn ${unit === 'C' ? 'active' : ''}`}
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
        >
          °{unit}
        </button>
      </div>
    </header>
  );
}
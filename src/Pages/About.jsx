import React from 'react';

export default function About() {
  return (
    <div className="page-container">
      <h2>About WeatherPulse</h2>
      <p style={{ marginTop: '1rem', lineHeight: '1.6', opacity: 0.8 }}>
        WeatherPulse is a responsive, single-page client app built using modern web standards.
      </p>
      
      <h3 style={{ marginTop: '1.5rem' }}>Tech Stack Details</h3>
      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', lineHeight: '1.8', opacity: 0.85 }}>
        <li><strong>Framework:</strong> React 18</li>
        <li><strong>Routing:</strong> React Router v6</li>
        <li><strong>API Integration:</strong> Open-Meteo REST API</li>
        <li><strong>State & Storage:</strong> React Hooks & Browser LocalStorage</li>
      </ul>
    </div>
  );
}
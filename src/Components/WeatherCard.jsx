import React from 'react';

export default function WeatherCard({ data, unit }) {
  if (!data) return null;

  const tempCelsius = data.temp;
  const displayTemp = unit === 'F' 
    ? Math.round((tempCelsius * 9) / 5 + 32) 
    : Math.round(tempCelsius);

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h3>{data.city}, {data.country}</h3>
        <span className="weather-condition">{data.condition}</span>
      </div>
      <div className="weather-body">
        <div className="temp-display">
          <span className="temp-value">{displayTemp}</span>
          <span className="temp-unit">°{unit}</span>
        </div>
        <div className="weather-details">
          <div className="detail-item">
            <span className="label">Humidity:</span>
            <span className="value">{data.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind Speed:</span>
            <span className="value">{data.windSpeed} km/h</span>
          </div>
          <div className="detail-item">
            <span className="label">Atmospheric Pressure:</span>
            <span className="value">{data.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
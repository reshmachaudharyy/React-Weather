import React, { useState, useEffect } from 'react';

const CITIES = [
  { name: 'Kathmandu, Bāgmatī, Nepal', lat: 27.7172, lon: 85.3240 },
  { name: 'San Francisco, CA, USA', lat: 37.7749, lon: -122.4194 },
  { name: 'London, United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
];

export default function Home({ unit = 'C' }) {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [activeSideTab, setActiveSideTab] = useState('Current');
  const [activePill, setActivePill] = useState('Overview');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Updated API call to request windspeed_10m and cloudcover parameters
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,windspeed_10m,cloudcover&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await res.json();
        
        if (isMounted && data?.current_weather) {
          setWeatherData({
            temp: data.current_weather.temperature,
            condition: 'Mostly cloudy',
            humidity: `${data.hourly?.relativehumidity_2m?.[0] ?? '--'}%`,
            windSpeed: `${data.current_weather.windspeed} km/h`,
            precipitation: `${data.hourly?.precipitation_probability?.[0] ?? '--'}%`,
            // Save metric variations for each hourly entry
            hourly: (data.hourly?.time || []).slice(0, 6).map((t, idx) => ({
              time: idx === 0 ? 'NOW' : new Date(t).toLocaleTimeString([], { hour: 'numeric' }),
              temp: data.hourly?.temperature_2m?.[idx] ?? 0,
              humidity: `${data.hourly?.relativehumidity_2m?.[idx] ?? 0}%`,
              precipitation: `${data.hourly?.precipitation_probability?.[idx] ?? 0}%`,
              wind: `${Math.round(data.hourly?.windspeed_10m?.[idx] ?? 0)} km/h`,
              cloud: `${data.hourly?.cloudcover?.[idx] ?? 0}%`,
            })),
            daily: (data.daily?.time || []).map((t, idx) => ({
              day: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }),
              max: data.daily?.temperature_2m_max?.[idx],
              min: data.daily?.temperature_2m_min?.[idx],
            })),
          });
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();
    return () => { isMounted = false; };
  }, [selectedCity]);

  const convertTemp = (val) => {
    if (val === undefined || val === null) return '--';
    return unit === 'F' ? Math.round((val * 9) / 5 + 32) : Math.round(val);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        {['Current', 'Hourly', 'Details', 'Maps', 'Monthly', 'Trends'].map((tab) => (
          <button
            key={tab}
            className={`sidebar-btn ${activeSideTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSideTab(tab)}
          >
            <span>{tab === 'Current' ? '☀️' : '📊'}</span>
            {tab}
          </button>
        ))}
      </aside>

      {/* Main Content View */}
      <main className="main-content">
        <div className="top-action-bar">
          <div className="location-dropdown-group">
            <span>📍</span>
            <select
              className="city-select"
              value={selectedCity.name}
              onChange={(e) => setSelectedCity(CITIES.find(c => c.name === e.target.value))}
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>📱 Live Weather Engine</span>
        </div>

        {/* Dynamic Sidebar View Switching */}
        {activeSideTab === 'Current' && (
          <>
            <div className="cards-row">
              <div className="glass-card">
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Neighbor observed</span>
                <div className="temp-large">
                  {loading ? '--' : convertTemp(weatherData?.temp)}°{unit}
                </div>
                <div className="condition-text">⛅ {weatherData?.condition || 'Loading...'}</div>
              </div>

              <div className="glass-card">
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Precipitation & Details</span>
                <div style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                  <p>💧 Humidity: <strong>{weatherData?.humidity || '--'}</strong></p>
                  <p>💨 Wind: <strong>{weatherData?.windSpeed || '--'}</strong></p>
                  <p>🌧️ Rain Prob: <strong>{weatherData?.precipitation || '--'}</strong></p>
                </div>
              </div>

              <div className="map-preview-box">
                <span style={{ fontSize: '2rem' }}>🗺️</span>
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Interactive Map View</p>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{selectedCity.name}</span>
              </div>
            </div>

            <div className="bottom-section">
              <div className="sub-tabs-row">
                {['Overview', 'Precipitation', 'Wind', 'Air Quality', 'Humidity', 'Cloud cover'].map((pill) => (
                  <button
                    key={pill}
                    className={`pill-tab ${activePill === pill ? 'active' : ''}`}
                    onClick={() => setActivePill(pill)}
                  >
                    {pill}
                  </button>
                ))}
              </div>

              <div className="hourly-scroll-grid">
                {(weatherData?.hourly || []).map((item, idx) => {
                  let displayVal = `${convertTemp(item.temp)}°`;
                  let icon = '⛅';

                  if (activePill === 'Precipitation') {
                    displayVal = item.precipitation;
                    icon = '🌧️';
                  } else if (activePill === 'Wind') {
                    displayVal = item.wind;
                    icon = '💨';
                  } else if (activePill === 'Humidity') {
                    displayVal = item.humidity;
                    icon = '💧';
                  } else if (activePill === 'Cloud cover') {
                    displayVal = item.cloud;
                    icon = '☁️';
                  } else if (activePill === 'Air Quality') {
                    displayVal = 'Good';
                    icon = '🍃';
                  }

                  return (
                    <div key={idx} className="hourly-card">
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{item.time}</span>
                      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                      <span style={{ fontWeight: 600 }}>{displayVal}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeSideTab === 'Hourly' && (
          <div className="glass-card">
            <h3>Hourly Forecast View</h3>
            <div className="hourly-scroll-grid" style={{ marginTop: '1rem' }}>
              {(weatherData?.hourly || []).map((item, idx) => (
                <div key={idx} className="hourly-card">
                  <span>{item.time}</span>
                  <span style={{ fontSize: '1.5rem' }}>⛅</span>
                  <strong>{convertTemp(item.temp)}°{unit}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSideTab === 'Details' && (
          <div className="glass-card" style={{ lineHeight: '2' }}>
            <h3>Weather Details for {selectedCity.name}</h3>
            <p>💧 Relative Humidity: <strong>{weatherData?.humidity}</strong></p>
            <p>💨 Wind Speed: <strong>{weatherData?.windSpeed}</strong></p>
            <p>🌧️ Rain Probability: <strong>{weatherData?.precipitation}</strong></p>
          </div>
        )}

        {activeSideTab === 'Maps' && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>🗺️ Live Satellite Map View</h3>
            <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>Coordinates: {selectedCity.lat}, {selectedCity.lon}</p>
          </div>
        )}

        {(activeSideTab === 'Monthly' || activeSideTab === 'Trends') && (
          <div className="glass-card">
            <h3>7-Day Weather Trends</h3>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              {(weatherData?.daily || []).map((d, i) => (
                <div key={i} className="hourly-card">
                  <span>{d.day}</span>
                  <strong>{convertTemp(d.max)}°</strong>
                  <span style={{ opacity: 0.6 }}>{convertTemp(d.min)}°</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
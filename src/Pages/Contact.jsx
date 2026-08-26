import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: 'Aasha', email: 'aasha1@gmail.com', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-container">
      <h2>Contact Us</h2>
      <p style={{ margin: '0.5rem 0 1.5rem 0', opacity: 0.7 }}>
        Submit feedback or contact support.
      </p>

      {submitted && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '10px', marginBottom: '1rem' }}>
          Thank you! Your message has been recorded.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user-name">Name</label>
          <input
            id="user-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-email">Email</label>
          <input
            id="user-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-message">Message</label>
          <textarea
            id="user-message"
            rows="5"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  );
}
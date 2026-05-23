import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
    <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>404</div>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Page not found</h1>
      <p style={{ color: '#555', lineHeight: 1.8, marginBottom: 28 }}>
        The page you're looking for doesn't exist or may have been moved. Use the buttons below to continue shopping or return to the homepage.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary btn-lg">Home</Link>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ background: '#fff', color: 'var(--dark)', border: '2px solid var(--dark)' }}>
          Browse Products
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;

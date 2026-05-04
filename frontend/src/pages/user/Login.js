import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AuthCard = ({ title, subtitle, children }) => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
    <div className="card" style={{ padding: '40px', width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--primary)' }}>
          Shop<span style={{ color: 'var(--dark)' }}>Now</span>
        </Link>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 16 }}>{title}</h2>
        <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 6 }}>{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard title="Welcome Back!" subtitle="Sign in to continue shopping">
      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: '#fff5f5', border: '1px solid #ffcdd2', color: '#c62828', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} size={16} />
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="form-control" style={{ paddingLeft: 42 }} placeholder="Enter your email" required />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} size={16} />
            <input type={showPwd ? 'text' : 'password'} value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="form-control" style={{ paddingLeft: 42, paddingRight: 42 }} placeholder="Enter your password" required />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#aaa' }}>
              {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Forgot Password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 10, marginBottom: 16 }}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign Up</Link>
        </p>
        <div style={{ marginTop: 20, padding: '12px', background: '#f9f9f9', borderRadius: 8, fontSize: 13, color: '#666' }}>
          <strong>Demo Credentials:</strong><br />
          Admin: admin@shopnow.com / admin123<br />
          User: user@shopnow.com / user123
        </div>
      </form>
    </AuthCard>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard title="Create Account" subtitle="Join ShopNow and start shopping">
      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: '#fff5f5', border: '1px solid #ffcdd2', color: '#c62828', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        {[
          { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
          { key: 'email', label: 'Email Address', type: 'email', placeholder: 'Your email' },
          { key: 'password', label: 'Password', type: showPwd ? 'text' : 'password', placeholder: 'Min 6 characters' },
          { key: 'confirmPassword', label: 'Confirm Password', type: showPwd ? 'text' : 'password', placeholder: 'Repeat password' },
        ].map(f => (
          <div className="form-group" key={f.key}>
            <label>{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="form-control" placeholder={f.placeholder} required />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 10, marginBottom: 16, marginTop: 4 }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default Login;

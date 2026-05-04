import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';

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

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard title="Forgot Password?" subtitle="Enter your email to receive a reset link">
      {sent ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>📧</div>
          <p style={{ color: '#444', marginBottom: 20 }}>Password reset link sent to <strong>{email}</strong>. Check your inbox.</p>
          <Link to="/login" className="btn btn-primary btn-full" style={{ borderRadius: 10 }}>Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="form-control" placeholder="Enter your registered email" required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 10, marginBottom: 16 }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 14 }}>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to Login</Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
};

export const ResetPassword = () => {
  const { token } = require('react-router-dom').useParams();
  const navigate = require('react-router-dom').useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, form.password);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard title="Reset Password" subtitle="Enter your new password">
      <form onSubmit={handleSubmit}>
        {['password', 'confirmPassword'].map(key => (
          <div className="form-group" key={key}>
            <label>{key === 'password' ? 'New Password' : 'Confirm Password'}</label>
            <input type="password" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              className="form-control" placeholder={key === 'password' ? 'Min 6 characters' : 'Repeat password'} required />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 10 }}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthCard>
  );
};

export default ForgotPassword;

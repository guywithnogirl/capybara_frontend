import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styles from './Login.module.css';

export default function Login() {
  const { register: rhfRegister, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/account');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Invalid email or password.';
      toast.error(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-logo']}>
        <img src="/assets/logo.jpeg" alt="Capybara" />
      </div>
      <div className={styles['login-card']}>
        <h1>Welcome Back</h1>
        <p>Log in to manage your orders and favorites.</p>
        <div className={styles.divider}><span>LOGIN WITH EMAIL</span></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email Address</label>
            <div className={styles['input-icon-wrap']}>
              <span>✉️</span>
              <input
                type="email"
                placeholder="name@example.com"
                {...rhfRegister('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <small style={{ color: 'var(--error)' }}>{errors.email.message}</small>}
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Password</label>
            </div>
            <div className={styles['input-icon-wrap']}>
              <span>🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                {...rhfRegister('password', { required: 'Password is required' })}
              />
              <button type="button" className={styles['show-pass']} onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <small style={{ color: 'var(--error)' }}>{errors.password.message}</small>}
          </div>
          <button type="submit" className={`btn-primary ${styles['login-btn']}`} disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login to My Account →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" className={styles['forgot-link']}>Create an account</Link>
        </p>
        <div className={styles['secure-note']}>🔒 100% Secure & Encrypted Connection</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '24px' }}>© 2024 Capybara Baby Clothing. All rights reserved.</p>
    </div>
  );
}

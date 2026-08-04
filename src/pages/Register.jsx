import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styles from './Register.module.css';

export default function Register() {
  const { register: rhfRegister, handleSubmit, watch, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await authRegister({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.email.split('@')[0] + Math.floor(Math.random() * 1000),
        email: data.email,
        phone_number: data.phone_number || '',
        password: data.password,
      });
      toast.success('Account created! Welcome!');
      navigate('/account');
    } catch (err) {
      const detail = err.response?.data;
      if (typeof detail === 'object') {
        const msg = Object.values(detail).flat().join(', ');
        toast.error(msg || 'Registration failed');
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles['register-page']}>
      <header className={styles['register-header']}>
        <Link to="/"><img src="/assets/logo.jpeg" alt="Capybara" style={{ height: '44px' }} /></Link>
        <Link to="/shop" className={styles['back-to-shop']}>Back to Shop</Link>
      </header>
      <div className={styles['register-layout']}>
        {/* Left side */}
        <div className={styles['register-left']}>
          <div className={styles['register-img-wrap']}>
            <img src="/assets/WhatsApp Image 2026-07-12 at 2.43.18 PM.jpeg" alt="Baby" />
            <div className={styles['register-badge']}>❤️ <span><strong>10k+ Happy</strong><br />Parents Joined</span></div>
          </div>
          <h2>The softest start for your little one.</h2>
          <p>Join a community dedicated to quality, comfort, and sustainable baby fashion.</p>
        </div>
        {/* Right side */}
        <div className={styles['register-card']}>
          <h1>Join the Capybara Family</h1>
          <p>Create your account in seconds</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles['form-row']}>
              <div className="form-group">
                <label>First Name</label>
                <div className={styles['input-icon-wrap']}>
                  <span>👤</span>
                  <input placeholder="First Name" {...rhfRegister('first_name', { required: 'Required' })} />
                </div>
                {errors.first_name && <small style={{ color: 'var(--error)' }}>{errors.first_name.message}</small>}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <div className={styles['input-icon-wrap']}>
                  <span>👤</span>
                  <input placeholder="Last Name" {...rhfRegister('last_name', { required: 'Required' })} />
                </div>
                {errors.last_name && <small style={{ color: 'var(--error)' }}>{errors.last_name.message}</small>}
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className={styles['input-icon-wrap']}>
                <span>✉️</span>
                <input type="email" placeholder="you@example.com" {...rhfRegister('email', { required: 'Email is required' })} />
              </div>
              {errors.email && <small style={{ color: 'var(--error)' }}>{errors.email.message}</small>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <div className={styles['input-icon-wrap']}>
                <span>📞</span>
                <input placeholder="+91 98765 43210" {...rhfRegister('phone_number')} />
              </div>
            </div>
            <div className={styles['form-row']}>
              <div className="form-group">
                <label>Password</label>
                <div className={styles['input-icon-wrap']}>
                  <span>🔒</span>
                  <input type="password" placeholder="••••••••" {...rhfRegister('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
                </div>
                {errors.password && <small style={{ color: 'var(--error)' }}>{errors.password.message}</small>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className={styles['input-icon-wrap']}>
                  <span>🛡️</span>
                  <input type="password" placeholder="••••••••" {...rhfRegister('confirm', { required: 'Required', validate: v => v === password || 'Passwords do not match' })} />
                </div>
                {errors.confirm && <small style={{ color: 'var(--error)' }}>{errors.confirm.message}</small>}
              </div>
            </div>
            <button type="submit" className={`btn-primary ${styles['register-btn']}`} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

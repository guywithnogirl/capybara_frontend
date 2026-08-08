import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/accounts/password-reset/', {
        email,
      });

      setMessage(response.data.detail);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Forgot Password?</h1>

        <p className={styles.description}>
          Enter your registered email address and we'll send you a
          password reset link.
        </p>

        {message && (
          <div className={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <Link to="/login" className={styles.backLink}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
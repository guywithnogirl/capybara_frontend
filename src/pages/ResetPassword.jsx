import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordValid =
    requirements.length &&
    requirements.uppercase &&
    requirements.lowercase &&
    requirements.number &&
    requirements.special;

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!passwordValid) {
      setError('Please meet all password requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/accounts/password-reset-confirm/',
        {
          uid,
          token,
          new_password: password,
        }
      );

      setSuccess(response.data.detail);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const backendError = err.response?.data;

      if (backendError?.new_password) {
        setError(
          Array.isArray(backendError.new_password)
            ? backendError.new_password.join(' ')
            : backendError.new_password
        );
      } else {
        setError(
          backendError?.detail ||
            'The reset link is invalid or has expired.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Reset Password</h1>

        <p className={styles.description}>
          Create a strong new password for your account.
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.success}>
            {success}
            <br />
            Redirecting to login...
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="password">
              New Password
            </label>

            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className={styles.showButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className={styles.requirements}>
              <p className={requirements.length ? styles.valid : ''}>
                {requirements.length ? '✓' : '○'} At least 8 characters
              </p>

              <p className={requirements.uppercase ? styles.valid : ''}>
                {requirements.uppercase ? '✓' : '○'} One uppercase letter
              </p>

              <p className={requirements.lowercase ? styles.valid : ''}>
                {requirements.lowercase ? '✓' : '○'} One lowercase letter
              </p>

              <p className={requirements.number ? styles.valid : ''}>
                {requirements.number ? '✓' : '○'} One number
              </p>

              <p className={requirements.special ? styles.valid : ''}>
                {requirements.special ? '✓' : '○'} One special character
              </p>
            </div>

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className={styles.passwordWrapper}>
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword ? 'text' : 'password'
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className={styles.showButton}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {confirmPassword && (
              <p
                className={
                  passwordsMatch
                    ? styles.match
                    : styles.noMatch
                }
              >
                {passwordsMatch
                  ? '✓ Passwords match'
                  : '✕ Passwords do not match'}
              </p>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {!success && (
          <Link
            to="/login"
            className={styles.backLink}
          >
            ← Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}
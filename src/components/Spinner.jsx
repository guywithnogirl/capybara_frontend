import styles from './Spinner.module.css';

export default function Spinner({ size = 'default', text = '' }) {
  return (
    <div className={styles.spinnerWrap}>
      <div className={`${styles.spinner} ${size === 'lg' ? styles.spinnerLg : ''}`} />
      {text && <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{text}</p>}
    </div>
  );
}

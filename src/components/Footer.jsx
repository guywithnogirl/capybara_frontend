import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles['footer-main']} container`}>
        <div className={styles['footer-col']}>
          <div className={styles['footer-brand']}>
            <img src="/assets/logo.jpeg" alt="Capybara" className={styles['footer-logo']} />
            <p>Sustainable, soft, and adorable clothing for your little ones. We believe in quality that lasts through every adventure.</p>
          </div>
        </div>
        <div className={styles['footer-col']}>
          <h4>SHOP ALL</h4>
          <ul>
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/shop?category__slug=girls">Girls Collection</Link></li>
            <li><Link to="/shop?category__slug=boys">Boys Collection</Link></li>
            <li><Link to="/shop?category__slug=set-mundu">Set Mundu</Link></li>
            <li><Link to="/shop?category__slug=festive">Festive Wear</Link></li>
          </ul>
        </div>
        <div className={styles['footer-col']}>
          <h4>SUPPORT</h4>
          <ul>
            <li><Link to="/track">Track Order</Link></li>
            <li><Link to="/returns">Returns &amp; Exchanges</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className={styles['footer-col']}>
          <h4>NEWSLETTER</h4>
          <p>Join our family and get 10% off your first order.</p>
          <form className={styles['newsletter-form']} onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Email address" />
            <button className="btn-primary" type="submit">Join</button>
          </form>
        </div>
      </div>
      <div className={`${styles['footer-bottom']} container`}>
        <p>© 2024 Capybara Baby Clothing. All rights reserved.</p>
        <p>Made with ❤️ for little ones</p>
      </div>
    </footer>
  );
}

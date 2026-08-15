import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/shop?search=${searchQuery}`); setSearchOpen(false); setSearchQuery(''); }
  };
  const [navbarVisible, setNavbarVisible] = useState(true);
  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 10) {
      setNavbarVisible(true);
    } else if (currentScrollY > lastScrollY) {
      setNavbarVisible(false);
    } else {
      setNavbarVisible(true);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

  return (
    <header className={`${styles.navbar} ${navbarVisible ? styles.navbarVisible : styles.navbarHidden}`}>
      <div className={styles['navbar-top']}>
        <span>🎉 Free Shipping on orders above ₹999 | Easy 10-day returns</span>
      </div>
      <div className={`${styles['navbar-main']} container`}>
        <Link to="/" className={styles['navbar-logo']}>
          <img src="capy-logo-landscape.svg" alt="Capybara Baby Clothing" />
        </Link>
        <nav className={`${styles['navbar-links']} ${menuOpen ? styles.open : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/shop?category__slug=girls" onClick={() => setMenuOpen(false)}>Girls</Link>
          <Link to="/shop?category__slug=boys" onClick={() => setMenuOpen(false)}>Boys</Link>
          <Link to="/shop?category__slug=set-mundu" onClick={() => setMenuOpen(false)}>Set Mundu</Link>
          <Link to="/shop?category__slug=festive" onClick={() => setMenuOpen(false)}>Festive</Link>
        </nav>
        <div className={styles['navbar-actions']}>
          <button className={styles['icon-btn']} onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <Link to={isAuthenticated ? "/account" : "/login"} className={styles['icon-btn']} aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
          <Link to="/account/wishlist" className={styles['icon-btn']} aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {wishlist.length > 0 && <span className={styles['badge-dot']}>{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className={`${styles['icon-btn']} ${styles['cart-btn']}`} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {itemCount > 0 && <span className={styles['cart-count']}>{itemCount}</span>}
          </Link>
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className={`${styles['search-bar']} container`}>
          <form onSubmit={handleSearch}>
            <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search dresses, sets, frocks..." />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}

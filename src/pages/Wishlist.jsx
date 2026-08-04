import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import Spinner from '../components/Spinner';
// import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>My Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>❤️</p>
          <h3>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Save items you love for later.</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className={styles['wishlist-grid']}>
          {wishlist.map(item => (
            <div key={item.id} className={styles['wishlist-card']}>
              <Link to={`/product/${item.slug}`} className={styles['wishlist-img']}>
                {item.image && <img src={item.image} alt={item.product_name} />}
              </Link>
              <div className={styles['wishlist-info']}>
                <Link to={`/product/${item.slug}`}>
                  <h3>{item.product_name}</h3>
                </Link>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.color} • {item.size}
                </p>
                <strong style={{ color: 'var(--primary)' }}>₹{parseFloat(item.selling_price).toLocaleString()}</strong>
              </div>
              <button
                className={styles['wishlist-remove']}
                onClick={() => removeFromWishlist(item.id)}
                title="Remove"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

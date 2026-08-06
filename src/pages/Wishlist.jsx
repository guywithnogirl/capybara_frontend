import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <Spinner />;

  return (
    <div>
      <h2
        style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '24px',
        }}
      >
        My Wishlist ({wishlist.length})
      </h2>

      {wishlist.length === 0 ? (
        <div className={styles['empty-state']}>
          <div className={styles['empty-icon']}>❤️</div>

          <h3>Your Wishlist is Empty</h3>

          <p>
            Save your favourite products here and purchase them later.
          </p>

          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className={styles['wishlist-grid']}>
          {wishlist.map((item) => (
            <div
              key={item.id}
              className={styles['wishlist-card']}
            >
              <button
                className={styles['wishlist-remove']}
                title="Remove from wishlist"
                onClick={() => removeFromWishlist(item.id)}
              >
                ✕
              </button>

              <Link
                to={`/product/${item.slug}`}
                className={styles['wishlist-img']}
              >
                <img
                  src={item.image || '/placeholder-product.png'}
                  alt={item.product_name}
                />
              </Link>

              <div className={styles['wishlist-info']}>
                <Link to={`/product/${item.slug}`}>
                  <h3>{item.product_name}</h3>
                </Link>

                <p>
                  <strong>Color:</strong> {item.color}
                </p>

                <p>
                  <strong>Size:</strong> {item.size}
                </p>

                <strong>
                  ₹{Number(item.selling_price || 0).toLocaleString()}
                </strong>

                <div className={styles['wishlist-actions']}>
                  <button
                    className="btn-primary"
                    onClick={() =>
                      addToCart(item.product_variant_id, 1)
                    }
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

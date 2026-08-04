import { Link, useLocation } from 'react-router-dom';
import styles from './OrderSuccess.module.css';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return (
    <div className="container" style={{ textAlign: 'center', padding: '60px' }}>
      <h2>No order found</h2>
      <Link to="/" className="btn-primary" style={{ marginTop: '20px' }}>Go Home</Link>
    </div>
  );

  return (
    <div className={styles['order-success']}>
      <div className={styles['success-hero']}>
        <div className={styles['success-icon']}>🎊</div>
        <h1>Thank you for your order!</h1>
        <p>Yay! We've received your order and our team is getting it ready for your little one.</p>
        <div className={styles['order-info-badges']}>
          <div className={styles['info-badge']}><small>ORDER NUMBER</small><strong>{order.order_number}</strong></div>
          <div className={styles['info-badge']}><small>ESTIMATED DELIVERY</small><strong>5–7 Business Days</strong></div>
        </div>
      </div>
      <div className="container">
        <div className={styles['success-layout']}>
          <div className={`${styles['success-summary']} ${styles.card}`}>
            <h2>Order Summary <span>{order.items?.length} Items</span></h2>
            {order.items?.map((item, i) => (
              <div key={i} className={styles['success-item']}>
                <div>
                  <p>{item.product_name}</p>
                  <small>Color: {item.color} | Size: {item.size}</small>
                </div>
                <span>₹{parseFloat(item.subtotal).toLocaleString()}<br /><small>Qty: {item.quantity}</small></span>
              </div>
            ))}
            <div className={`${styles['success-shipping']} ${styles.card}`}>
              <div>
                <h3>🚚 Shipping Address</h3>
                <p>{order.full_name}</p>
                <p>{order.house_name}{order.street ? `, ${order.street}` : ''}</p>
                <p>{order.city}, {order.district}, {order.state}</p>
                <p>{order.pincode}</p>
              </div>
            </div>
          </div>
          <div className={`${styles['success-price']} ${styles.card}`}>
            <h2>Price Details</h2>
            <div className="summary-row"><span>Subtotal</span><span>₹{parseFloat(order.subtotal).toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span style={{ color: 'var(--success)' }}>₹{parseFloat(order.shipping_charge).toLocaleString()}</span></div>
            {parseFloat(order.discount) > 0 && (
              <div className="summary-row"><span>Discount</span><span style={{ color: 'var(--success)' }}>-₹{parseFloat(order.discount).toLocaleString()}</span></div>
            )}
            <div className="summary-total"><span>Total</span><span>₹{parseFloat(order.total_amount).toLocaleString()}</span></div>
            <Link to={`/account/orders/${order.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>📦 View Order Status</Link>
            <Link to="/shop" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>Continue Shopping</Link>
            <div className={styles['eco-note']}>🌿 This order was packaged using 100% recyclable materials. Thank you for choosing sustainable baby wear!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

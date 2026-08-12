import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getAddresses, createAddress } from '../services/addressService';
import { createOrder, buyNow, createRazorpayOrder } from '../services/orderService';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { cartItems, totalAmount, fetchCart, clearCartLocal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowData = location.state?.buyNow ? location.state : null;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({
    full_name: '', phone_number: '', house_name: '', street: '', landmark: '',
    city: '', district: '', state: '', pincode: '', address_type: 'HOME',
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    getAddresses()
      .then(data => {
        const list = data.results || data || [];
        setAddresses(list);
        const def = list.find(a => a.is_default) || list[0];
        if (def) setSelectedAddr(def.id);
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const handleNewAddress = async (e) => {
    e.preventDefault();
    try {
      const created = await createAddress(newAddr);
      setAddresses(prev => [...prev, created]);
      setSelectedAddr(created.id);
      setShowNewAddr(false);
      toast.success('Address added!');
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddr) { toast.error('Please select a shipping address'); return; }
    setPlacing(true);
    try {
      let order;
      if (buyNowData) {
        order = await buyNow(selectedAddr, buyNowData.variantId, buyNowData.quantity);
      } else {
        order = await createOrder(selectedAddr);
        clearCartLocal();
        fetchCart();
      }
      const razorpayOrder = await createRazorpayOrder(order.id);
      console.log('Razorpay Order:', razorpayOrder);
      // toast.success('Order placed successfully!');
      // navigate('/order-success', { state: { order } });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to place order';
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Spinner />;

  const items = buyNowData
    ? [{ product_name: buyNowData.productName, color: buyNowData.color, size: buyNowData.size, quantity: buyNowData.quantity, unit_price: buyNowData.price, image: buyNowData.image }]
    : cartItems;

  return (
    <div className={`${styles['checkout-page']} container`}>
      <h1>Checkout</h1>
      <div className={styles['checkout-layout']}>
        <div className={styles['checkout-form']}>
          <h2>Select Shipping Address</h2>
          {addresses.length === 0 && !showNewAddr && (
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No saved addresses. Add one below.</p>
          )}
          <div className={styles['address-list']}>
            {addresses.map(addr => (
              <label key={addr.id} className={`${styles['address-option']} ${selectedAddr === addr.id ? styles.selected : ''}`}>
                <input type="radio" name="address" checked={selectedAddr === addr.id} onChange={() => setSelectedAddr(addr.id)} />
                <div>
                  <strong>{addr.full_name}</strong>
                  {addr.is_default && <span className="badge badge-brown" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>DEFAULT</span>}
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {addr.house_name}, {addr.street && `${addr.street}, `}{addr.city}, {addr.district}<br />
                    {addr.state} — {addr.pincode}<br />
                    📞 {addr.phone_number}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {!showNewAddr ? (
            <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={() => setShowNewAddr(true)}>+ Add New Address</button>
          ) : (
            <form onSubmit={handleNewAddress} style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '16px' }}>New Address</h3>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input required value={newAddr.full_name} onChange={e => setNewAddr(f => ({ ...f, full_name: e.target.value }))} /></div>
                <div className="form-group"><label>Phone</label><input required value={newAddr.phone_number} onChange={e => setNewAddr(f => ({ ...f, phone_number: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label>House / Building</label><input required value={newAddr.house_name} onChange={e => setNewAddr(f => ({ ...f, house_name: e.target.value }))} /></div>
              <div className="form-group"><label>Street</label><input value={newAddr.street} onChange={e => setNewAddr(f => ({ ...f, street: e.target.value }))} /></div>
              <div className="form-group"><label>Landmark</label><input value={newAddr.landmark} onChange={e => setNewAddr(f => ({ ...f, landmark: e.target.value }))} /></div>
              <div className="form-row">
                <div className="form-group"><label>City</label><input required value={newAddr.city} onChange={e => setNewAddr(f => ({ ...f, city: e.target.value }))} /></div>
                <div className="form-group"><label>District</label><input required value={newAddr.district} onChange={e => setNewAddr(f => ({ ...f, district: e.target.value }))} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>State</label><input required value={newAddr.state} onChange={e => setNewAddr(f => ({ ...f, state: e.target.value }))} /></div>
                <div className="form-group"><label>PIN Code</label><input required value={newAddr.pincode} onChange={e => setNewAddr(f => ({ ...f, pincode: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary">Save Address</button>
                <button type="button" className="btn-secondary" onClick={() => setShowNewAddr(false)}>Cancel</button>
              </div>
            </form>
          )}
          <button
            className={`btn-accent ${styles['checkout-continue']}`}
            style={{ marginTop: '24px' }}
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
        {/* Order Summary Sidebar */}
        <div className={styles['checkout-summary']}>
          <h2>Order Summary</h2>
          {items.map((item, i) => (
            <div key={i} className={styles['checkout-item']}>
              {item.image && <img src={item.image} alt={item.product_name} />}
              <div>
                <p>{item.product_name}</p>
                <small>{item.color} • {item.size}</small>
                <p>Qty: {item.quantity}</p>
              </div>
              <span>₹{(parseFloat(item.unit_price) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className={styles['checkout-totals']}>
            <div className="summary-total"><span>Total</span><span>₹{buyNowData ? (parseFloat(buyNowData.price) * buyNowData.quantity).toLocaleString() : totalAmount.toLocaleString()}</span></div>
          </div>
          <div className={styles['secure-note']}>🔒 Secure Checkout — Your order is encrypted and securely processed.</div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// import './Payment.css';

export default function Payment() {
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { addOrder, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const shippingInfo = location.state?.form || {};
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '', save: false });
  const [processing, setProcessing] = useState(false);

  const handleComplete = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    const order = {
      id: `CB-${Math.floor(Math.random() * 90000) + 10000}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Processing',
      items: cartItems.map(i => ({ ...i })),
      subtotal, shipping, tax, total,
      shippingAddress: shippingInfo,
      paymentMethod: `Visa ending in ${card.number.slice(-4) || '4242'}`,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    navigate('/order-success', { state: { order } });
  };

  return (
    <div className="payment-page container">
      <h1>Checkout</h1>
      <div className="stepper">
        {['1 Shipping', '2 Payment', '3 Review'].map((s, i) => (
          <div key={s} className={`step ${i < 2 ? 'done' : ''} ${i === 1 ? 'active' : ''}`}>
            <div className="step-num">{i === 0 ? '✓' : i + 1}</div>
            <span>{s}</span>
            {i < 2 && <div className="step-line" />}
          </div>
        ))}
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleComplete}>
          <div className="express-checkout">
            <h3>Express Checkout</h3>
            <div className="express-btns">
              <button type="button" className="apple-pay">Apple Pay</button>
              <button type="button" className="google-pay"><span>G</span>oogle Pay</button>
            </div>
            <div className="or-divider"><span>OR PAY WITH CARD</span></div>
          </div>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input required placeholder="John Doe" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
          </div>
          <div className="form-group card-number-group">
            <label>Card Number</label>
            <input required placeholder="0000 0000 0000 0000" maxLength={19}
              value={card.number}
              onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() }))} />
            <span className="card-icon">💳</span>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input required placeholder="MM/YY" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input required placeholder="123" maxLength={4} value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} />
            </div>
          </div>
          <label className="save-card">
            <input type="checkbox" checked={card.save} onChange={e => setCard(c => ({ ...c, save: e.target.checked }))} />
            Save card information for future purchases
          </label>
          <p className="secure-badge">🔒 SECURE 256-BIT SSL ENCRYPTED PAYMENT</p>
          <button type="submit" className="btn-accent complete-btn" disabled={processing}>
            {processing ? 'Processing...' : 'Complete Order'}
          </button>
        </form>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.cartKey} className="checkout-item">
              <img src={item.images[0]} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <small>{item.color} • Qty: {item.qty}</small>
              </div>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="checkout-totals">
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span style={{ color: 'var(--success)' }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="summary-row"><span>Estimated Tax</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="summary-total" style={{ fontSize: '1.3rem' }}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>By completing your order, you agree to our <a href="/terms" style={{ color: 'var(--accent)' }}>Terms of Service</a>.</p>
        </div>
      </div>
    </div>
  );
}

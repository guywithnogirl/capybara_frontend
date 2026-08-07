import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetail, cancelOrder } from '../services/orderService';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import Return from '../components/Return';

const TIMELINE = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];
const TIMELINE_LABELS = { PENDING: 'Order Placed', CONFIRMED: 'Confirmed', PACKED: 'Packed', SHIPPED: 'Shipped', DELIVERED: 'Delivered' };

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);


  useEffect(() => {
    getOrderDetail(id)
      .then(data => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  if (!order) return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Order not found</h2>
      <Link to="/account/orders" className="btn-primary" style={{ marginTop: '16px' }}>Back to Orders</Link>
    </div>
  );

  const statusIdx = TIMELINE.indexOf(order.status);
  const canCancel = ['PENDING', 'CONFIRMED', 'PACKED'].includes(order.status);
  
  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const updated = await cancelOrder(order.id);
      setOrder(updated);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };
  const handleReturn = () => {
    // Implement return order logic here
    // toast('Return order functionality is not implemented yet.');
    setShowReturnModal(true);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <nav className="breadcrumb" style={{ padding: '0 0 8px' }}><Link to="/account">Account</Link><span className="sep">›</span><Link to="/account/orders">Orders</Link><span className="sep">›</span><span className="current">#{order.order_number}</span></nav>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Order Details</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {canCancel && (
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
            </button>
          )}
          {order.status === 'DELIVERED' && (
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={handleReturn}>
              {' Return Order'}
            </button>
          )}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        <div>
          {/* Items */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Items Purchased ({order.items?.length || 0})</h3>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.product_name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Color: {item.color} • Size: {item.size}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{parseFloat(item.subtotal).toLocaleString()}</span>
              </div>
            ))}
          </div>
          {/* Shipping */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '12px' }}>🚚 Shipping Address</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                {order.full_name}<br />
                {order.house_name}{order.street ? `, ${order.street}` : ''}<br />
                {order.city}, {order.district}<br />
                {order.state} — {order.pincode}
              </p>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '12px' }}>💳 Payment</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status: {order.payment_status}</p>
            </div>
          </div>
        </div>
        <Return
  isOpen={showReturnModal}
  onClose={() => setShowReturnModal(false)}
  orderNumber={order.order_number}
/>
        {/* Right Panel */}
        <div>
          {/* Order Status */}
          {order.status !== 'CANCELLED' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: '700' }}>Order Status</h3>
                <span className={`badge ${order.status === 'DELIVERED' ? 'badge-green' : order.status === 'SHIPPED' ? 'badge-orange' : 'badge-blue'}`}>{order.status}</span>
              </div>
              <div className="order-timeline">
                {TIMELINE.map((step, i) => (
                  <div key={step} className={`timeline-step ${i <= statusIdx ? 'done' : ''}`}>
                    <div className="timeline-dot" />
                    <div className="timeline-content"><strong>{TIMELINE_LABELS[step]}</strong>{i <= statusIdx && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</p>}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {order.status === 'CANCELLED' && (
            <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>❌</p>
              <h3 style={{ color: 'var(--error)' }}>Order Cancelled</h3>
            </div>
          )}
          {/* Summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{parseFloat(order.subtotal).toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>₹{parseFloat(order.shipping_charge).toLocaleString()}</span></div>
            {parseFloat(order.discount) > 0 && (
              <div className="summary-row"><span>Discount</span><span style={{ color: 'var(--success)' }}>-₹{parseFloat(order.discount).toLocaleString()}</span></div>
            )}
            <div className="summary-total"><span>Total Paid</span><span>₹{parseFloat(order.total_amount).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
      <style>{`.order-timeline{display:flex;flex-direction:column;gap:16px}.timeline-step{display:flex;align-items:flex-start;gap:12px;position:relative}.timeline-step::before{content:'';position:absolute;left:9px;top:20px;bottom:-20px;width:2px;background:var(--border);z-index:0}.timeline-step:last-child::before{display:none}.timeline-dot{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);background:#fff;z-index:1;flex-shrink:0;transition:all 0.2s}.timeline-step.done .timeline-dot{background:var(--success);border-color:var(--success)}.timeline-step.done .timeline-dot::after{content:'✓';color:#fff;font-size:0.65rem;display:flex;align-items:center;justify-content:center;height:100%}.timeline-content strong{font-size:0.875rem}`}</style>
    </div>
  );
}

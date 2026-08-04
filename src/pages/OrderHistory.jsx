import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import Spinner from '../components/Spinner';

const STATUS_STYLES = { PENDING: 'badge-blue', CONFIRMED: 'badge-blue', PACKED: 'badge-orange', SHIPPED: 'badge-orange', DELIVERED: 'badge-green', CANCELLED: 'badge-red' };

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getOrders()
      .then(data => setOrders(data.results || data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Order History</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: '0.875rem' }}>
          <option>All</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Order', 'Date', 'Status', 'Total', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 16px', fontSize: '0.875rem', fontWeight: '500' }}>#{order.order_number}</td>
                <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge ${STATUS_STYLES[order.status] || 'badge-orange'}`}>{order.status}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(order.total_amount).toLocaleString()}</td>
                <td style={{ padding: '14px 16px' }}>
                  <Link to={`/account/orders/${order.id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders found.</p>}
      </div>
    </div>
  );
}

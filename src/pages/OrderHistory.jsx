import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import Spinner from '../components/Spinner';
import styles from './OrderHistory.module.css';

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
      <div className={styles.header}>
        <h2>Order History</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} className={styles['filter-select']}>
          <option>All</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* ── Desktop: Table ── */}
      <div className={styles['table-wrap']}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['Order', 'Date', 'Status', 'Total', 'Actions'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td className={styles['col-order']}>#{order.order_number}</td>
                <td className={styles['col-date']}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${STATUS_STYLES[order.status] || 'badge-orange'}`}>{order.status}</span>
                </td>
                <td className={styles['col-total']}>₹{parseFloat(order.total_amount).toLocaleString()}</td>
                <td>
                  <Link to={`/account/orders/${order.id}`} className={`btn-secondary ${styles['view-btn']}`}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className={styles['empty-msg']}>No orders found.</p>}
      </div>

      {/* ── Mobile: Cards ── */}
      <div className={styles['card-list']}>
        {filtered.map(order => (
          <div key={order.id} className={styles['order-card']}>
            <div className={styles['card-top']}>
              <strong>#{order.order_number}</strong>
              <span className={`badge ${STATUS_STYLES[order.status] || 'badge-orange'}`}>{order.status}</span>
            </div>
            <div className={styles['card-mid']}>
              <span className={styles['card-date']}>{new Date(order.created_at).toLocaleDateString()}</span>
              <span className={styles['card-total']}>₹{parseFloat(order.total_amount).toLocaleString()}</span>
            </div>
            <div className={styles['card-bottom']}>
              <Link to={`/account/orders/${order.id}`} className={`btn-secondary ${styles['card-view-btn']}`}>View Details</Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className={styles['empty-msg']}>No orders found.</p>}
      </div>
    </div>
  );
}

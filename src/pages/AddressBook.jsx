import { useState, useEffect } from 'react';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../services/addressService';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import styles from './AddressBook.module.css';

const EMPTY_FORM = { full_name: '', phone_number: '', house_name: '', street: '', landmark: '', city: '', district: '', state: '', pincode: '', address_type: 'HOME' };

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data.results || data || []);
    } catch { setAddresses([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateAddress(editing, form);
        toast.success('Address updated!');
      } else {
        await createAddress(form);
        toast.success('Address added!');
      }
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (addr) => {
    setEditing(addr.id);
    setForm({
      full_name: addr.full_name, phone_number: addr.phone_number,
      house_name: addr.house_name, street: addr.street || '',
      landmark: addr.landmark || '', city: addr.city,
      district: addr.district, state: addr.state, pincode: addr.pincode,
      address_type: addr.address_type || 'HOME',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      toast.success('Address deleted');
      fetchAddresses();
    } catch { toast.error('Failed to delete'); }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success('Default address updated');
      fetchAddresses();
    } catch { toast.error('Failed to set default'); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Address Book</h2>
        {!showForm && (
          <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM); }}>+ Add Address</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles['address-form']}>
          <h3>{editing ? 'Edit Address' : 'Add New Address'}</h3>
          <div className="form-row">
            <div className="form-group"><label>Full Name</label><input required value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} /></div>
            <div className="form-group"><label>Phone</label><input required value={form.phone_number} onChange={e => handleChange('phone_number', e.target.value)} /></div>
          </div>
          <div className="form-group"><label>House / Building</label><input required value={form.house_name} onChange={e => handleChange('house_name', e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>Street</label><input value={form.street} onChange={e => handleChange('street', e.target.value)} /></div>
            <div className="form-group"><label>Landmark</label><input value={form.landmark} onChange={e => handleChange('landmark', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>City</label><input required value={form.city} onChange={e => handleChange('city', e.target.value)} /></div>
            <div className="form-group"><label>District</label><input required value={form.district} onChange={e => handleChange('district', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>State</label><input required value={form.state} onChange={e => handleChange('state', e.target.value)} /></div>
            <div className="form-group"><label>PIN Code</label><input required value={form.pincode} onChange={e => handleChange('pincode', e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.address_type} onChange={e => handleChange('address_type', e.target.value)}>
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Save'} Address</button>
            <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles['address-grid']}>
        {addresses.map(addr => (
          <div key={addr.id} className={styles['address-card']}>
            <div className={styles['address-card-header']}>
              <span className="badge badge-brown">{addr.address_type}</span>
              {addr.is_default && <span className="badge badge-green">DEFAULT</span>}
            </div>
            <h3>{addr.full_name}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {addr.house_name}{addr.street ? `, ${addr.street}` : ''}<br />
              {addr.landmark && <>{addr.landmark}<br /></>}
              {addr.city}, {addr.district}<br />
              {addr.state} — {addr.pincode}
            </p>
            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>📞 {addr.phone_number}</p>
            <div className={styles['address-actions']}>
              <button onClick={() => handleEdit(addr)}>✏️ Edit</button>
              <button onClick={() => handleDelete(addr.id)}>🗑️ Delete</button>
              {!addr.is_default && <button onClick={() => handleSetDefault(addr.id)}>⭐ Set Default</button>}
            </div>
          </div>
        ))}
        {addresses.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No addresses saved.</p>}
      </div>
    </div>
  );
}

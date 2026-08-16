// src/pages/DeliveryManagement.tsx
import React, { useEffect, useState } from 'react';
import type { DeliveryBoy } from '../../types';
import { deliveryApi } from '../../Config/appi';

const statusColor: Record<string, string> = {
  ACTIVE: '#2d7a2d', INACTIVE: '#888', ON_DELIVERY: '#2d5fa1',
};

const DeliveryManagement: React.FC = () => {
  const [boys, setBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newBoy, setNewBoy] = useState({ name: '', phone: '', email: '', vehicleType: '', vehicleNumber: '' });

  const loadBoys = async () => {
    setLoading(true);
    try {
      const res = await deliveryApi.getAll(page, 10);
      setBoys(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBoys(); }, [page]);

  const handleToggle = async (boy: DeliveryBoy) => {
    if (boy.status === 'ON_DELIVERY') return;
    setActionLoading(boy.id);
    try {
      const newStatus = boy.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await deliveryApi.toggleStatus(boy.id, newStatus);
      await loadBoys();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deliveryApi.create(newBoy);
      setShowAdd(false);
      setNewBoy({ name: '', phone: '', email: '', vehicleType: '', vehicleNumber: '' });
      await loadBoys();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a2e1a' }}>Delivery Management</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>Manage delivery boys and their performance</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2d4a2d', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >+ Add Delivery Boy</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: boys.length, color: '#555', icon: '👥' },
          { label: 'Active', value: boys.filter(b => b.status === 'ACTIVE').length, color: '#2d7a2d', icon: '✅' },
          { label: 'On Delivery', value: boys.filter(b => b.status === 'ON_DELIVERY').length, color: '#2d5fa1', icon: '🚚' },
          { label: 'Inactive', value: boys.filter(b => b.status === 'INACTIVE').length, color: '#888', icon: '⏸' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: '10px', padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '20px' }}>{card.icon}</span>
            <div>
              <div style={{ fontSize: '12px', color: '#888' }}>{card.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: card.color }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f8faf8', borderBottom: '2px solid #e8f0e8' }}>
              {['Name', 'Phone', 'Vehicle', 'Status', 'Rating', 'Completed', 'Cancelled', 'Success Rate', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</td></tr>
            ) : boys.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No delivery boys found</td></tr>
            ) : boys.map((boy, i) => {
              const total = boy.ordersCompleted + boy.ordersCancelled;
              const rate = total > 0 ? Math.round((boy.ordersCompleted / total) * 100) : 0;
              return (
                <tr key={boy.id} style={{ borderBottom: '1px solid #f0f5f0', background: i % 2 === 0 ? '#fff' : '#fafcfa' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: '#e8f5e8', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#2d7a2d',
                      }}>{boy.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{boy.name}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{boy.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{boy.phone}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '12px' }}>🚗 {boy.vehicleType}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{boy.vehicleNumber}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: `${statusColor[boy.status]}20`, color: statusColor[boy.status],
                    }}>{boy.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#e67e22', fontWeight: 600 }}>⭐ {boy.rating?.toFixed(1)}</td>
                  <td style={{ padding: '12px 14px', color: '#2d7a2d', fontWeight: 600 }}>{boy.ordersCompleted}</td>
                  <td style={{ padding: '12px 14px', color: '#e74c3c', fontWeight: 600 }}>{boy.ordersCancelled}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                        <div style={{ width: `${rate}%`, height: '100%', background: rate >= 80 ? '#2d7a2d' : rate >= 60 ? '#e67e22' : '#e74c3c', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: rate >= 80 ? '#2d7a2d' : '#e67e22' }}>{rate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => handleToggle(boy)}
                      disabled={actionLoading === boy.id || boy.status === 'ON_DELIVERY'}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                        background: boy.status === 'ACTIVE' ? '#fff0f0' : '#f0f8f0',
                        color: boy.status === 'ACTIVE' ? '#e74c3c' : '#2d7a2d',
                        opacity: boy.status === 'ON_DELIVERY' ? 0.5 : 1,
                      }}
                    >
                      {boy.status === 'ACTIVE' ? '⏸ Deactivate' : boy.status === 'INACTIVE' ? '▶ Activate' : '🚚 On Route'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}>← Prev</button>
        <span style={{ padding: '8px 16px', color: '#555', fontSize: '14px' }}>Page {page + 1} of {totalPages || 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>Next →</button>
      </div>

      {/* Add Delivery Boy Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '440px', width: '90%' }}>
            <h3 style={{ margin: '0 0 24px', fontWeight: 700, color: '#1a2e1a' }}>Add Delivery Boy</h3>
            <form onSubmit={handleAdd}>
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'vehicleType', label: 'Vehicle Type (Bike/Car/Van)', type: 'text' },
                { key: 'vehicleNumber', label: 'Vehicle Number', type: 'text' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={newBoy[field.key as keyof typeof newBoy]}
                    onChange={e => setNewBoy(prev => ({ ...prev, [field.key]: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAdd(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#2d4a2d', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                  Add Boy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
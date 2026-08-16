// src/pages/FarmerManagement.tsx
import React, { useEffect, useState } from 'react';
import type { Farmer } from '../../types';
import { farmerApi } from '../../Config/appi';


const statusColor: Record<string, string> = {
  APPROVED: '#2d7a2d',
  PENDING: '#e67e22',
  BLOCKED: '#e74c3c',
};

const FarmerManagement: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const res = await farmerApi.getAll(page, 10, filterStatus || undefined);
      setFarmers(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFarmers(); }, [page, filterStatus]);

  const handleAction = async (id: number, action: 'approve' | 'block' | 'unblock') => {
    setActionLoading(id);
    try {
      if (action === 'approve') await farmerApi.approve(id);
      else if (action === 'block') await farmerApi.block(id);
      else await farmerApi.unblock(id);
      await loadFarmers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {/* Header + Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a2e1a' }}>Farmer Management</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>Manage and approve farmer registrations</p>
        </div>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #ddd',
            fontSize: '14px', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="">All Farmers</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8faf8', borderBottom: '2px solid #e8f0e8' }}>
              {['ID', 'Name', 'Phone', 'Location', 'Products', 'Orders', 'Rating', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading farmers...</td></tr>
            ) : farmers.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No farmers found</td></tr>
            ) : farmers.map((farmer, i) => (
              <tr key={farmer.id} style={{ borderBottom: '1px solid #f0f5f0', background: i % 2 === 0 ? '#fff' : '#fafcfa' }}>
                <td style={{ padding: '12px 16px', color: '#888', fontSize: '12px' }}>#{farmer.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#1a2e1a' }}>{farmer.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{farmer.email}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#555' }}>{farmer.phone}</td>
                <td style={{ padding: '12px 16px', color: '#555' }}>{farmer.location}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {farmer.products?.slice(0, 2).map(p => (
                      <span key={p} style={{
                        padding: '2px 8px', borderRadius: '12px',
                        background: '#e8f5e8', color: '#2d7a2d', fontSize: '11px',
                      }}>{p}</span>
                    ))}
                    {(farmer.products?.length ?? 0) > 2 && (
                      <span style={{ fontSize: '11px', color: '#888' }}>+{farmer.products.length - 2}</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#555' }}>{farmer.totalOrders}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: '#e67e22', fontWeight: 600 }}>⭐ {farmer.rating?.toFixed(1) ?? 'N/A'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: `${statusColor[farmer.status]}20`,
                    color: statusColor[farmer.status],
                  }}>{farmer.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedFarmer(farmer)}
                      style={{
                        padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd',
                        background: '#fff', cursor: 'pointer', fontSize: '12px',
                      }}
                    >👁 View</button>
                    {farmer.status === 'PENDING' && (
                      <button
                        onClick={() => handleAction(farmer.id, 'approve')}
                        disabled={actionLoading === farmer.id}
                        style={{
                          padding: '6px 10px', borderRadius: '6px', border: 'none',
                          background: '#2d7a2d', color: '#fff', cursor: 'pointer', fontSize: '12px',
                        }}
                      >✅ Approve</button>
                    )}
                    {farmer.status === 'APPROVED' && (
                      <button
                        onClick={() => handleAction(farmer.id, 'block')}
                        disabled={actionLoading === farmer.id}
                        style={{
                          padding: '6px 10px', borderRadius: '6px', border: 'none',
                          background: '#e74c3c', color: '#fff', cursor: 'pointer', fontSize: '12px',
                        }}
                      >🚫 Block</button>
                    )}
                    {farmer.status === 'BLOCKED' && (
                      <button
                        onClick={() => handleAction(farmer.id, 'unblock')}
                        disabled={actionLoading === farmer.id}
                        style={{
                          padding: '6px 10px', borderRadius: '6px', border: 'none',
                          background: '#e67e22', color: '#fff', cursor: 'pointer', fontSize: '12px',
                        }}
                      >🔓 Unblock</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}>
          ← Prev
        </button>
        <span style={{ padding: '8px 16px', color: '#555', fontSize: '14px' }}>
          Page {page + 1} of {totalPages || 1}
        </span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
          Next →
        </button>
      </div>

      {/* Farmer Detail Modal */}
      {selectedFarmer && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setSelectedFarmer(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '32px',
              maxWidth: '480px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1a2e1a' }}>Farmer Details</h3>
              <button onClick={() => setSelectedFarmer(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            {[
              ['Name', selectedFarmer.name],
              ['Email', selectedFarmer.email],
              ['Phone', selectedFarmer.phone],
              ['Location', selectedFarmer.location],
              ['Farm Size', selectedFarmer.farmSize],
              ['Status', selectedFarmer.status],
              ['Total Orders', selectedFarmer.totalOrders],
              ['Total Revenue', `₹${selectedFarmer.totalRevenue?.toLocaleString() ?? 0}`],
              ['Rating', `⭐ ${selectedFarmer.rating?.toFixed(1) ?? 'N/A'}`],
              ['Joined', new Date(selectedFarmer.joinedDate).toLocaleDateString('en-IN')],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f5f0' }}>
                <span style={{ width: '140px', color: '#888', fontSize: '13px' }}>{label}</span>
                <span style={{ fontWeight: 500, color: '#1a2e1a', fontSize: '14px' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerManagement;
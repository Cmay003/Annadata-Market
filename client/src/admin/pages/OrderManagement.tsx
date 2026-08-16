// src/pages/OrderManagement.tsx
import React, { useEffect, useState } from 'react';
import type { Order } from '../../types';
import { orderApi } from '../../Config/appi';

const paymentColor: Record<string, string> = {
  PAID: '#2d7a2d', PENDING: '#e67e22', FAILED: '#e74c3c', REFUNDED: '#8e44ad',
};
const deliveryColor: Record<string, string> = {
  PLACED: '#888', ACCEPTED: '#2d5fa1', DISPATCHED: '#e67e22',
  DELIVERED: '#2d7a2d', CANCELLED: '#e74c3c',
};

const Badge: React.FC<{ label: string; colorMap: Record<string, string> }> = ({ label, colorMap }) => (
  <span style={{
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
    background: `${colorMap[label] ?? '#888'}20`,
    color: colorMap[label] ?? '#888',
  }}>{label}</span>
);

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAll(page, 10, filterStatus || undefined);
      setOrders(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [page, filterStatus]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a2e1a' }}>Order Management</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>Track and manage all customer orders</p>
        </div>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', background: '#fff' }}
        >
          <option value="">All Orders</option>
          <option value="PLACED">Placed</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
          <thead>
            <tr style={{ background: '#f8faf8', borderBottom: '2px solid #e8f0e8' }}>
              {['Order ID', 'Customer', 'Farmer', 'Product', 'Amount', 'Payment', 'Mode', 'Delivery', 'DB Assigned', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No orders found</td></tr>
            ) : orders.map((order, i) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f0f5f0', background: i % 2 === 0 ? '#fff' : '#fafcfa' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#2d5fa1', fontWeight: 600 }}>
                  #{order.id.substring(0, 8)}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                </td>
                <td style={{ padding: '10px 14px', color: '#555' }}>{order.farmerName}</td>
                <td style={{ padding: '10px 14px', color: '#555' }}>
                  <div>{order.product}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>Qty: {order.quantity}</div>
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1a2e1a' }}>₹{order.amount?.toLocaleString()}</td>
                <td style={{ padding: '10px 14px' }}><Badge label={order.paymentStatus} colorMap={paymentColor} /></td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '20px', fontSize: '11px',
                    background: order.paymentMode === 'COD' ? '#fff3e0' : '#e3f2fd',
                    color: order.paymentMode === 'COD' ? '#e65100' : '#1565c0',
                    fontWeight: 600,
                  }}>{order.paymentMode}</span>
                </td>
                <td style={{ padding: '10px 14px' }}><Badge label={order.deliveryStatus} colorMap={deliveryColor} /></td>
                <td style={{ padding: '10px 14px', color: '#555', fontSize: '12px' }}>
                  {order.deliveryBoyName ?? <span style={{ color: '#ccc' }}>Not assigned</span>}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '12px' }}
                  >👁 Details</button>
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
        <span style={{ padding: '8px 16px', color: '#555', fontSize: '14px' }}>Page {page + 1} of {totalPages || 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
          Next →
        </button>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setSelectedOrder(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#1a2e1a' }}>Order #{selectedOrder.id.substring(0, 8)}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            {[
              ['Full Order ID', selectedOrder.id],
              ['Customer', selectedOrder.customerName],
              ['Farmer', selectedOrder.farmerName],
              ['Product', selectedOrder.product],
              ['Quantity', selectedOrder.quantity],
              ['Amount', `₹${selectedOrder.amount?.toLocaleString()}`],
              ['Payment Mode', selectedOrder.paymentMode],
              ['Payment Status', selectedOrder.paymentStatus],
              ['Delivery Status', selectedOrder.deliveryStatus],
              ['Delivery Boy', selectedOrder.deliveryBoyName ?? 'Not assigned'],
              ['Order Date', new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')],
              ['Delivered On', selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleDateString('en-IN') : 'Pending'],
            ].map(([label, value]) => (
              <div key={String(label)} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #f0f5f0' }}>
                <span style={{ width: '150px', color: '#888', fontSize: '13px' }}>{label}</span>
                <span style={{ fontWeight: 500, color: '#1a2e1a', fontSize: '14px', wordBreak: 'break-all' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
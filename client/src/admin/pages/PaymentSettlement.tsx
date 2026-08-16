// src/pages/PaymentSettlement.tsx
import React, { useEffect, useState } from 'react';
import type { Payment, RefundRequest } from '../../types';
import { paymentApi } from '../../Config/appi';

const statusColor: Record<string, string> = {
  SETTLED: '#2d7a2d', PENDING: '#e67e22', REFUNDED: '#8e44ad', PARTIAL_REFUND: '#2d5fa1',
};

const PaymentSettlement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [walletBalance, setWalletBalance] = useState<{ balance: number; pendingSettlements: number } | null>(null);
  const [refundModal, setRefundModal] = useState<Payment | null>(null);
  const [refundData, setRefundData] = useState<Partial<RefundRequest>>({ refundType: 'FULL', reason: '' });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const [paymentsRes, walletRes] = await Promise.all([
        paymentApi.getAll(page, 10, filterStatus || undefined),
        paymentApi.getWalletBalance(),
      ]);
      setPayments(paymentsRes.data.data.content);
      setTotalPages(paymentsRes.data.data.totalPages);
      setWalletBalance(walletRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPayments(); }, [page, filterStatus]);

  const handleSettle = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await paymentApi.settleToFarmer(orderId);
      await loadPayments();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModal) return;
    try {
      await paymentApi.processRefund({
        orderId: refundModal.orderId,
        reason: refundData.reason ?? '',
        refundType: refundData.refundType ?? 'FULL',
        partialAmount: refundData.partialAmount,
      });
      setRefundModal(null);
      await loadPayments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a2e1a' }}>Payment & Settlement</h2>
        <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>Escrow wallet, farmer payouts, and refund management</p>
      </div>

      {/* Wallet / Escrow Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a2e1a, #2d4a2d)', borderRadius: '12px', padding: '24px', color: '#fff' }}>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px' }}>🏦 Admin Wallet (Escrow)</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>₹{walletBalance?.balance?.toLocaleString() ?? '—'}</div>
          <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>Available balance</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #e67e22' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>⏳ Pending Settlements</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#e67e22' }}>₹{walletBalance?.pendingSettlements?.toLocaleString() ?? '—'}</div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>To be paid to farmers</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #2d7a2d' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>📊 Payment Flow</div>
          <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.8' }}>
            Customer → Escrow<br />
            Escrow → Admin (fees)<br />
            Escrow → Farmer (net)
          </div>
        </div>
      </div>

      {/* Filter + Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1a2e1a' }}>Payment Records</h3>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', background: '#fff' }}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="SETTLED">Settled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
          <thead>
            <tr style={{ background: '#f8faf8', borderBottom: '2px solid #e8f0e8' }}>
              {['Order ID', 'Customer', 'Farmer', 'Total', 'Platform Fee', 'Delivery Fee', 'Net to Farmer', 'Mode', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No payment records found</td></tr>
            ) : payments.map((payment, i) => (
              <tr key={payment.id} style={{ borderBottom: '1px solid #f0f5f0', background: i % 2 === 0 ? '#fff' : '#fafcfa' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#2d5fa1', fontWeight: 600 }}>
                  #{payment.orderId.substring(0, 8)}
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>{payment.customerName}</td>
                <td style={{ padding: '10px 14px', color: '#555' }}>{payment.farmerName}</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1a2e1a' }}>₹{payment.totalAmount?.toLocaleString()}</td>
                <td style={{ padding: '10px 14px', color: '#e74c3c' }}>₹{payment.platformFee?.toLocaleString()}</td>
                <td style={{ padding: '10px 14px', color: '#e67e22' }}>₹{payment.deliveryFee?.toLocaleString()}</td>
                <td style={{ padding: '10px 14px', color: '#2d7a2d', fontWeight: 700 }}>₹{payment.netFarmerPayout?.toLocaleString()}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: payment.paymentMode === 'COD' ? '#fff3e0' : '#e3f2fd',
                    color: payment.paymentMode === 'COD' ? '#e65100' : '#1565c0',
                  }}>{payment.paymentMode}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: `${statusColor[payment.paymentStatus]}20`,
                    color: statusColor[payment.paymentStatus],
                  }}>{payment.paymentStatus}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {payment.paymentStatus === 'PENDING' && (
                      <button
                        onClick={() => handleSettle(payment.orderId)}
                        disabled={actionLoading === payment.orderId}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#2d7a2d', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                      >💸 Settle</button>
                    )}
                    {payment.paymentStatus === 'SETTLED' && (
                      <button
                        onClick={() => setRefundModal(payment)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#8e44ad', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                      >↩ Refund</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
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

      {/* Refund Modal */}
      {refundModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '440px', width: '90%' }}>
            <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#1a2e1a' }}>Process Refund</h3>
            <p style={{ margin: '0 0 20px', color: '#555', fontSize: '14px' }}>Order #{refundModal.orderId.substring(0, 8)} — Total: ₹{refundModal.totalAmount?.toLocaleString()}</p>
            <form onSubmit={handleRefund}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Refund Type</label>
                <select
                  value={refundData.refundType}
                  onChange={e => setRefundData(prev => ({ ...prev, refundType: e.target.value as 'FULL' | 'PARTIAL' }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                >
                  <option value="FULL">Full Refund</option>
                  <option value="PARTIAL">Partial Refund</option>
                </select>
              </div>
              {refundData.refundType === 'PARTIAL' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Partial Amount (₹)</label>
                  <input
                    type="number"
                    max={refundModal.totalAmount}
                    value={refundData.partialAmount ?? ''}
                    onChange={e => setRefundData(prev => ({ ...prev, partialAmount: Number(e.target.value) }))}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              )}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Reason</label>
                <textarea
                  value={refundData.reason}
                  onChange={e => setRefundData(prev => ({ ...prev, reason: e.target.value }))}
                  required
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
                  placeholder="Reason for refund..."
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setRefundModal(null)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#8e44ad', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                  Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettlement;
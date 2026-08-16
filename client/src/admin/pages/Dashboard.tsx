// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../Config/appi';
import type { DashboardStats } from '../../types';


const StatCard: React.FC<{
  label: string; value: string | number;
  icon: string; color: string; sub?: string;
}> = ({ label, value, icon, color, sub }) => (
  <div style={{
    background: '#fff', borderRadius: '12px', padding: '24px',
    borderLeft: `4px solid ${color}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', alignItems: 'center', gap: '16px',
  }}>
    <div style={{
      width: '52px', height: '52px', borderRadius: '12px',
      background: `${color}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px',
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a2e1a' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{sub}</div>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌾</div>
      <div>Loading dashboard...</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a2e1a' }}>
          Welcome back, Admin 👋
        </h2>
        <p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>
          Here's what's happening on your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px', marginBottom: '32px',
      }}>
        <StatCard label="Total Farmers" value={stats?.totalFarmers ?? 0} icon="👨‍🌾" color="#2d7a2d" sub="Registered farmers" />
        <StatCard label="Total Customers" value={stats?.totalCustomers ?? 0} icon="👥" color="#2d5fa1" sub="Active buyers" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon="📦" color="#e67e22" sub="All time orders" />
        <StatCard label="Total Revenue" value={`₹${((stats?.totalRevenue ?? 0) / 1000).toFixed(1)}K`} icon="💰" color="#8e44ad" sub="Platform earnings" />
        <StatCard label="Pending Approvals" value={stats?.pendingApprovals ?? 0} icon="⏳" color="#e74c3c" sub="Farmers awaiting review" />
        <StatCard label="Active Deliveries" value={stats?.activeDeliveries ?? 0} icon="🚚" color="#16a085" sub="In progress" />
      </div>

      {/* Quick Action Cards */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#1a2e1a' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Approve Farmers', icon: '✅', path: '/farmers?status=PENDING', color: '#2d7a2d' },
            { label: 'Pending Payments', icon: '💳', path: '/payments?status=PENDING', color: '#8e44ad' },
            { label: 'Active Orders', icon: '📋', path: '/orders?status=DISPATCHED', color: '#e67e22' },
            { label: 'Delivery Issues', icon: '⚠️', path: '/delivery', color: '#e74c3c' },
          ].map(action => (
            <a
              key={action.path}
              href={action.path}
              style={{
                background: '#fff', borderRadius: '10px', padding: '16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                textDecoration: 'none', color: '#1a2e1a',
                border: '1px solid #e8f0e8',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
                fontSize: '14px', fontWeight: 500,
              }}
            >
              <span style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: `${action.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>{action.icon}</span>
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
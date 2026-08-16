import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import {
    fetchMyDeliveries,
    fetchNearbyOrders,
    acceptDeliveryOrder,
    completeDeliveryOrder,
} from '../../../Redux Toolkit/Delivery/deliveryOrderSlice';
import { updateDeliveryLocation } from '../../../Redux Toolkit/Delivery/deliveryAuthSlice';
import { api } from '../../../Config/Api';

// ─── Colour helpers ──────────────────────────────────────────────────────────
const PRIMARY   = '#00927c';
const PRIMARY_BG = '#f0fdf9';
const PRIMARY_BORDER = '#a7f3d0';

const statusMeta: Record<string, { color: string; bg: string; label: string }> = {
    DELIVERED:  { color: '#16a34a', bg: '#dcfce7', label: '✅ Delivered' },
    PENDING:    { color: '#d97706', bg: '#fef3c7', label: '⏳ Pending' },
    ASSIGNED:   { color: PRIMARY,   bg: '#d1fae5', label: '📋 Assigned' },
    CANCELLED:  { color: '#ef4444', bg: '#fee2e2', label: '❌ Cancelled' },
};
const getStatus = (s: string) =>
    statusMeta[s] || { color: '#6b7280', bg: '#f3f4f6', label: s };

// ─── Sub-component: Stat Card ─────────────────────────────────────────────
const StatCard = ({
    label, value, icon, color, bg,
}: { label: string; value: string | number; icon: string; color: string; bg: string }) => (
    <div style={{
        background: bg,
        borderRadius: 16,
        padding: '20px 18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: `1.5px solid ${color}22`,
        transition: 'transform 0.15s',
    }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
        <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
);

// ─── Sub-component: Order Card ────────────────────────────────────────────
const OrderCard = ({
    order, isNearby, actionLoading, onAccept, onComplete,
}: {
    order: any; isNearby: boolean; actionLoading: number | null;
    onAccept: (id: number) => void; onComplete: (id: number) => void;
}) => {
    const isLoading = actionLoading === order.id;
    const statusInfo = getStatus(order.deliveryStatus || 'PENDING');
    const isDelivered = order.deliveryStatus === 'DELIVERED';

    return (
        <div style={{
            border: `1.5px solid ${isDelivered ? PRIMARY_BORDER : '#e5e7eb'}`,
            borderRadius: 14,
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
            background: isDelivered ? PRIMARY_BG : '#fff',
            transition: 'box-shadow 0.2s',
        }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
            <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#1a2e1a' }}>
                        #{order.orderId || order.id}
                    </span>
                    <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: statusInfo.bg, color: statusInfo.color,
                    }}>
                        {statusInfo.label}
                    </span>
                    {isNearby && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>
                            📍 {order.shippingAddress?.pinCode}
                        </span>
                    )}
                </div>
                <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 4 }}>
                    📍 {order.shippingAddress?.address}, {order.shippingAddress?.city} — {order.shippingAddress?.pinCode}
                </div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                    💰 ₹{order.totalSellingPrice}&nbsp;|&nbsp;
                    <span style={{ color: PRIMARY, fontWeight: 600 }}>
                        🚚 ₹{order.deliveryCharge ? (order.deliveryCharge * 0.7).toFixed(0) : 0} you earn
                    </span>
                </div>
                {order.orderItems?.length > 0 && (
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        🌾 {order.orderItems.map((i: any) => `${i.productTitle} ×${i.quantity}`).join(', ')}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {isNearby && !isDelivered && (
                    <button
                        onClick={() => onAccept(order.id)}
                        disabled={isLoading}
                        style={{
                            padding: '9px 18px', borderRadius: 10, border: 'none',
                            background: isLoading ? '#e5e7eb' : `linear-gradient(135deg, ${PRIMARY}, #0d7a67)`,
                            color: '#fff', fontSize: 13, fontWeight: 700,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isLoading ? 'none' : `0 4px 12px ${PRIMARY}44`,
                        }}
                    >
                        {isLoading ? '⏳ Accepting…' : '✅ Accept'}
                    </button>
                )}
                {!isNearby && !isDelivered && order.deliveryStatus !== 'CANCELLED' && (
                    <button
                        onClick={() => onComplete(order.id)}
                        disabled={isLoading}
                        style={{
                            padding: '9px 18px', borderRadius: 10, border: 'none',
                            background: isLoading ? '#e5e7eb' : 'linear-gradient(135deg, #16a34a, #15803d)',
                            color: '#fff', fontSize: 13, fontWeight: 700,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(22,163,74,0.3)',
                        }}
                    >
                        {isLoading ? '⏳ Updating…' : '🏁 Mark Delivered'}
                    </button>
                )}
                {isDelivered && <span style={{ fontSize: 20 }}>✅</span>}
            </div>
        </div>
    );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const DeliveryHomePage = () => {
    const dispatch = useAppDispatch();
    const { deliveryAuth, deliveryOrder } = useAppSelector(store => store);
    const profile = deliveryAuth.profile;

    const [cityInput, setCityInput] = useState(profile?.currentCity || '');
    const [pincodeInput, setPincodeInput] = useState(profile?.currentPincode || '');
    const [locationSaved, setLocationSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'assigned' | 'nearby'>('assigned');
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState(profile?.deliveryStatus || 'AVAILABLE');

    useEffect(() => {
        dispatch(fetchMyDeliveries());
        dispatch(fetchNearbyOrders());
    }, [dispatch]);

    useEffect(() => {
        if (profile?.deliveryStatus) setOnlineStatus(profile.deliveryStatus);
        if (profile?.currentCity)    setCityInput(profile.currentCity);
        if (profile?.currentPincode) setPincodeInput(profile.currentPincode);
    }, [profile]);

    const handleSaveLocation = () => {
        dispatch(updateDeliveryLocation({ currentCity: cityInput, currentPincode: pincodeInput }));
        setLocationSaved(true);
        setTimeout(() => setLocationSaved(false), 3000);
        setTimeout(() => dispatch(fetchNearbyOrders()), 500);
    };

    const handleToggleStatus = async () => {
        const newStatus = onlineStatus === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
        setStatusUpdating(true);
        try {
            const jwt = localStorage.getItem('delivery_jwt');
            await api.patch(`/delivery/status?status=${newStatus}`, {}, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            setOnlineStatus(newStatus);
        } catch { /* ignore */ }
        setStatusUpdating(false);
    };

    const todayOrders = deliveryOrder.myOrders.filter(o =>
        new Date(o.orderDate).toDateString() === new Date().toDateString()
    );
    const completedToday = deliveryOrder.myOrders.filter(o => o.deliveryStatus === 'DELIVERED').length;
    const totalEarnings = profile?.totalEarnings ?? 0;
    const isOnline = onlineStatus === 'AVAILABLE';

    const statCards = [
        { label: "Today's Orders",   value: todayOrders.length,              icon: '📦', color: PRIMARY,    bg: '#f0fdf9' },
        { label: 'Completed Today',  value: completedToday,                  icon: '✅', color: '#16a34a',  bg: '#f0fdf4' },
        { label: 'Total Completed',  value: profile?.completedOrders || 0,   icon: '🏆', color: '#7c3aed',  bg: '#f5f3ff' },
        { label: 'Total Earnings',   value: `₹${totalEarnings.toFixed(0)}`,  icon: '💰', color: '#d97706',  bg: '#fffbeb' },
        { label: 'Rating',           value: `⭐ ${(profile?.rating || 0).toFixed(1)}`, icon: '⭐', color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Nearby Orders',    value: deliveryOrder.nearbyOrders.length, icon: '📍', color: '#0891b2', bg: '#ecfeff' },
    ];

    const tabOrders = activeTab === 'assigned' ? deliveryOrder.myOrders : deliveryOrder.nearbyOrders;

    return (
        <div style={{ fontFamily: "'Open Sans', sans-serif" }}>

            {/* ─── Header ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a2e1a', margin: 0 }}>
                        🚚 Welcome back, {profile?.name || 'Delivery Partner'}!
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Online / Offline toggle */}
                <button
                    onClick={handleToggleStatus}
                    disabled={statusUpdating}
                    style={{
                        padding: '10px 22px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: 14,
                        cursor: statusUpdating ? 'not-allowed' : 'pointer',
                        background: isOnline
                            ? `linear-gradient(135deg, ${PRIMARY}, #0d7a67)`
                            : 'linear-gradient(135deg, #6b7280, #4b5563)',
                        color: '#fff',
                        boxShadow: isOnline ? `0 4px 14px ${PRIMARY}44` : '0 4px 14px rgba(107,114,128,0.3)',
                        transition: 'all 0.3s',
                    }}
                >
                    {statusUpdating ? '⏳…' : isOnline ? '🟢 Online' : '⚫ Offline'}
                </button>
            </div>

            {/* ─── Account Status Warning ────────────────────────────────── */}
            {profile && profile.accountStatus !== 'ACTIVE' && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    border: '1.5px solid #f59e0b', borderRadius: 12,
                    padding: '14px 20px', marginBottom: 24,
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <span style={{ fontSize: 22 }}>⏳</span>
                    <div>
                        <div style={{ fontWeight: 700, color: '#92400e' }}>Account Pending Approval</div>
                        <div style={{ fontSize: 13, color: '#78350f', marginTop: 2 }}>
                            Your account is under review. You can browse orders, but deliveries will be enabled after admin approval.
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Stats Grid ───────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
                {statCards.map(card => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            {/* ─── Today's Earnings Progress ────────────────────────────── */}
            {(() => {
                const todayTarget = 500;
                const todayEarned = completedToday * 40; // estimate ₹40/delivery
                const pct = Math.min(100, Math.round((todayEarned / todayTarget) * 100));
                return (
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '20px 24px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                        border: `1.5px solid ${PRIMARY_BORDER}`, marginBottom: 24,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontWeight: 700, color: '#1a2e1a', fontSize: 14 }}>💹 Today's Earnings Progress</span>
                            <span style={{ fontWeight: 800, color: PRIMARY, fontSize: 14 }}>
                                ₹{todayEarned} / ₹{todayTarget} target
                            </span>
                        </div>
                        <div style={{ background: '#e5e7eb', borderRadius: 100, height: 10, overflow: 'hidden' }}>
                            <div style={{
                                width: `${pct}%`, height: '100%', borderRadius: 100,
                                background: `linear-gradient(90deg, ${PRIMARY}, #16a34a)`,
                                transition: 'width 0.6s ease',
                            }} />
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                            {pct}% of daily target • {completedToday} deliveries completed
                        </div>
                    </div>
                );
            })()}

            {/* ─── Location Updater ─────────────────────────────────────── */}
            <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 28,
                border: `1.5px solid #e5e7eb`,
            }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: 700, color: '#1a2e1a', fontSize: 16 }}>
                    📍 Update Your Location
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px' }}>
                    Keep your location updated so we can show you orders in your area.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>City</label>
                        <input
                            value={cityInput}
                            onChange={e => setCityInput(e.target.value)}
                            placeholder="e.g. Jaipur"
                            style={{
                                width: '100%', padding: '10px 14px',
                                border: `1.5px solid ${cityInput ? PRIMARY_BORDER : '#e5e7eb'}`,
                                borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>Pincode</label>
                        <input
                            value={pincodeInput}
                            onChange={e => setPincodeInput(e.target.value)}
                            placeholder="e.g. 302001"
                            style={{
                                width: '100%', padding: '10px 14px',
                                border: `1.5px solid ${pincodeInput ? PRIMARY_BORDER : '#e5e7eb'}`,
                                borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSaveLocation}
                        style={{
                            padding: '11px 24px', borderRadius: 10, border: 'none',
                            background: locationSaved ? '#16a34a' : `linear-gradient(135deg, ${PRIMARY}, #0d7a67)`,
                            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            boxShadow: `0 4px 12px ${PRIMARY}44`, transition: 'all 0.3s',
                        }}
                    >
                        {locationSaved ? '✅ Saved!' : 'Save Location'}
                    </button>
                </div>
            </div>

            {/* ─── Orders Tabs ──────────────────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1.5px solid #e5e7eb' }}>
                {/* Tab Header */}
                <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6', padding: '0 24px' }}>
                    {[
                        { key: 'assigned', label: `My Assigned (${deliveryOrder.myOrders.length})`, icon: '🚚' },
                        { key: 'nearby',   label: `Nearby Route (${deliveryOrder.nearbyOrders.length})`, icon: '🗺️' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            style={{
                                padding: '14px 20px', border: 'none', background: 'none',
                                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                color: activeTab === tab.key ? PRIMARY : '#6b7280',
                                borderBottom: activeTab === tab.key ? `2.5px solid ${PRIMARY}` : '2.5px solid transparent',
                                marginBottom: -2, transition: 'color 0.2s',
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Nearby Route Info Banner */}
                {activeTab === 'nearby' && (
                    <div style={{
                        margin: '16px 24px 0',
                        background: `linear-gradient(135deg, ${PRIMARY_BG}, #d1fae5)`,
                        border: `1.5px solid ${PRIMARY_BORDER}`, borderRadius: 12,
                        padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'center',
                    }}>
                        <span style={{ fontSize: 20 }}>🗺️</span>
                        <div>
                            <div style={{ fontWeight: 700, color: PRIMARY, fontSize: 13 }}>Route Optimizer</div>
                            <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
                                Accept multiple orders in the same area to maximise your earnings per trip!
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders List */}
                <div style={{ padding: 24 }}>
                    {deliveryOrder.loading ? (
                        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>⏳</div>
                            Loading orders…
                        </div>
                    ) : tabOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>{activeTab === 'assigned' ? '📭' : '🗺️'}</div>
                            <div style={{ color: '#6b7280', fontWeight: 600 }}>
                                {activeTab === 'assigned'
                                    ? 'No orders assigned yet'
                                    : 'No nearby orders. Update your location above to see local orders.'}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {tabOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    isNearby={activeTab === 'nearby'}
                                    actionLoading={deliveryOrder.actionLoading}
                                    onAccept={id => dispatch(acceptDeliveryOrder(id))}
                                    onComplete={id => dispatch(completeDeliveryOrder(id))}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryHomePage;

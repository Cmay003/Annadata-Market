import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import {
    fetchMyDeliveries,
    fetchNearbyOrders,
    acceptDeliveryOrder,
    pickupDeliveryOrder,
    completeDeliveryOrder,
    clearDeliveryOrderError,
} from '../../../Redux Toolkit/Delivery/deliveryOrderSlice';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const PRIMARY       = '#00927c';
const PRIMARY_LIGHT = '#f0fdf9';
const PRIMARY_BORDER = '#a7f3d0';

type Tab = 'active' | 'completed' | 'nearby';

// ─── OTP Modal ────────────────────────────────────────────────────────────────
const OtpModal = ({
    orderId, onConfirm, onCancel, loading, error,
}: {
    orderId: number;
    onConfirm: (otp: string) => void;
    onCancel: () => void;
    loading: boolean;
    error: string | null;
}) => {
    const [otp, setOtp] = useState('');

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                background: '#fff', borderRadius: 20, padding: 36, width: 360,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                animation: 'fadeInUp 0.2s ease',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1a2e1a' }}>
                        Enter Delivery OTP
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>
                        Ask the customer for their 6-digit OTP to confirm delivery of Order #{orderId}
                    </p>
                </div>

                <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    style={{
                        width: '100%', padding: '14px 16px', fontSize: 22,
                        letterSpacing: 8, textAlign: 'center', fontWeight: 800,
                        border: `2px solid ${error ? '#ef4444' : PRIMARY}`,
                        borderRadius: 12, outline: 'none', boxSizing: 'border-box',
                        color: '#1a2e1a', background: PRIMARY_LIGHT,
                    }}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && otp.length === 6 && onConfirm(otp)}
                />

                {error && (
                    <div style={{
                        marginTop: 10, padding: '10px 14px', background: '#fee2e2',
                        borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 600,
                    }}>
                        ❌ {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                            background: '#fff', color: '#374151', fontSize: 14, fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(otp)}
                        disabled={loading || otp.length !== 6}
                        style={{
                            flex: 2, padding: '12px', borderRadius: 10, border: 'none',
                            background: loading || otp.length !== 6
                                ? '#e5e7eb'
                                : `linear-gradient(135deg, #16a34a, #15803d)`,
                            color: loading || otp.length !== 6 ? '#9ca3af' : '#fff',
                            fontSize: 14, fontWeight: 700,
                            cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                            boxShadow: loading || otp.length !== 6 ? 'none' : '0 4px 12px rgba(22,163,74,0.3)',
                        }}
                    >
                        {loading ? '⏳ Verifying…' : '✅ Confirm Delivery'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
        DELIVERED:       { bg: '#dcfce7', color: '#16a34a', label: '✅ Delivered' },
        PENDING:         { bg: '#fef3c7', color: '#d97706', label: '⏳ Pending' },
        PLACED:          { bg: '#fef3c7', color: '#d97706', label: '⏳ Placed' },
        ASSIGNED:        { bg: '#d1fae5', color: PRIMARY,   label: '📋 Assigned' },
        OUT_FOR_DELIVERY:{ bg: '#bfdbfe', color: '#1d4ed8', label: '🚴 Out for Delivery' },
        IN_TRANSIT:      { bg: '#bfdbfe', color: '#1d4ed8', label: '🚴 In Transit' },
        CANCELLED:       { bg: '#fee2e2', color: '#ef4444', label: '❌ Cancelled' },
        READY_FOR_PICKUP:{ bg: '#fef9c3', color: '#a16207', label: '📦 Ready for Pickup' },
    };
    const s = map[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
    return (
        <span style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: s.bg, color: s.color,
        }}>
            {s.label}
        </span>
    );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({
    order, tab, actionLoading,
    onAccept, onPickup, onComplete,
}: {
    order: any; tab: Tab; actionLoading: number | null;
    onAccept: (id: number) => void;
    onPickup: (id: number) => void;
    onComplete: (id: number) => void;
}) => {
    const isLoading = actionLoading === order.id;
    const isDelivered = order.orderStatus === 'DELIVERED';
    const deliveryEarn = order.deliveryCharge ? (order.deliveryCharge * 0.7).toFixed(0) : '0';

    // Active order: determine which action button to show
    const isAssigned  = order.deliveryStatus === 'ASSIGNED' && order.orderStatus !== 'IN_TRANSIT';
    const isInTransit = order.orderStatus === 'IN_TRANSIT' || order.deliveryStatus === 'OUT_FOR_DELIVERY';

    return (
        <div style={{
            background: isDelivered ? PRIMARY_LIGHT : '#fff',
            borderRadius: 16,
            border: `1.5px solid ${isDelivered ? PRIMARY_BORDER : '#e5e7eb'}`,
            padding: 22,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s, transform 0.15s',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)';
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: '#1a2e1a' }}>
                        Order #{order.orderId || order.id}
                    </span>
                    <StatusBadge status={order.orderStatus || order.deliveryStatus || 'PENDING'} />
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            </div>

            {/* Products */}
            {order.orderItems?.length > 0 && (
                <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                    {order.orderItems.map((item: any, i: number) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '8px 14px', fontSize: 13,
                            background: i % 2 === 0 ? '#fafafa' : '#fff',
                        }}>
                            <span style={{ color: '#374151' }}>
                                🌾 {item.productTitle || item.product?.title || 'Item'} × {item.quantity}
                            </span>
                            <span style={{ fontWeight: 600, color: '#1a2e1a' }}>₹{item.sellingPrice}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Address + Earnings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' }}>
                        📍 Delivery Address
                    </div>
                    <div style={{ fontSize: 13, color: '#1a2e1a', fontWeight: 600, lineHeight: 1.5 }}>
                        {order.shippingAddress?.address},<br />
                        {order.shippingAddress?.city} — {order.shippingAddress?.pinCode}
                    </div>
                </div>
                <div style={{ background: PRIMARY_LIGHT, borderRadius: 10, padding: 14, border: `1px solid ${PRIMARY_BORDER}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' }}>
                        💰 Your Earnings
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>₹{deliveryEarn}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                        70% of ₹{order.deliveryCharge} delivery fee
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>

                {/* Nearby tab: Accept button */}
                {tab === 'nearby' && (
                    <button
                        onClick={() => onAccept(order.id)}
                        disabled={isLoading}
                        style={{
                            padding: '10px 24px', borderRadius: 10, border: 'none',
                            background: isLoading ? '#e5e7eb' : `linear-gradient(135deg, ${PRIMARY}, #0d7a67)`,
                            color: '#fff', fontSize: 13, fontWeight: 700,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isLoading ? 'none' : `0 4px 12px ${PRIMARY}44`,
                        }}
                    >
                        {isLoading ? '⏳ Accepting…' : '✅ Accept This Delivery'}
                    </button>
                )}

                {/* Active tab — Step 1: Pickup from farmer */}
                {tab === 'active' && isAssigned && (
                    <button
                        onClick={() => onPickup(order.id)}
                        disabled={isLoading}
                        style={{
                            padding: '10px 24px', borderRadius: 10, border: 'none',
                            background: isLoading ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: '#fff', fontSize: 13, fontWeight: 700,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(245,158,11,0.3)',
                        }}
                    >
                        {isLoading ? '⏳ Updating…' : '📦 Confirm Pickup from Farmer'}
                    </button>
                )}

                {/* Active tab — Step 2: Enter OTP to deliver */}
                {tab === 'active' && isInTransit && !isDelivered && (
                    <button
                        onClick={() => onComplete(order.id)}
                        disabled={isLoading}
                        style={{
                            padding: '10px 24px', borderRadius: 10, border: 'none',
                            background: isLoading ? '#e5e7eb' : 'linear-gradient(135deg, #16a34a, #15803d)',
                            color: '#fff', fontSize: 13, fontWeight: 700,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(22,163,74,0.3)',
                        }}
                    >
                        {isLoading ? '⏳ Verifying OTP…' : '🔐 Enter OTP & Complete Delivery'}
                    </button>
                )}

                {tab === 'active' && isDelivered && (
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>
                        ✅ Delivered Successfully
                    </span>
                )}
            </div>
        </div>
    );
};

// ─── Route Optimizer: group orders by pincode ─────────────────────────────────
const RouteOptimizerView = ({
    orders, actionLoading, onAccept,
}: { orders: any[]; actionLoading: number | null; onAccept: (id: number) => void }) => {
    const groups: Record<string, any[]> = {};
    orders.forEach(o => {
        const pin = o.shippingAddress?.pinCode || 'Unknown';
        if (!groups[pin]) groups[pin] = [];
        groups[pin].push(o);
    });

    if (orders.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
                <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15 }}>
                    No orders ready for pickup nearby.
                </div>
                <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>
                    Orders appear here when a seller marks them "Ready for Pickup" in your city.
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Summary */}
            <div style={{
                background: `linear-gradient(135deg, ${PRIMARY_LIGHT}, #d1fae5)`,
                border: `1.5px solid ${PRIMARY_BORDER}`, borderRadius: 14, padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
            }}>
                <div>
                    <div style={{ fontWeight: 700, color: PRIMARY, fontSize: 15 }}>🗺️ Route Optimizer</div>
                    <div style={{ fontSize: 13, color: '#047857', marginTop: 3 }}>
                        {orders.length} order{orders.length > 1 ? 's' : ''} across {Object.keys(groups).length} pincode{Object.keys(groups).length > 1 ? 's' : ''}.
                        Accept orders in the same area to batch-deliver and maximise earnings!
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>
                        ₹{orders.reduce((s, o) => s + (o.deliveryCharge ? o.deliveryCharge * 0.7 : 0), 0).toFixed(0)}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>potential earnings</div>
                </div>
            </div>

            {/* Pincode groups */}
            {Object.entries(groups).map(([pin, groupOrders]) => (
                <div key={pin}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                            background: PRIMARY, color: '#fff', fontSize: 12, fontWeight: 700,
                            padding: '4px 14px', borderRadius: 20,
                        }}>
                            📍 Pincode {pin}
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>
                            {groupOrders.length} order{groupOrders.length > 1 ? 's' : ''} · ₹
                            {groupOrders.reduce((s, o) => s + (o.deliveryCharge ? o.deliveryCharge * 0.7 : 0), 0).toFixed(0)} earnings
                        </div>
                        {groupOrders.length > 1 && (
                            <span style={{
                                fontSize: 11, background: '#fef3c7', color: '#d97706',
                                padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                            }}>
                                🔥 Batch opportunity!
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }}>
                        {groupOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                tab="nearby"
                                actionLoading={actionLoading}
                                onAccept={onAccept}
                                onPickup={() => {}}
                                onComplete={() => {}}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MyOrders = ({ initialTab = 'active' }: { initialTab?: Tab }) => {
    const dispatch = useAppDispatch();
    const { deliveryOrder } = useAppSelector(store => store);
    const [activeTab, setActiveTab] = useState<Tab>(initialTab as Tab);
    const [otpModalOrderId, setOtpModalOrderId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchMyDeliveries());
        dispatch(fetchNearbyOrders());
        // Refresh every 30 seconds
        const interval = setInterval(() => {
            dispatch(fetchMyDeliveries());
            dispatch(fetchNearbyOrders());
        }, 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    // Clear action error when modal opens/closes
    useEffect(() => {
        if (otpModalOrderId === null) {
            dispatch(clearDeliveryOrderError());
        }
    }, [otpModalOrderId, dispatch]);

    const activeOrders    = deliveryOrder.myOrders.filter(o =>
        o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
    );
    const completedOrders = deliveryOrder.myOrders.filter(o => o.orderStatus === 'DELIVERED');
    const nearbyOrders    = deliveryOrder.nearbyOrders;

    const tabs = [
        { key: 'active',    label: `Active (${activeOrders.length})`,            icon: '🚚' },
        { key: 'completed', label: `Completed (${completedOrders.length})`,       icon: '✅' },
        { key: 'nearby',    label: `Route Optimizer (${nearbyOrders.length})`,    icon: '🗺️' },
    ];

    const tabMap: Record<Tab, any[]> = {
        active: activeOrders,
        completed: completedOrders,
        nearby: nearbyOrders,
    };

    const emptyMessages: Record<Tab, string> = {
        active:    'No active deliveries right now.',
        completed: 'No completed deliveries yet.',
        nearby:    'No nearby orders — update your location from the Dashboard.',
    };

    const handlePickup = (orderId: number) => {
        dispatch(pickupDeliveryOrder(orderId));
    };

    const handleCompleteRequest = (orderId: number) => {
        setOtpModalOrderId(orderId);
    };

    const handleOtpConfirm = async (otp: string) => {
        if (otpModalOrderId === null) return;
        const result = await dispatch(completeDeliveryOrder({ orderId: otpModalOrderId, otp }));
        if (completeDeliveryOrder.fulfilled.match(result)) {
            setOtpModalOrderId(null); // close modal on success
        }
        // On failure, keep modal open so user can retry
    };

    return (
        <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
            {/* OTP Modal */}
            {otpModalOrderId !== null && (
                <OtpModal
                    orderId={otpModalOrderId}
                    onConfirm={handleOtpConfirm}
                    onCancel={() => setOtpModalOrderId(null)}
                    loading={deliveryOrder.actionLoading === otpModalOrderId}
                    error={deliveryOrder.actionError}
                />
            )}

            {/* Page header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a2e1a', margin: 0 }}>My Deliveries</h2>
                <p style={{ color: '#6b7280', marginTop: 4, fontSize: 13 }}>
                    Track, manage, and optimise all your delivery assignments
                </p>
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as Tab)}
                        style={{
                            padding: '10px 20px', borderRadius: 10,
                            border: `1.5px solid ${activeTab === tab.key ? PRIMARY : '#e5e7eb'}`,
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            background: activeTab === tab.key ? PRIMARY : '#fff',
                            color: activeTab === tab.key ? '#fff' : '#4b5563',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === tab.key ? `0 4px 12px ${PRIMARY}33` : 'none',
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Content ───────────────────────────────────────────────── */}
            {deliveryOrder.loading && deliveryOrder.myOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                    Loading orders…
                </div>
            ) : activeTab === 'nearby' ? (
                <RouteOptimizerView
                    orders={nearbyOrders}
                    actionLoading={deliveryOrder.actionLoading}
                    onAccept={id => dispatch(acceptDeliveryOrder(id))}
                />
            ) : tabMap[activeTab].length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb' }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>
                        {activeTab === 'active' ? '📭' : '🏆'}
                    </div>
                    <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15 }}>
                        {emptyMessages[activeTab]}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {tabMap[activeTab].map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            tab={activeTab}
                            actionLoading={deliveryOrder.actionLoading}
                            onAccept={id => dispatch(acceptDeliveryOrder(id))}
                            onPickup={handlePickup}
                            onComplete={handleCompleteRequest}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;

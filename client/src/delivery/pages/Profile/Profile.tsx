import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchDeliveryProfile, updateDeliveryLocation } from '../../../Redux Toolkit/Delivery/deliveryAuthSlice';

const PRIMARY        = '#00927c';
const PRIMARY_LIGHT  = '#f0fdf9';
const PRIMARY_BORDER = '#a7f3d0';

const DeliveryProfile = () => {
    const dispatch = useAppDispatch();
    const { deliveryAuth } = useAppSelector(store => store);
    const profile = deliveryAuth.profile;

    const [city, setCity]       = useState(profile?.currentCity || '');
    const [pincode, setPincode] = useState(profile?.currentPincode || '');
    const [saved, setSaved]     = useState(false);

    useEffect(() => { dispatch(fetchDeliveryProfile()); }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setCity(profile.currentCity || '');
            setPincode(profile.currentPincode || '');
        }
    }, [profile]);

    const handleSave = () => {
        dispatch(updateDeliveryLocation({ currentCity: city, currentPincode: pincode }));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (!profile) {
        return (
            <div style={{ textAlign: 'center', padding: 60, color: '#6b7280', fontFamily: "'Open Sans', sans-serif" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                Loading profile…
            </div>
        );
    }

    const successRate = profile.completedOrders + profile.cancelledOrders > 0
        ? Math.round((profile.completedOrders / (profile.completedOrders + profile.cancelledOrders)) * 100)
        : 0;

    const isActive = profile.accountStatus === 'ACTIVE';

    return (
        <div style={{ fontFamily: "'Open Sans', sans-serif", maxWidth: 720 }}>
            {/* Page header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a2e1a', margin: 0 }}>My Profile</h2>
                <p style={{ color: '#6b7280', marginTop: 4, fontSize: 13 }}>
                    Your delivery account details and performance statistics
                </p>
            </div>

            {/* ─── Account Status Banner ─────────────────────────────────── */}
            <div style={{
                padding: '14px 20px', borderRadius: 14, marginBottom: 24,
                display: 'flex', alignItems: 'center', gap: 14,
                background: isActive ? PRIMARY_LIGHT : '#fef3c7',
                border: `1.5px solid ${isActive ? PRIMARY_BORDER : '#fbbf24'}`,
            }}>
                <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: isActive
                        ? `linear-gradient(135deg, ${PRIMARY}, #0d7a67)`
                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                    {isActive ? '✅' : '⏳'}
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: isActive ? PRIMARY : '#92400e', fontSize: 15 }}>
                        Account {isActive ? 'Active' : 'Pending Approval'}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                        {isActive
                            ? 'You are fully approved and can accept deliveries.'
                            : 'Admin is reviewing your account. You can see orders but cannot deliver yet.'}
                    </div>
                </div>
            </div>

            {/* ─── Profile Card ──────────────────────────────────────────── */}
            <div style={{
                background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb',
                padding: 28, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 24,
            }}>
                {/* Avatar row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                    <div style={{
                        width: 76, height: 76, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${PRIMARY}, #0d7a67)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, fontWeight: 800, color: '#fff',
                        boxShadow: `0 4px 16px ${PRIMARY}44`,
                    }}>
                        {profile.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#1a2e1a' }}>{profile.name}</div>
                        <div style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{profile.email}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>📱 {profile.phone}</div>
                    </div>
                </div>

                {/* Details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                        { label: 'Vehicle Type',   value: profile.vehicleType   || 'N/A',     icon: '🚗' },
                        { label: 'Vehicle Number', value: profile.vehicleNumber || 'N/A',     icon: '🔢' },
                        { label: 'Current City',   value: profile.currentCity   || 'Not set', icon: '🏙️' },
                        { label: 'Pincode',        value: profile.currentPincode|| 'Not set', icon: '📮' },
                    ].map(field => (
                        <div key={field.label} style={{
                            background: '#f9fafb', borderRadius: 12, padding: 14,
                            border: '1px solid #f3f4f6',
                        }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 6 }}>
                                {field.icon} {field.label}
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2e1a' }}>{field.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Performance Stats ─────────────────────────────────────── */}
            <div style={{
                background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb',
                padding: 28, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 24,
            }}>
                <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#1a2e1a', fontSize: 16 }}>
                    📊 Performance
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14 }}>
                    {[
                        { label: 'Rating',       value: `⭐ ${profile.rating?.toFixed(1) || '0.0'}`, color: '#f59e0b' },
                        { label: 'Completed',    value: profile.completedOrders,                     color: PRIMARY     },
                        { label: 'Cancelled',    value: profile.cancelledOrders,                     color: '#ef4444'   },
                        { label: 'Success Rate', value: `${successRate}%`,                           color: successRate >= 80 ? PRIMARY : '#f59e0b' },
                        { label: 'Earnings',     value: `₹${profile.totalEarnings?.toFixed(0) || 0}`, color: '#7c3aed' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            background: `${stat.color}12`,
                            border: `1.5px solid ${stat.color}30`,
                            borderRadius: 12, padding: '16px 14px', textAlign: 'center',
                            transition: 'transform 0.15s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Update Location ───────────────────────────────────────── */}
            <div style={{
                background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb',
                padding: 28, boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}>
                <h3 style={{ margin: '0 0 8px', fontWeight: 700, color: '#1a2e1a', fontSize: 16 }}>
                    📍 Update Delivery Area
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>
                    Keep this updated so the Route Optimizer shows you nearby orders in your area.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 150 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6 }}>City</label>
                        <input
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            placeholder="e.g. Jaipur"
                            style={{
                                width: '100%', padding: '10px 14px',
                                border: `1.5px solid ${city ? PRIMARY_BORDER : '#e5e7eb'}`,
                                borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6 }}>Pincode</label>
                        <input
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            placeholder="e.g. 302001"
                            style={{
                                width: '100%', padding: '10px 14px',
                                border: `1.5px solid ${pincode ? PRIMARY_BORDER : '#e5e7eb'}`,
                                borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '11px 26px', borderRadius: 10, border: 'none',
                            background: saved ? '#16a34a' : `linear-gradient(135deg, ${PRIMARY}, #0d7a67)`,
                            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            boxShadow: `0 4px 12px ${PRIMARY}44`, transition: 'all 0.3s',
                        }}
                    >
                        {saved ? '✅ Saved!' : 'Save Location'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfile;

import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { deliveryLogout } from '../../../Redux Toolkit/Delivery/deliveryAuthSlice';

const PRIMARY       = '#00927c';
const PRIMARY_DARK  = '#006e5e';
const PRIMARY_LIGHT = '#f0fdf9';
const PRIMARY_BORDER = '#a7f3d0';

const navItems = [
    { name: 'Dashboard',       path: '/delivery',         icon: '📊', desc: 'Overview & stats' },
    { name: 'My Deliveries',   path: '/delivery/orders',  icon: '🚚', desc: 'Assigned orders' },
    { name: 'Route Optimizer', path: '/delivery/nearby',  icon: '🗺️', desc: 'Batch nearby orders' },
];

const bottomItems = [
    { name: 'My Profile', path: '/delivery/profile', icon: '👤' },
];

interface DrawerListProps {
    toggleDrawer?: (open: boolean) => () => void;
}

const DeliveryDrawerList = ({ toggleDrawer }: DrawerListProps) => {
    const dispatch    = useAppDispatch();
    const location    = useLocation();
    const navigate    = useNavigate();
    const { deliveryAuth } = useAppSelector(store => store);
    const profile     = deliveryAuth.profile;
    const isOnline    = profile?.deliveryStatus === 'AVAILABLE';

    const handleNav = (path: string) => {
        navigate(path);
        if (toggleDrawer) toggleDrawer(false)();
    };

    const handleLogout = () => {
        dispatch(deliveryLogout());
        navigate('/login');
        if (toggleDrawer) toggleDrawer(false)();
    };

    return (
        <div style={{
            width: 280,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', 'Open Sans', sans-serif",
            background: '#fff',
            borderRight: `1.5px solid ${PRIMARY_BORDER}`,
        }}>
            {/* ── Profile mini-card ───────────────────────────────── */}
            <div
                onClick={() => handleNav('/delivery/profile')}
                style={{
                    padding: '20px 20px 18px',
                    background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                    cursor: 'pointer',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Avatar */}
                    <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 800, color: '#fff',
                        border: '2.5px solid rgba(255,255,255,0.45)',
                        flexShrink: 0,
                    }}>
                        {profile?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 800, fontSize: 15, color: '#fff',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                            {profile?.name || 'Delivery Partner'}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontWeight: 500 }}>
                            {profile?.vehicleType || 'Vehicle'} · {profile?.vehicleNumber || '—'}
                        </div>
                        {/* Status badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            marginTop: 6, background: 'rgba(255,255,255,0.15)',
                            padding: '3px 10px', borderRadius: 20,
                        }}>
                            <div style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: isOnline ? '#4ade80' : '#9ca3af',
                                boxShadow: isOnline ? '0 0 0 2px rgba(74,222,128,0.4)' : 'none',
                            }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Account status banner (if pending) ──────────────── */}
            {profile && profile.accountStatus !== 'ACTIVE' && (
                <div style={{
                    margin: '10px 12px 0',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: 8, padding: '8px 12px',
                    fontSize: 11, color: '#92400e', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    ⏳ Pending admin approval
                </div>
            )}

            {/* ── Navigation items ────────────────────────────────── */}
            <nav style={{ flex: 1, padding: '14px 12px 10px', overflowY: 'auto' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, padding: '0 8px', marginBottom: 8 }}>
                    Navigation
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/delivery' && location.pathname.startsWith(item.path));
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNav(item.path)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '11px 14px', borderRadius: 12, border: 'none',
                                    background: isActive
                                        ? `linear-gradient(135deg, ${PRIMARY}18, ${PRIMARY}08)`
                                        : 'transparent',
                                    borderLeft: `3px solid ${isActive ? PRIMARY : 'transparent'}`,
                                    cursor: 'pointer', textAlign: 'left', width: '100%',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) e.currentTarget.style.background = '#f9fafb';
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: isActive ? `${PRIMARY}18` : '#f3f4f6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 18, flexShrink: 0, transition: 'background 0.2s',
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize: 14, fontWeight: isActive ? 700 : 600,
                                        color: isActive ? PRIMARY : '#374151',
                                    }}>
                                        {item.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>
                                        {item.desc}
                                    </div>
                                </div>
                                {isActive && (
                                    <div style={{
                                        marginLeft: 'auto', width: 6, height: 6,
                                        borderRadius: '50%', background: PRIMARY,
                                        flexShrink: 0,
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Quick Stats ──────────────────────────────────── */}
                {profile && (
                    <div style={{
                        marginTop: 20,
                        background: PRIMARY_LIGHT,
                        border: `1px solid ${PRIMARY_BORDER}`,
                        borderRadius: 12, padding: '12px 14px',
                    }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                            Quick Stats
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { label: 'Completed', value: profile.completedOrders || 0, color: PRIMARY },
                                { label: 'Earnings', value: `₹${(profile.totalEarnings || 0).toFixed(0)}`, color: '#7c3aed' },
                                { label: 'Rating', value: `⭐ ${(profile.rating || 0).toFixed(1)}`, color: '#f59e0b' },
                                { label: 'Cancelled', value: profile.cancelledOrders || 0, color: '#ef4444' },
                            ].map(stat => (
                                <div key={stat.label} style={{ textAlign: 'center', background: '#fff', borderRadius: 8, padding: '8px 6px', border: '1px solid #f3f4f6' }}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Bottom section: Profile + Logout ───────────────── */}
            <div style={{
                padding: '10px 12px 16px',
                borderTop: `1.5px solid ${PRIMARY_BORDER}`,
                display: 'flex', flexDirection: 'column', gap: 4,
            }}>
                {bottomItems.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 14px', borderRadius: 12, border: 'none',
                                background: isActive ? `${PRIMARY}18` : 'transparent',
                                cursor: 'pointer', textAlign: 'left', width: '100%',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f9fafb'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? `${PRIMARY}18` : 'transparent'; }}
                        >
                            <span style={{ fontSize: 18 }}>{item.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? PRIMARY : '#374151' }}>
                                {item.name}
                            </span>
                        </button>
                    );
                })}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', borderRadius: 12, border: 'none',
                        background: 'transparent', cursor: 'pointer',
                        textAlign: 'left', width: '100%',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    <span style={{ fontSize: 18 }}>🚪</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default DeliveryDrawerList;

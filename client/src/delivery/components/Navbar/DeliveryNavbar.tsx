import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppSelector, useAppDispatch } from '../../../Redux Toolkit/Store';
import { deliveryLogout } from '../../../Redux Toolkit/Delivery/deliveryAuthSlice';

interface DeliveryNavbarProps {
    DrawerList?: any;
}

const PRIMARY = '#00927c';
const PRIMARY_DARK = '#006e5e';

const DeliveryNavbar = ({ DrawerList }: DeliveryNavbarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width:1024px)');
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { deliveryAuth } = useAppSelector(store => store);
    const profile = deliveryAuth.profile;

    const isOnline = profile?.deliveryStatus === 'AVAILABLE';

    const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

    const handleLogout = () => {
        dispatch(deliveryLogout());
        navigate('/login');
    };

    const navItems = [
        { path: '/delivery', label: 'Dashboard', icon: '📊' },
        { path: '/delivery/orders', label: 'My Deliveries', icon: '🚚' },
        { path: '/delivery/nearby', label: 'Route Optimizer', icon: '🗺️' },
        { path: '/delivery/profile', label: 'My Profile', icon: '👤' },
    ];

    return (
        <>
            <nav style={{
                height: '64px',
                background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                boxShadow: `0 4px 20px ${PRIMARY}55`,
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                {/* Left: Logo + Mobile menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {isMobile && (
                        <IconButton
                            onClick={toggleDrawer(true)}
                            sx={{ color: '#fff', padding: '6px' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <div
                        onClick={() => navigate('/delivery')}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                    >
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, backdropFilter: 'blur(4px)',
                        }}>
                            🚚
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', lineHeight: 1 }}>
                                Annadata
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                                Delivery Portal
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Nav items (desktop only) */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: 4 }}>
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    style={{
                                        padding: '7px 14px',
                                        borderRadius: 8,
                                        border: 'none',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                        color: '#fff',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        backdropFilter: isActive ? 'blur(4px)' : 'none',
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {item.icon} {item.label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Right: Status + Profile + Logout */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Online/Offline badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 20, padding: '4px 12px',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: isOnline ? '#4ade80' : '#9ca3af',
                            boxShadow: isOnline ? '0 0 0 3px rgba(74,222,128,0.3)' : 'none',
                        }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>

                    {/* Avatar */}
                    {profile && (
                        <div
                            onClick={() => navigate('/delivery/profile')}
                            style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: 15, color: '#fff',
                                cursor: 'pointer', border: '2px solid rgba(255,255,255,0.4)',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                            title={profile.name}
                        >
                            {profile.name?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '6px 14px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.4)',
                            background: 'transparent', color: '#fff',
                            fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {isMobile && DrawerList && (
                <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
                    <DrawerList toggleDrawer={toggleDrawer} />
                </Drawer>
            )}
        </>
    );
};

export default DeliveryNavbar;

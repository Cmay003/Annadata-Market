import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../../../Redux Toolkit/Store';
import DeliveryRoutes from '../../../routes/DeliveryRoutes';
import DeliveryNavbar from '../../components/Navbar/DeliveryNavbar';
import DeliveryDrawerList from '../../components/SideBar/DrawerList';

const PRIMARY_BG = '#f8fdf9';

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const { deliveryAuth } = useAppSelector(store => store);

    // Internal auth guard: if no JWT, redirect to login
    useEffect(() => {
        if (!localStorage.getItem('delivery_jwt')) {
            navigate('/login');
        }
    }, [deliveryAuth.jwt]);

    return (
        <div style={{ minHeight: '100vh', background: PRIMARY_BG, fontFamily: "'Inter', 'Open Sans', sans-serif" }}>
            {/* ── Branded delivery navbar ── */}
            <DeliveryNavbar DrawerList={DeliveryDrawerList} />

            {/* ── Layout: sidebar + content ── */}
            <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                {/* Sidebar – desktop only */}
                <aside
                    className="hidden lg:block"
                    style={{ height: '100%', overflowY: 'auto', flexShrink: 0 }}
                >
                    <DeliveryDrawerList />
                </aside>

                {/* Main content */}
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '28px 32px',
                }}>
                    <DeliveryRoutes />
                </main>
            </div>
        </div>
    );
};

export default DeliveryDashboard;

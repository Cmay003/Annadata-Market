import { Route, Routes } from 'react-router-dom';
import DeliveryHomePage from '../delivery/pages/Dashboard/HomePage';
import MyOrders from '../delivery/pages/Orders/MyOrders';
import DeliveryProfile from '../delivery/pages/Profile/Profile';

const DeliveryRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DeliveryHomePage />} />
            <Route path="/orders" element={<MyOrders initialTab="active" />} />
            <Route path="/nearby" element={<MyOrders initialTab="nearby" />} />
            <Route path="/profile" element={<DeliveryProfile />} />
        </Routes>
    );
};

export default DeliveryRoutes;

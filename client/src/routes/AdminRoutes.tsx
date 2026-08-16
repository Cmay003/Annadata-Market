
import { Navigate, Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/pages/sellers/SellersTable'
import Coupon from '../admin/pages/Coupon/Coupon'
import CouponForm from '../admin/pages/Coupon/CreateCouponForm'
import Dashboard from '../admin/pages/Dashboard'
import FarmerManagement from '../admin/pages/FarmerManagement'
import OrderManagement from '../admin/pages/OrderManagement'
import DeliveryManagement from '../admin/pages/DeliveryManagement'
import PaymentSettlement from '../admin/pages/PaymentSettlement'
import CommissionSettingsPage from '../admin/pages/CommissionSettings'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<SellersTable />} />
      <Route path='/coupon' element={<Coupon />} />
      <Route path='/add-coupon' element={<CouponForm />} />
      {/* <Route index element={<Navigate to="dashboard" />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/farmers" element={<FarmerManagement />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/delivery" element={<DeliveryManagement />} />
      <Route path="/payments" element={<PaymentSettlement />} />
      <Route path="/settings" element={<CommissionSettingsPage />} />
    </Routes>
  )
}

export default AdminRoutes
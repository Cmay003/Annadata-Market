import './App.css';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { ThemeProvider } from '@emotion/react';
import customeTheme from './Theme/customeTheme';
import { Route, Routes, useNavigate } from 'react-router-dom';

import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import CustomerRoutes from './routes/CustomerRoutes';
import AdminDashboard from './admin/pages/Dashboard/Dashboard';
import SellerAccountVerification from './seller/pages/SellerAccountVerification';
import SellerAccountVerified from './seller/pages/SellerAccountVerified';
import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
import { useEffect } from 'react';
import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import SellerOnboarding from './customer/pages/BecomeSeller/SellerOnboarding';
import AdminAuth from './admin/pages/Auth/AdminAuth';
import { fetchUserProfile } from './Redux Toolkit/Customer/UserSlice';
import DeliveryDashboard from './delivery/pages/Dashboard/DeliveryDashboard';
import DeliverySignupForm from './delivery/pages/Auth/DeliverySignupForm';
import { fetchDeliveryProfile } from './Redux Toolkit/Delivery/deliveryAuthSlice';

function App() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(store => store.auth)
  const sellerAuth = useAppSelector(store => store.sellerAuth)
  const sellers = useAppSelector(store => store.sellers)
  const user = useAppSelector(store => store.user)
  const deliveryAuth = useAppSelector(store => store.deliveryAuth)
  const navigate = useNavigate();

  // ── Load customer profile when customer JWT present ──────────────────
  useEffect(() => {
    const customerJwt = localStorage.getItem("jwt");
    if (customerJwt) {
      dispatch(fetchUserProfile({ jwt: customerJwt, navigate }));
    }
  }, [auth.jwt]);

  // Load seller profile when seller JWT present
  useEffect(() => {
    const sellerJwt = localStorage.getItem("seller_jwt") || sellerAuth.jwt;
    if (sellerJwt) {
      dispatch(fetchSellerProfile(sellerJwt));
    }
  }, [sellerAuth.jwt, sellerAuth.onboardingComplete]);

  // Load delivery profile when delivery JWT present
  useEffect(() => {
    const deliveryJwt = localStorage.getItem("delivery_jwt");
    if (deliveryJwt && !deliveryAuth.profile) {
      dispatch(fetchDeliveryProfile());
    }
  }, [deliveryAuth.jwt]);

  // Whether to show the seller dashboard:
  // show if seller_jwt exists and profile has been loaded (or is loading)
  const hasSellerJwt = !!(localStorage.getItem("seller_jwt") || sellerAuth.jwt);
  const showSellerDashboard = hasSellerJwt && !!sellers.profile;

  return (
    <ThemeProvider theme={customeTheme}>
      <div className='App' >
        <Routes>
          {showSellerDashboard && <Route path='/seller/*' element={<SellerDashboard />} />}
          {user.user?.role === "ROLE_ADMIN" && <Route path='/admin/*' element={<AdminDashboard />} />}
          {deliveryAuth.jwt && <Route path='/delivery/*' element={<DeliveryDashboard />} />}

          <Route path='/verify-seller/:otp' element={<SellerAccountVerification />} />
          <Route path='/seller-account-verified' element={<SellerAccountVerified />} />
          <Route path='/become-seller' element={<BecomeSeller />} />
          <Route path='/seller-onboarding' element={<SellerOnboarding />} />
          <Route path='/admin-login' element={<AdminAuth />} />
          <Route path='/delivery-signup' element={<DeliverySignupForm />} />

          <Route path='*' element={<CustomerRoutes />} />
        </Routes>
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;
import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

// Customer slices
import sellerSlice from "./Seller/sellerSlice";
import sellerAuthenticationSlice from "./Seller/sellerAuthenticationSlice";
import sellerProductSlice from "./Seller/sellerProductSlice";
import ProductSlice from "./Customer/ProductSlice";
import CartSlice from "./Customer/CartSlice";
import AuthSlice from "./Customer/AuthSlice";
import UserSlice from "./Customer/UserSlice";
import OrderSlice from "./Customer/OrderSlice";
import sellerOrderSlice from "./Seller/sellerOrderSlice";
import payoutSlice from "./Seller/payoutSlice";
import transactionSlice from "./Seller/transactionSlice";
import CouponSlice from "./Customer/CouponSlice";
import AdminCouponSlice from "./Admin/AdminCouponSlice";
import ReviewSlice from "./Customer/ReviewSlice";
import WishlistSlice from "./Customer/WishlistSlice";
import AiChatBotSlice from "./Customer/AiChatBotSlice";
import revenueChartSlice from "./Seller/revenueChartSlice";
import DealSlice from "./Admin/DealSlice";
import AdminDashboardSlice from "./Admin/AdminDashboardSlice";
import AdminOrderSlice from "./Admin/AdminOrderSlice";
// import AdminSlice from "./Admin/AdminSlice";

// Delivery slices
import deliveryAuthSlice from "./Delivery/deliveryAuthSlice";
import deliveryOrderSlice from "./Delivery/deliveryOrderSlice";

const rootReducer = combineReducers({
  // customer
  auth: AuthSlice,
  user: UserSlice,
  products: ProductSlice,
  cart: CartSlice,
  orders: OrderSlice,
  coupone: CouponSlice,
  review: ReviewSlice,
  wishlist: WishlistSlice,
  aiChatBot: AiChatBotSlice,
  // homePage: CustomerSlice,
  // payment: PaymentSlice,
  // refund: RefundSlice,

  // seller
  sellers: sellerSlice,
  sellerAuth: sellerAuthenticationSlice,
  sellerProduct: sellerProductSlice,
  sellerOrder: sellerOrderSlice,
  payouts: payoutSlice,
  transaction: transactionSlice,
  revenueChart: revenueChartSlice,

  // admin
  adminCoupon: AdminCouponSlice,
  adminDeals: DealSlice,
  // admin:AdminSlice,
  deal: DealSlice,
  adminDashboard: AdminDashboardSlice,
  adminOrder: AdminOrderSlice,

  // delivery
  deliveryAuth: deliveryAuthSlice,
  deliveryOrder: deliveryOrderSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;


// import {
//   configureStore,
//   combineReducers,
// } from "@reduxjs/toolkit";
// import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

// // ── Customer slices ────────────────────────────────────────────
// import AuthSlice      from "./Customer/AuthSlice";
// import UserSlice      from "./Customer/UserSlice";
// import ProductSlice   from "./Customer/ProductSlice";
// import CartSlice      from "./Customer/CartSlice";
// import OrderSlice     from "./Customer/OrderSlice";
// import CouponSlice    from "./Customer/CouponSlice";
// import ReviewSlice    from "./Customer/ReviewSlice";
// import WishlistSlice  from "./Customer/WishlistSlice";
// import AiChatBotSlice from "./Customer/AiChatBotSlice";
// // import CustomerSlice  from "./Customer/Customer/CustomerSlice";

// // ✅ F1 FIX: PaymentSlice aur RefundSlice comment-out the — ab register hain
// import PaymentSlice   from "./Customer/PaymentSlice";
// import RefundSlice    from "./Customer/RefundSlice";

// // ── Seller slices ──────────────────────────────────────────────
// import sellerSlice               from "./Seller/sellerSlice";
// import sellerAuthenticationSlice from "./Seller/sellerAuthenticationSlice";
// import sellerProductSlice        from "./Seller/sellerProductSlice";
// import sellerOrderSlice          from "./Seller/sellerOrderSlice";
// import payoutSlice               from "./Seller/payoutSlice";
// import transactionSlice          from "./Seller/transactionSlice";
// import revenueChartSlice         from "./Seller/revenueChartSlice";

// // ── Admin slices ───────────────────────────────────────────────
// import AdminCouponSlice    from "./Admin/AdminCouponSlice";
// import AdminDashboardSlice from "./Admin/AdminDashboardSlice";
// import AdminOrderSlice     from "./Admin/AdminOrderSlice";
// import AdminSlice          from "./Admin/AdminSlice";

// // ✅ F4 FIX: DealSlice ek hi baar register karo — pehle adminDeals aur deal dono mein tha
// import DealSlice from "./Admin/DealSlice";

// const rootReducer = combineReducers({

//   // ── Customer ──────────────────────────────────────────────────
//   auth:       AuthSlice,
//   user:       UserSlice,
//   products:   ProductSlice,
//   cart:       CartSlice,
//   orders:     OrderSlice,
//   coupone:    CouponSlice,
//   review:     ReviewSlice,
//   wishlist:   WishlistSlice,
//   aiChatBot:  AiChatBotSlice,
//   homePage:   CustomerSlice,

//   // ✅ F1 FIX: ab registered hain — payment aur refund state kaam karegi
//   payment:    PaymentSlice,
//   refund:     RefundSlice,

//   // ── Seller ────────────────────────────────────────────────────
//   sellers:       sellerSlice,
//   sellerAuth:    sellerAuthenticationSlice,
//   sellerProduct: sellerProductSlice,
//   sellerOrder:   sellerOrderSlice,
//   payouts:       payoutSlice,
//   transaction:   transactionSlice,
//   revenueChart:  revenueChartSlice,

//   // ── Admin ─────────────────────────────────────────────────────
//   adminCoupon:    AdminCouponSlice,
//   // ✅ F4 FIX: sirf ek key — "deal" hataya, "adminDeals" rakha
//   adminDeals:     DealSlice,
//   admin:          AdminSlice,
//   adminDashboard: AdminDashboardSlice,
//   adminOrder:     AdminOrderSlice,
// });

// const store = configureStore({
//   reducer: rootReducer,
// });

// export type AppDispatch = typeof store.dispatch;
// export type RootState   = ReturnType<typeof rootReducer>;

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export default store;
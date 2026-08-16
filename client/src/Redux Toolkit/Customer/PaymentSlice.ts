// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../../Config/Api";
// import type { RootState } from "../Store";

// const API_URL = "/api/payment";

// interface PaymentState {
//   paymentDetails: any;
//   paymentLink: string | null;
//   loading: boolean;
//   error: string | null;
//   paymentVerified: boolean;
// }

// const initialState: PaymentState = {
//   paymentDetails: null,
//   paymentLink: null,
//   loading: false,
//   error: null,
//   paymentVerified: false,
// };

// // Get payment details
// export const getPaymentDetails = createAsyncThunk<any, number>(
//   "payment/getPaymentDetails",
//   async (paymentId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`${API_URL}/${paymentId}`);
//       console.log("payment details fetched", response.data);
//       return response.data;
//     } catch (error: any) {
//       console.log("error", error.response);
//       return rejectWithValue(error.response?.data || "Failed to fetch payment");
//     }
//   }
// );

// // Create payment for order
// export const createPayment = createAsyncThunk<
//   any,
//   { orderId: number; paymentMethod: string; jwt: string }
// >(
//   "payment/createPayment",
//   async ({ orderId, paymentMethod, jwt }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(
//         `${API_URL}/${paymentMethod}/order/${orderId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${jwt}`,
//           },
//         }
//       );
//       console.log("payment created", response.data);
//       return response.data;
//     } catch (error: any) {
//       console.log("error", error.response);
//       return rejectWithValue(error.response?.data || "Failed to create payment");
//     }
//   }
// );

// const paymentSlice = createSlice({
//   name: "payment",
//   initialState,
//   reducers: {
//     clearPaymentError: (state) => {
//       state.error = null;
//     },
//     resetPayment: (state) => {
//       state.paymentDetails = null;
//       state.paymentLink = null;
//       state.paymentVerified = false;
//     },
//   },
//   extraReducers: (builder) => {
//     // Get payment details
//     builder
//       .addCase(getPaymentDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getPaymentDetails.fulfilled, (state, action) => {
//         state.paymentDetails = action.payload;
//         state.loading = false;
//         state.paymentVerified = true;
//       })
//       .addCase(getPaymentDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // Create payment
//     builder
//       .addCase(createPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createPayment.fulfilled, (state, action) => {
//         state.paymentDetails = action.payload;
//         state.paymentLink = action.payload.payment_link_url;
//         state.loading = false;
//       })
//       .addCase(createPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearPaymentError, resetPayment } = paymentSlice.actions;
// export default paymentSlice.reducer;

// export const selectPayment = (state: RootState) => state.payment?.paymentDetails;
// export const selectPaymentLink = (state: RootState) => state.payment?.paymentLink;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { RootState } from "../Store";

const API_URL = "/api/orders";        // Order create
const PAYMENT_URL = "/api/payment";   // Payment verify

interface PaymentState {
  paymentDetails: any;
  paymentLink: string | null;
  loading: boolean;
  error: string | null;
  paymentVerified: boolean;
}

const initialState: PaymentState = {
  paymentDetails: null,
  paymentLink: null,
  loading: false,
  error: null,
  paymentVerified: false,
};

// ✅ Order create + payment link generate
// ✅ F3 FIX: JWT interceptor se auto attach hota hai — manually pass nahi karna
export const createOrder = createAsyncThunk<
  any,
  { address: any; paymentGateway: string }
>(
  "payment/createOrder",
  async ({ address, paymentGateway }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_URL}?paymentMethod=${paymentGateway}`,
        address
      );
      console.log("order + payment link created", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(
        error.response?.data?.message || "Order create karna fail hua"
      );
    }
  }
);

// ✅ Payment success verify (Razorpay/Stripe callback)
export const verifyPayment = createAsyncThunk<
  any,
  { paymentId: string; paymentLinkId: string }
>(
  "payment/verifyPayment",
  async ({ paymentId, paymentLinkId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${PAYMENT_URL}/${paymentId}?paymentLinkId=${paymentLinkId}`
      );
      console.log("payment verified", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(
        error.response?.data?.message || "Payment verify karna fail hua"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    resetPayment: (state) => {
      state.paymentDetails = null;
      state.paymentLink = null;
      state.paymentVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.paymentDetails = action.payload;
        state.paymentLink = action.payload?.payment_link_url || null;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Verify payment
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.paymentDetails = action.payload;
        state.loading = false;
        state.paymentVerified = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentError, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;

// ✅ F9 FIX: state.payment ab Store mein registered hai — selector kaam karega
export const selectPaymentLink    = (state: RootState) => state.payment.paymentLink;
export const selectPaymentLoading = (state: RootState) => state.payment.loading;
export const selectPaymentError   = (state: RootState) => state.payment.error;
export const selectPaymentVerified = (state: RootState) => state.payment.paymentVerified;
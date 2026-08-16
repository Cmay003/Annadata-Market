import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../Config/Api';

// ── Types ─────────────────────────────────────────────────────────────────
export interface DeliveryOrder {
    id: number;
    orderId: string;
    totalSellingPrice: number;
    deliveryCharge: number;
    orderStatus: string;
    deliveryStatus: string;
    deliveryBoyId: number | null;
    deliveryOtp?: string | null;
    otpUsed?: boolean;
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        pinCode: string;
    };
    orderDate: string;
    deliveredAt: string | null;
    orderItems: { productTitle: string; quantity: number; sellingPrice: number; product?: any }[];
}

interface DeliveryOrderState {
    myOrders: DeliveryOrder[];
    nearbyOrders: DeliveryOrder[];
    loading: boolean;
    error: string | null;
    actionLoading: number | null;
    actionError: string | null;  // separate from loading error
}

const initialState: DeliveryOrderState = {
    myOrders: [],
    nearbyOrders: [],
    loading: false,
    error: null,
    actionLoading: null,
    actionError: null,
};

const getJwt = () => localStorage.getItem('delivery_jwt') || '';

// ── My assigned orders ────────────────────────────────────────────────────
export const fetchMyDeliveries = createAsyncThunk(
    'deliveryOrder/fetchMyDeliveries',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/delivery/my-orders', {
                headers: { Authorization: `Bearer ${getJwt()}` },
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// ── Nearby / route-optimized orders ───────────────────────────────────────
export const fetchNearbyOrders = createAsyncThunk(
    'deliveryOrder/fetchNearbyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/delivery/nearby-orders', {
                headers: { Authorization: `Bearer ${getJwt()}` },
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch nearby orders');
        }
    }
);

// ── Accept order ──────────────────────────────────────────────────────────
export const acceptDeliveryOrder = createAsyncThunk(
    'deliveryOrder/accept',
    async (orderId: number, { rejectWithValue }) => {
        try {
            await api.put(`/delivery/orders/${orderId}/accept`, {}, {
                headers: { Authorization: `Bearer ${getJwt()}` },
            });
            return orderId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to accept order');
        }
    }
);

// ── Pickup order from farmer (marks IN_TRANSIT, sends OTP to customer) ────
export const pickupDeliveryOrder = createAsyncThunk(
    'deliveryOrder/pickup',
    async (orderId: number, { rejectWithValue }) => {
        try {
            await api.put(`/delivery/orders/${orderId}/pickup`, {}, {
                headers: { Authorization: `Bearer ${getJwt()}` },
            });
            return orderId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to mark pickup');
        }
    }
);

// ── Complete / delivered — OTP verified ───────────────────────────────────
export const completeDeliveryOrder = createAsyncThunk(
    'deliveryOrder/complete',
    async ({ orderId, otp }: { orderId: number; otp: string }, { rejectWithValue }) => {
        try {
            await api.put(`/delivery/orders/${orderId}/complete`, { otp }, {
                headers: { Authorization: `Bearer ${getJwt()}` },
            });
            return orderId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to complete order');
        }
    }
);

// ── Slice ──────────────────────────────────────────────────────────────────
const deliveryOrderSlice = createSlice({
    name: 'deliveryOrder',
    initialState,
    reducers: {
        clearDeliveryOrderError: (s) => { s.error = null; s.actionError = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyDeliveries.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchMyDeliveries.fulfilled, (s, a) => { s.loading = false; s.myOrders = a.payload; })
            .addCase(fetchMyDeliveries.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

        builder
            .addCase(fetchNearbyOrders.pending, (s) => { s.loading = true; })
            .addCase(fetchNearbyOrders.fulfilled, (s, a) => { s.loading = false; s.nearbyOrders = a.payload; })
            .addCase(fetchNearbyOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

        builder
            .addCase(acceptDeliveryOrder.pending, (s, a) => { s.actionLoading = a.meta.arg; s.actionError = null; })
            .addCase(acceptDeliveryOrder.fulfilled, (s, a) => {
                s.actionLoading = null;
                // Move from nearby to my orders
                const order = s.nearbyOrders.find(o => o.id === a.payload);
                if (order) {
                    s.myOrders.push({ ...order, deliveryBoyId: -1, deliveryStatus: 'ASSIGNED' });
                    s.nearbyOrders = s.nearbyOrders.filter(o => o.id !== a.payload);
                }
            })
            .addCase(acceptDeliveryOrder.rejected, (s, a) => { s.actionLoading = null; s.actionError = a.payload as string; });

        builder
            .addCase(pickupDeliveryOrder.pending, (s, a) => { s.actionLoading = a.meta.arg; s.actionError = null; })
            .addCase(pickupDeliveryOrder.fulfilled, (s, a) => {
                s.actionLoading = null;
                s.myOrders = s.myOrders.map(o =>
                    o.id === a.payload
                        ? { ...o, orderStatus: 'IN_TRANSIT', deliveryStatus: 'OUT_FOR_DELIVERY' }
                        : o
                );
            })
            .addCase(pickupDeliveryOrder.rejected, (s, a) => { s.actionLoading = null; s.actionError = a.payload as string; });

        builder
            .addCase(completeDeliveryOrder.pending, (s, a) => { s.actionLoading = a.meta.arg.orderId; s.actionError = null; })
            .addCase(completeDeliveryOrder.fulfilled, (s, a) => {
                s.actionLoading = null;
                s.myOrders = s.myOrders.map(o =>
                    o.id === a.payload
                        ? { ...o, orderStatus: 'DELIVERED', deliveryStatus: 'DELIVERED' }
                        : o
                );
            })
            .addCase(completeDeliveryOrder.rejected, (s, a) => { s.actionLoading = null; s.actionError = a.payload as string; });
    },
});

export const { clearDeliveryOrderError } = deliveryOrderSlice.actions;
export default deliveryOrderSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../Config/Api';

// ── Types ─────────────────────────────────────────────────────────────────
interface DeliveryAuthState {
    loading: boolean;
    error: string | null;
    jwt: string | null;
    profile: DeliveryProfile | null;
    isApproved: boolean;
}

export interface DeliveryProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    currentCity: string;
    currentPincode: string;
    deliveryStatus: string;
    accountStatus: string;
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
    totalEarnings: number;
    isActive: boolean;
}

const initialState: DeliveryAuthState = {
    loading: false,
    error: null,
    jwt: localStorage.getItem('delivery_jwt'),
    profile: null,
    isApproved: false,
};

// ── Signup ────────────────────────────────────────────────────────────────
export const deliverySignup = createAsyncThunk(
    'deliveryAuth/signup',
    async (data: {
        name: string; email: string; password: string; phone: string;
        vehicleType: string; vehicleNumber: string;
        currentCity?: string; currentPincode?: string;
        navigate: (path: string) => void;
    }, { rejectWithValue }) => {
        try {
            const res = await api.post('/delivery/signup', {
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                vehicleType: data.vehicleType,
                vehicleNumber: data.vehicleNumber,
                currentCity: data.currentCity,
                currentPincode: data.currentPincode,
            });
            localStorage.setItem('delivery_jwt', res.data.jwt);
            data.navigate('/delivery');
            return res.data;
        } catch (err: any) {
            if (!err.response) return rejectWithValue('Network Error');
            return rejectWithValue(err.response?.data?.message || 'Signup failed');
        }
    }
);

// ── Login ──────────────────────────────────────────────────────────────────
export const deliveryLogin = createAsyncThunk(
    'deliveryAuth/login',
    async (data: { email: string; password: string; navigate: (path: string) => void }, { rejectWithValue }) => {
        try {
            const res = await api.post('/delivery/login', {
                email: data.email,
                password: data.password,
            });
            localStorage.setItem('delivery_jwt', res.data.jwt);
            data.navigate('/delivery');
            return res.data;
        } catch (err: any) {
            if (!err.response) return rejectWithValue('Network Error');
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

// ── Fetch Profile ─────────────────────────────────────────────────────────
export const fetchDeliveryProfile = createAsyncThunk(
    'deliveryAuth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('delivery_jwt');
            if (!jwt) return rejectWithValue('No token');
            const res = await api.get('/delivery/profile', {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// ── Update Location ───────────────────────────────────────────────────────
export const updateDeliveryLocation = createAsyncThunk(
    'deliveryAuth/updateLocation',
    async (data: { currentCity?: string; currentPincode?: string; latitude?: number; longitude?: number }, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('delivery_jwt');
            await api.patch('/delivery/location', data, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return data;
        } catch (err: any) {
            return rejectWithValue('Failed to update location');
        }
    }
);

// ── Slice ──────────────────────────────────────────────────────────────────
const deliveryAuthSlice = createSlice({
    name: 'deliveryAuth',
    initialState,
    reducers: {
        deliveryLogout: (state) => {
            state.jwt = null;
            state.profile = null;
            state.isApproved = false;
            localStorage.removeItem('delivery_jwt');
        },
        clearDeliveryError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        // Signup
        builder
            .addCase(deliverySignup.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(deliverySignup.fulfilled, (s, a) => { s.loading = false; s.jwt = a.payload.jwt; })
            .addCase(deliverySignup.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

        // Login
        builder
            .addCase(deliveryLogin.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(deliveryLogin.fulfilled, (s, a) => { s.loading = false; s.jwt = a.payload.jwt; s.isApproved = a.payload.status; })
            .addCase(deliveryLogin.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

        // Fetch Profile
        builder
            .addCase(fetchDeliveryProfile.pending, (s) => { s.loading = true; })
            .addCase(fetchDeliveryProfile.fulfilled, (s, a) => { s.loading = false; s.profile = a.payload; s.isApproved = a.payload.accountStatus === 'ACTIVE'; })
            .addCase(fetchDeliveryProfile.rejected, (s) => { s.loading = false; });

        // Update Location
        builder
            .addCase(updateDeliveryLocation.fulfilled, (s, a) => {
                if (s.profile) {
                    if (a.payload.currentCity) s.profile.currentCity = a.payload.currentCity;
                    if (a.payload.currentPincode) s.profile.currentPincode = a.payload.currentPincode;
                }
            });
    },
});

export const { deliveryLogout, clearDeliveryError } = deliveryAuthSlice.actions;
export default deliveryAuthSlice.reducer;

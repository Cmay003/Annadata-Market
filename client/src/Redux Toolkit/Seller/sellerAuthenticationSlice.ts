import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../Config/Api';
import type { Seller } from '../../types/sellerTypes';
import axios from 'axios';

interface SellerAuthState {
    otpSent: boolean;
    error: string | null;
    loading: boolean;
    jwt: string | null;
    sellerCreated: string | null;
    onboardingComplete: boolean;
    needsOnboarding: boolean;   // true when seller logged in but still PENDING_ONBOARDING
}

const initialState: SellerAuthState = {
    otpSent: false,
    error: null,
    loading: false,
    jwt: null,
    sellerCreated: '',
    onboardingComplete: false,
    needsOnboarding: false,
};

// ── Send OTP (shared for signup) ─────────────────────────────────────────
export const sendSellerOtp = createAsyncThunk(
    'sellerAuth/sendSellerOtp',
    async (email: string, { rejectWithValue }) => {
        try {
            // Reuse the buyer OTP endpoint (same table/logic)
            await api.post('/auth/sent/login-signup-otp', { email });
            return { email };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP');
        }
    }
);

// ── Phase 1: Create seller account ───────────────────────────────────────
export const registerSeller = createAsyncThunk(
    'sellerAuth/registerSeller',
    async (data: { fullName: string; email: string; password: string; otp: string; navigate: any }, { rejectWithValue }) => {
        try {
            const res = await api.post('/sellers/register', {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                otp: data.otp,
            });
            localStorage.setItem('seller_jwt', res.data.jwt);
            data.navigate('/seller-onboarding');
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to create seller account');
        }
    }
);

// ── Seller Login (email + password) ──────────────────────────────────────
export const sellerLogin = createAsyncThunk(
    'sellerAuth/sellerLogin',
    async (data: { email: string; password: string; navigate: any }, { rejectWithValue }) => {
        try {
            const res = await api.post('/sellers/login', {
                email: data.email,
                password: data.password,
            });
            localStorage.setItem('seller_jwt', res.data.jwt);
            // If onboarding not done, send to onboarding page
            if (!res.data.status) {
                data.navigate('/seller-onboarding');
            } else {
                data.navigate('/seller');
            }
            return res.data;
        } catch (error: any) {
            if (!error.response) return rejectWithValue('Network Error');
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Login failed');
        }
    }
);

// ── Phase 2: Complete seller onboarding ──────────────────────────────────────
export const completeSellerOnboarding = createAsyncThunk(
    'sellerAuth/completeSellerOnboarding',
    async (data: { onboardingData: any; navigate?: any }, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('seller_jwt');
            const res = await api.patch('/sellers/onboarding', data.onboardingData, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            // Navigation is handled by the caller (SellerOnboarding.tsx)
            // after fetchSellerProfile resolves, to avoid route guard race condition
            return res.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Onboarding failed. Please try again.';
            return rejectWithValue(message);
        }
    }
);

// ── Legacy: OTP-based login (kept for backward compat) ───────────────────
export const sendLoginOtp = createAsyncThunk('otp/sendLoginOtp', async (email: string, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/sellers/sent/login-top', { email });
        return { email, data };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP');
    }
});

export const verifyLoginOtp = createAsyncThunk('otp/verifyLoginOtp',
    async (data: { email: string; otp: string, navigate: any }, { rejectWithValue }) => {
        try {
            const response = await api.post('/sellers/verify/login-top', data);
            localStorage.setItem('seller_jwt', response.data.jwt);
            data.navigate('/seller');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to verify OTP');
        }
    });

export const createSeller = createAsyncThunk<Seller, Seller>(
    'sellers/createSeller',
    async (seller: Seller, { rejectWithValue }) => {
        try {
            const response = await api.post<Seller>('/sellers', seller);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to create seller');
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────
const sellerAuthSlice = createSlice({
    name: 'sellerAuth',
    initialState,
    reducers: {
        resetSellerAuthState: (state) => {
            state.otpSent = false;
            state.error = null;
            state.loading = false;
            state.jwt = null;
        },
        clearSellerError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // sendSellerOtp
        builder
            .addCase(sendSellerOtp.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(sendSellerOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
            .addCase(sendSellerOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // registerSeller
        builder
            .addCase(registerSeller.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt;
                state.needsOnboarding = true;
                state.sellerCreated = 'Account created! Complete your profile.';
            })
            .addCase(registerSeller.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // sellerLogin
        builder
            .addCase(sellerLogin.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(sellerLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt;
                state.needsOnboarding = !action.payload.status;
            })
            .addCase(sellerLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // completeSellerOnboarding
        builder
            .addCase(completeSellerOnboarding.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(completeSellerOnboarding.fulfilled, (state) => {
                state.loading = false;
                state.onboardingComplete = true;
                state.needsOnboarding = false;
            })
            .addCase(completeSellerOnboarding.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // Legacy
        builder
            .addCase(sendLoginOtp.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(sendLoginOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
            .addCase(sendLoginOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder
            .addCase(verifyLoginOtp.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(verifyLoginOtp.fulfilled, (state, action) => { state.loading = false; state.jwt = action.payload.jwt; })
            .addCase(verifyLoginOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder
            .addCase(createSeller.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createSeller.fulfilled, (state, action: PayloadAction<Seller>) => {
                state.sellerCreated = 'Verification email sent to you';
                state.loading = false;
                console.log(action);
            })
            .addCase(createSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to create seller';
            });
    },
});

export const { resetSellerAuthState, clearSellerError } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;

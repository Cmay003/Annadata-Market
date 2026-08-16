import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { RootState } from "../Store";

const API_URL = "/admin/dashboard";

interface DashboardStats {
  totalFarmers?: number;
  totalCustomers?: number;
  totalOrders?: number;
  totalRevenue?: number;
  [key: string]: any;
}

interface AdminDashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminDashboardState = {
  stats: null,
  loading: false,
  error: null,
};

// Fetch dashboard statistics
export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  { jwt: string }
>(
  "adminDashboard/fetchStats",
  async ({ jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get<DashboardStats>(API_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("dashboard stats fetched", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to fetch dashboard stats");
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;

export const selectDashboardStats = (state: RootState) => state.adminDashboard?.stats;

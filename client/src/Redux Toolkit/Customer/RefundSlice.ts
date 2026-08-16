import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { RootState } from "../Store";

const API_URL = "/api/refunds";

interface RefundState {
  refundDetails: any;
  loading: boolean;
  error: string | null;
  refundProcessed: boolean;
}

const initialState: RefundState = {
  refundDetails: null,
  loading: false,
  error: null,
  refundProcessed: false,
};

// Process refund
export const processRefund = createAsyncThunk<
  any,
  { orderId: number; reason: string; jwt: string }
>(
  "refund/processRefund",
  async ({ orderId, reason, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_URL}/${orderId}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("refund processed", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to process refund");
    }
  }
);

const refundSlice = createSlice({
  name: "refund",
  initialState,
  reducers: {
    clearRefundError: (state) => {
      state.error = null;
    },
    resetRefund: (state) => {
      state.refundDetails = null;
      state.refundProcessed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.refundDetails = action.payload;
        state.loading = false;
        state.refundProcessed = true;
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.refundProcessed = false;
      });
  },
});

export const { clearRefundError, resetRefund } = refundSlice.actions;
export default refundSlice.reducer;

export const selectRefund = (state: RootState) => state.refund?.refundDetails;

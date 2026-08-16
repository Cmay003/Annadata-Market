import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Order } from "../../types/orderTypes";
import type { RootState } from "../Store";

const API_URL = "/admin/orders";

interface PaginatedResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
}

interface AdminOrderState {
  orders: Order[];
  paginatedOrders: PaginatedResponse | null;
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  orderUpdated: boolean;
  deliveryAssigned: boolean;
  orderCanceled: boolean;
}

const initialState: AdminOrderState = {
  orders: [],
  paginatedOrders: null,
  currentOrder: null,
  loading: false,
  error: null,
  orderUpdated: false,
  deliveryAssigned: false,
  orderCanceled: false,
};

// Fetch all orders
export const fetchAllOrders = createAsyncThunk<
  PaginatedResponse,
  { jwt: string; pageNumber?: number; pageSize?: number }
>(
  "adminOrder/fetchAllOrders",
  async ({ jwt, pageNumber = 0, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedResponse>(API_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { pageNumber, pageSize },
      });
      console.log("all orders fetched", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: number; status: string; jwt: string }
>(
  "adminOrder/updateOrderStatus",
  async ({ orderId, status, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put<Order>(
        `${API_URL}/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      console.log("order status updated", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to update order status");
    }
  }
);

// Assign delivery boy
export const assignDeliveryBoy = createAsyncThunk<
  Order,
  { orderId: number; deliveryBoyId: number; jwt: string }
>(
  "adminOrder/assignDeliveryBoy",
  async ({ orderId, deliveryBoyId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put<Order>(
        `${API_URL}/${orderId}/assign/${deliveryBoyId}`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      console.log("delivery assigned", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to assign delivery");
    }
  }
);

// Cancel order (admin)
export const cancelOrderAdmin = createAsyncThunk<
  Order,
  { orderId: number; jwt: string }
>(
  "adminOrder/cancelOrder",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put<Order>(
        `${API_URL}/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      console.log("order canceled", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to cancel order");
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    clearAdminOrderError: (state) => {
      state.error = null;
    },
    resetOrderFlags: (state) => {
      state.orderUpdated = false;
      state.deliveryAssigned = false;
      state.orderCanceled = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch all orders
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.paginatedOrders = action.payload;
        state.orders = action.payload.content;
        state.loading = false;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderUpdated = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.loading = false;
        state.orderUpdated = true;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Assign delivery
    builder
      .addCase(assignDeliveryBoy.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deliveryAssigned = false;
      })
      .addCase(assignDeliveryBoy.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.loading = false;
        state.deliveryAssigned = true;
      })
      .addCase(assignDeliveryBoy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel order
    builder
      .addCase(cancelOrderAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCanceled = false;
      })
      .addCase(cancelOrderAdmin.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.loading = false;
        state.orderCanceled = true;
      })
      .addCase(cancelOrderAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminOrderError, resetOrderFlags } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;

export const selectAdminOrders = (state: RootState) => state.adminOrder?.orders || [];

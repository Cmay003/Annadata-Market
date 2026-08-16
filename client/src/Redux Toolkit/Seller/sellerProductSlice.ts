import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Product } from "../../types/productTypes";
import type { RootState } from "../Store";

const API_URL = "/sellers/product";

interface PaginatedResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
}

interface SellerProductState {
  products: Product[];
  paginatedProducts: PaginatedResponse | null;
  loading: boolean;
  error: string | null;
  productCreated: boolean;
  productUpdated: boolean;
  productDeleted: boolean;
}

const initialState: SellerProductState = {
  products: [],
  paginatedProducts: null,
  loading: false,
  error: null,
  productCreated: false,
  productUpdated: false,
  productDeleted: false,
};

// Fetch seller products
// export const fetchSellerProducts = createAsyncThunk<
//   PaginatedResponse,
//   { jwt: string; pageNumber?: number; pageSize?: number }
// >(
//   "sellerProduct/fetchSellerProducts",
//   async ({ jwt, pageNumber = 0, pageSize = 10 }, { rejectWithValue }) => {
//     try {
//       const response = await api.get<PaginatedResponse>(API_URL, {
//         headers: { Authorization: `Bearer ${jwt}` },
//         params: { pageNumber, pageSize },
//       });
//       console.log("seller products fetched", response.data);
//       return response.data;
//     } catch (error: any) {
//       console.log("error", error.response);
//       return rejectWithValue(error.response?.data || "Failed to fetch products");
//     }
//   }
// );

export const fetchSellerProducts = createAsyncThunk<
  Product[],
  { jwt: string; pageNumber?: number; pageSize?: number }
>(
  "sellerProduct/fetchSellerProducts",
  async ({ jwt, pageNumber = 0, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(API_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { pageNumber, pageSize },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create product
export const createProduct = createAsyncThunk<
  Product,
  { request: any; jwt: string | null }
>(
  "sellerProduct/createProduct",
  async ({ request, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post<Product>(API_URL, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("product created", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to create product");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk<
  Product,
  { productId: number; product: any; jwt: string }
>(
  "sellerProduct/updateProduct",
  async ({ productId, product, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Product>(`${API_URL}/${productId}`, product, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("product updated", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to update product");
    }
  }
);

// Update product stock
export const updateProductStock = createAsyncThunk<
  Product,
  { productId: number; quantity: number; jwt: string }
>(
  "sellerProduct/updateProductStock",
  async ({ productId, quantity, jwt }, { rejectWithValue }) => {
    try {
      console.log("productId =", productId);
      const response = await api.patch<Product>(
        `${API_URL}/${productId}/stock`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      console.log("product stock updated", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to update stock");
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk<
  void,
  { productId: number; jwt: string }
>(
  "sellerProduct/deleteProduct",
  async ({ productId, jwt }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("product deleted");
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to delete product");
    }
  }
);

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    clearSellerProductError: (state) => {
      state.error = null;
    },
    resetProductFlags: (state) => {
      state.productCreated = false;
      state.productUpdated = false;
      state.productDeleted = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch seller products
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        // state.paginatedProducts = action.payload;
        // state.products = action.payload;
        // state.loading = false;

        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productCreated = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
        state.productCreated = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productUpdated = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.loading = false;
        state.productUpdated = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update stock
    builder
      .addCase(updateProductStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDeleted = false;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.productDeleted = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSellerProductError, resetProductFlags } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;

export const selectSellerProducts = (state: RootState) =>
  state.sellerProduct?.products || [];

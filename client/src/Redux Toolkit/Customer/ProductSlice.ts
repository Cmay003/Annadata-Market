import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Product } from "../../types/productTypes";
import type { RootState } from "../Store";

const API_URL = "/products";

interface PaginatedResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
}

interface ProductState {
  product: Product | null;
  products: Product[];
  paginatedProducts: PaginatedResponse | null;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchProduct: Product[];
}

const initialState: ProductState = {
  product: null,
  products: [],
  paginatedProducts: null,
  totalPages: 1,
  loading: false,
  error: null,
  searchProduct: [],
};

// Fetch single product by ID
export const fetchProductById = createAsyncThunk<Product, number>(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get<Product>(`${API_URL}/${productId}`);
      console.log("product details", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Failed to fetch product");
    }
  }
);

// Search products
export const searchProduct = createAsyncThunk<Product[], string>(
  "products/searchProduct",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(`${API_URL}/search`, {
        params: { query },
      });
      console.log("search products", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue(error.response?.data || "Search failed");
    }
  }
);

// Get all products with filters
export const getAllProducts = createAsyncThunk<
  PaginatedResponse,
  {
    category?: string;
    brand?: string;
    city?: string;
    grade?: string;
    color?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    minDiscount?: number;
    sort?: string;
    stock?: string;
    pageNumber?: number;
    pageSize?: number;
  }
>("products/getAllProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<PaginatedResponse>(API_URL, {
      params: {
        ...params,
        pageNumber: params.pageNumber || 0,
        pageSize: params.pageSize || 10,
      },
    });
    console.log("all products", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error", error.response);
    return rejectWithValue(error.response?.data || "Failed to fetch products");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearSingleProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search products
    builder
      .addCase(searchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.searchProduct = action.payload;
        state.loading = false;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get all products
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.paginatedProducts = action.payload;
        state.products = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError, clearSingleProduct } = productSlice.actions;
export default productSlice.reducer;

// Selectors
export const selectProduct = (state: RootState) => state.products.product;
export const selectProducts = (state: RootState) => state.products.products;
export const selectPaginatedProducts = (state: RootState) =>
  state.products.paginatedProducts;
export const selectProductLoading = (state: RootState) =>
  state.products.loading;
export const selectProductError = (state: RootState) => state.products.error;
export const selectSearchProducts = (state: RootState) =>
  state.products.searchProduct;

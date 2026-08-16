// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '../../../Config/Api';
// import type { HomeCategory, HomeData } from '../../../types/homeDataTypes';

// // ✅ FETCH HOME PAGE DATA (FULL SAFE VERSION)
// export const fetchHomePageData = createAsyncThunk<HomeData>(
//   'home/fetchHomePageData',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/home-page');

//       console.log("RAW RESPONSE 👉", response);
//       console.log("RAW DATA 👉", response.data);

//       // ✅ STEP 1: HANDLE DIFFERENT RESPONSE FORMATS
//       let data: HomeCategory[] = [];

//       // Case 1: API returns array directly
//       if (Array.isArray(response.data)) {
//         data = response.data;
//       }

//       // Case 2: API returns { data: [...] }
//       else if (Array.isArray(response.data?.data)) {
//         data = response.data.data;
//       }

//       // Case 3: API already returns structured HomeData
//       else if (response.data?.electricCategories) {
//         console.log("✅ Already formatted data from backend");
//         return response.data;
//       }

//       // ❌ Invalid response
//       else {
//         console.error("❌ Invalid API response format", response.data);

//         return {
//           id: 1,
//           electricCategories: [],
//           grid: [],
//           shopByCategories: [],
//           deals: [],
//           dealCategories: []
//         };
//       }

//       console.log("FINAL ARRAY DATA 👉", data);

//       // ✅ STEP 2: FORMAT DATA FOR UI
//       const formattedData: HomeData = {
//         id: 1,

//         // 🌿 FARM → ELECTRIC
//         electricCategories: data.filter(
//           (item) => item.section === "FARM_CATEGORIES"
//         ),

//         // 🥕 GRID
//         grid: data.filter(
//           (item) => item.section === "GRID"
//         ),

//         // 🌾 SHOP BY CATEGORY
//         shopByCategories: data.filter(
//           (item) => item.section === "SHOP_BY_CATEGORIES"
//         ),

//         // 🔥 DEALS
//         deals: data
//           .filter((item) => item.section === "DEALS")
//           .map((item) => ({
//             category: item,
//             discount: 10, // you can change
//           })),

//         dealCategories: data.filter(
//           (item) => item.section === "DEALS"
//         ),
//       };

//       console.log("FORMATTED DATA ✅", formattedData);

//       return formattedData;

//     } catch (error: any) {
//       console.error("ERROR ❌", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         'Failed to fetch home page data';

//       return rejectWithValue(errorMessage);
//     }
//   }
// );


// // ✅ CREATE HOME CATEGORIES (NO MAJOR CHANGE)
// export const createHomeCategories = createAsyncThunk<HomeData, HomeCategory[]>(
//   'home/createHomeCategories',
//   async (homeCategories, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/home/categories', homeCategories);
//       console.log("CREATE RESPONSE 👉", response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error("ERROR ❌", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         'Failed to create home categories';

//       return rejectWithValue(errorMessage);
//     }
//   }
// );
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

export const getProductList = createAsyncThunk(
   'products/getProductList',
   async (query, { rejectWithValue }) => {
      try {
         const response = await api.get('product');
         if (response.status !== 200) throw new Error(response.error);
         return response.data.products;
      } catch (error) {
         return rejectWithValue(error.error);
      }
   },
);

export const getProductDetail = createAsyncThunk(
   'products/getProductDetail',
   async (id, { rejectWithValue }) => {},
);

export const createProduct = createAsyncThunk(
   'products/createProduct',
   async (formData, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.post('product/regist', formData);
         if (response.status !== 200) throw new Error(response.error);
         dispatch(showToastMessage({ message: '상품 등록이 완료되었습니다.', status: 'success' }));
         return response.data.data;
      } catch (error) {
         dispatch(showToastMessage({ message: '상품 등록이 실패했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const deleteProduct = createAsyncThunk(
   'products/deleteProduct',
   async (id, { dispatch, rejectWithValue }) => {},
);

export const editProduct = createAsyncThunk(
   'products/editProduct',
   async ({ id, ...formData }, { dispatch, rejectWithValue }) => {},
);

// 슬라이스 생성
const productSlice = createSlice({
   name: 'products',
   initialState: {
      productList: [],
      selectedProduct: null,
      loading: false,
      error: '',
      totalPageNum: 1,
      success: false,
   },
   reducers: {
      setSelectedProduct: (state, action) => {
         state.selectedProduct = action.payload;
      },
      setFilteredList: (state, action) => {
         state.filteredList = action.payload;
      },
      clearError: (state) => {
         state.error = '';
         state.success = false;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(createProduct.pending, (state) => {
            state.loading = true;
         })
         .addCase(createProduct.fulfilled, (state) => {
            state.loading = false;
            state.error = '';
            state.success = true;
         })
         .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
         })
         .addCase(getProductList.pending, (state) => {
            state.loading = true;
         })
         .addCase(getProductList.fulfilled, (state, action) => {
            state.loading = false;
            state.productList = action.payload;
            state.error = '';
         })
         .addCase(getProductList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         });
   },
});

export const { setSelectedProduct, setFilteredList, clearError } = productSlice.actions;
export default productSlice.reducer;

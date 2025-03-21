import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

export const getUserProductList = createAsyncThunk(
   'products/getUserProductList',
   async ({ category = null, name = null }, { rejectWithValue }) => {
      try {
         const response = await api.get('/product', {
            params: { category, name },
         });
         return response.data;
      } catch (error) {
         console.error(error.message);
         return rejectWithValue(error.error);
      }
   },
);

export const getAdminProductList = createAsyncThunk(
   'products/getAdminProductList',
   async (query, { rejectWithValue }) => {
      try {
         const response = await api.get('/product/admin', { params: { ...query } });
         return response.data;
      } catch (error) {
         console.error(error.message);
         return rejectWithValue(error.error);
      }
   },
);

export const getProductDetail = createAsyncThunk(
   'products/getProductDetail',
   async (id, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.get(`/product/${id}`);
         return response.data.data;
      } catch (error) {
         console.error(error.message);
         dispatch(showToastMessage({ message: '상품 상세조회에 실패했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const createProduct = createAsyncThunk(
   'products/createProduct',
   async (formData, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.post('/product/regist', formData);
         dispatch(showToastMessage({ message: '상품 등록이 완료되었습니다.', status: 'success' }));
         dispatch(getUserProductList({ page: 1 }));
         return response.data.data;
      } catch (error) {
         console.error(error.message);
         const errorMessage = error.message.includes('이미 등록된 상품번호 입니다.')
            ? '이미 등록된 상품번호 입니다.'
            : '상품 등록이 실패했습니다.';
         dispatch(showToastMessage({ message: errorMessage, status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const deleteProduct = createAsyncThunk(
   'products/deleteProduct',
   async (id, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.delete(`/product/${id}`);
         dispatch(showToastMessage({ message: '상품 삭제 완료', status: 'success' }));
         dispatch(getUserProductList({ page: 1 }));
         return response.data;
      } catch (error) {
         console.error(error.message);
         return rejectWithValue(error.error);
      }
   },
);

export const editProduct = createAsyncThunk(
   'products/editProduct',
   async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.put(`/product/${id}`, formData);
         dispatch(getUserProductList({ page: 1 }));
         dispatch(showToastMessage({ message: '상품 수정이 완료되었습니다.', status: 'success' }));
         return response.data.data;
      } catch (error) {
         console.error(error.message);
         dispatch(showToastMessage({ message: '상품 수정이 실패했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const getAdminProductListForStats = createAsyncThunk(
   'products/getAdminProductListForStats',
   async (_, { rejectWithValue }) => {
      try {
         const response = await api.get('/product/admin/stats');
         console.log(response);
         return response.data.data;
      } catch (error) {
         console.error(error.message);
         return rejectWithValue(error.error);
      }
   },
);

// 슬라이스 생성
const productSlice = createSlice({
   name: 'products',
   initialState: {
      userProductList: [],
      productList: [],
      productListForStats: [],
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
            state.error = '';
            state.success = true;
            state.loading = false;
         })
         .addCase(createProduct.rejected, (state, action) => {
            state.error = action.payload;
            state.success = false;
            state.loading = false;
         })
         .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
         })
         .addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
         })
         .addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(getUserProductList.pending, (state) => {
            state.loading = true;
         })
         .addCase(getUserProductList.fulfilled, (state, action) => {
            state.loading = false;
            state.userProductList = action.payload.productList;
            state.error = '';
            state.totalPageNum = action.payload.totalPageNum;
         })
         .addCase(getUserProductList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(getAdminProductList.pending, (state) => {
            state.loading = true;
         })
         .addCase(getAdminProductList.fulfilled, (state, action) => {
            state.loading = false;
            state.adminProductList = action.payload.productList;
            state.error = '';
            state.totalPageNum = action.payload.totalPageNum;
         })
         .addCase(getAdminProductList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(editProduct.pending, (state, action) => {
            state.loading = true;
         })
         .addCase(editProduct.fulfilled, (state) => {
            state.error = '';
            state.success = true;
            state.loading = false;
         })
         .addCase(editProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
         })
         .addCase(getProductDetail.pending, (state) => {
            state.loading = true;
         })
         .addCase(getProductDetail.fulfilled, (state, action) => {
            state.selectedProduct = action.payload;
            state.loading = false;
            state.error = '';
         })
         .addCase(getProductDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(getAdminProductListForStats.pending, (state) => {
            state.loading = true;
         })
         .addCase(getAdminProductListForStats.fulfilled, (state, action) => {
            state.loading = false;
            state.productListForStats = action.payload;
            state.error = '';
         })
         .addCase(getAdminProductListForStats.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         });
   },
});

export const { setSelectedProduct, setFilteredList, clearError } = productSlice.actions;
export default productSlice.reducer;

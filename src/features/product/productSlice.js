import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

export const getProductList = createAsyncThunk(
   'products/getProductList',
   async (query, { rejectWithValue }) => {
      try {
         const response = await api.get('/product', { params: { ...query } });
         console.log(response);
         if (response.status !== 200) throw new Error(response.error);
         return response.data;
      } catch (error) {
         console.error(error);
         return rejectWithValue(error.error);
      }
   },
);

export const getProductDetail = createAsyncThunk(
   'products/getProductDetail',
   async (id, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.get(`/product/${id}`);
         if (response.status !== 200) throw new Error(response.error);
         console.log(response);
         return response.data.data;
      } catch (error) {
         console.error(error);
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
         if (response.status !== 200) throw new Error(response.error);
         dispatch(showToastMessage({ message: '상품 등록이 완료되었습니다.', status: 'success' }));
         dispatch(getProductList({ page: 1 }));
         return response.data.data;
      } catch (error) {
         console.error(error);
         dispatch(showToastMessage({ message: '상품 등록이 실패했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const deleteProduct = createAsyncThunk(
   'products/deleteProduct',
   async (id, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.delete(`/product/${id}`);
         if (response.status !== 200) throw new Error(response.error);
         dispatch(showToastMessage({ message: '상품 삭제 완료', status: 'success' }));
         dispatch(getProductList({ page: 1 }));

         return response.data;
      } catch (error) {
         return rejectWithValue(error.error);
      }
   },
);

export const editProduct = createAsyncThunk(
   'products/editProduct',
   async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.put(`/product/${id}`, formData);
         if (response.status !== 200) throw new Error(response.error);
         dispatch(getProductList({ page: 1 }));
         dispatch(showToastMessage({ message: '상품 수정이 완료되었습니다.', status: 'success' }));
         return response.data.data;
      } catch (error) {
         console.error(error);
         dispatch(showToastMessage({ message: '상품 수정이 실패했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
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
            state.error = '';
            state.success = true;
            state.loading = false;
            setTimeout(() => {
               state.success = true;
            }, 1000);
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
            state.productList = action.payload.productList;
            state.error = '';
            state.totalPageNum = action.payload.totalPageNum;
         })
         .addCase(editProduct.pending, (state, action) => {
            state.loading = true;
         })
         .addCase(editProduct.fulfilled, (state) => {
            state.error = '';
            state.success = true;
            state.loading = false;
            setTimeout(() => {
               state.success = false;
            }, 1000);
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
         });
   },
});

export const { setSelectedProduct, setFilteredList, clearError } = productSlice.actions;
export default productSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCartQty } from '../cart/cartSlice';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// Define initial state
const initialState = {
   adminOrderList: [],
   orderList: [],
   orderNum: '',
   selectedOrder: {},
   error: '',
   loading: false,
   totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
   'order/createOrder',
   async (payload, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.post('/order', payload);
         dispatch(showToastMessage({ message: '결제가 완료되었습니다.', status: 'success' }));
         dispatch(getCartQty());
         return response.data.orderNum;
      } catch (error) {
         console.error(error.message);
         dispatch(showToastMessage({ message: '주문 요청에 실패했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const getOrder = createAsyncThunk('/order/getOrder', async (_, { rejectWithValue, dispatch }) => {
   try {
      const response = await api.get('/order');
      return response.data;
   } catch (error) {
      console.error(error.message);
      dispatch(showToastMessage({ message: '주문 정보을 불러오지 못했습니다.', status: 'error' }));
      return rejectWithValue(error.error);
   }
});

export const getOrderList = createAsyncThunk(
   'order/getOrderList',
   async (query, { rejectWithValue, dispatch }) => {
      try {
         const response = await api.get('/order/all');
         return response.data;
      } catch (error) {
         console.error(error.message);
         dispatch(showToastMessage({ message: '주문 목록을 불러오지 못했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const updateOrder = createAsyncThunk(
   'order/updateOrder',
   async ({ id, status }, { dispatch, rejectWithValue }) => {
      console.log('🔹 업데이트할 주문 ID:', id);
      console.log('🔹 변경할 상태:', status);

      try {
         const response = await api.put(`/order/${id}`, { status });

         dispatch(showToastMessage({ message: '주문 상태가 변경되었습니다.', status: 'success' }));
         return response.data;
      } catch (error) {
         console.error('🔹 주문 상태 업데이트 실패:', error.message);
         dispatch(showToastMessage({ message: '주문 상태를 변경하지 못했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

// Order slice
const orderSlice = createSlice({
   name: 'order',
   initialState,
   reducers: {
      setSelectedOrder: (state, action) => {
         state.selectedOrder = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(createOrder.pending, (state) => {
            state.loading = true;
         })
         .addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.orderNum = action.payload;
         })
         .addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(getOrder.pending, (state) => {
            state.loading = true;
         })
         .addCase(getOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.orderList = action.payload.orderList;
         })
         .addCase(getOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(getOrderList.pending, (state) => {
            state.loading = true;
         })
         .addCase(getOrderList.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.adminOrderList = action.payload.adminOrderList;
         })
         .addCase(getOrderList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(updateOrder.pending, (state) => {
            state.loading = true;
         })
         .addCase(updateOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.selectedOrder = action.payload.order;
            state.adminOrderList = state.adminOrderList.map((order) =>
               order._id === action.payload.order._id ? action.payload.order : order,
            );
         })
         .addCase(updateOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         });
   },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;

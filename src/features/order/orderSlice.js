import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCartQty } from '../cart/cartSlice';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// Define initial state
const initialState = {
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
         dispatch(showToastMessage({ message: '주문 요청이 실패했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const getOrder = createAsyncThunk('order/getOrder', async (_, { rejectWithValue, dispatch }) => {});

export const getOrderList = createAsyncThunk(
   'order/getOrderList',
   async (query, { rejectWithValue, dispatch }) => {},
);

export const updateOrder = createAsyncThunk(
   'order/updateOrder',
   async ({ id, status }, { dispatch, rejectWithValue }) => {},
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
      builder.addCase(createOrder.pending, (state, action) => {
         state.loading = true;
      });
      builder.addCase(createOrder.fulfilled, (state, action) => {
         state.loading = false;
         state.error = '';
         state.orderNum = action.payload;
      });
      builder.addCase(createOrder.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload;
      });
   },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;

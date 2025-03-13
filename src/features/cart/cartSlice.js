import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

const initialState = {
   loading: false,
   error: '',
   cartList: [],
   selectedItem: {},
   cartItemCount: 0,
   totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
   'cart/addToCart',
   async ({ id, size }, { rejectWithValue, dispatch }) => {
      try {
         const response = await api.post('cart', { productId: id, size, qty: 1 });
         dispatch(showToastMessage({ message: '상품을 장바구니에 추가했습니다.', status: 'success' }));
         return response.data;
      } catch (error) {
         console.error(error.message);
         dispatch(showToastMessage({ message: '상품을 장바구니에 추가하지 못했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const getCartList = createAsyncThunk('cart/getCartList', async (_, { rejectWithValue, dispatch }) => {
   try {
      const response = await api.get('/cart');
      return response.data.data;
   } catch (error) {
      console.error(error.message);
      dispatch(showToastMessage({ message: '장바구니 조회 중 오류가 발생했습니다.', status: 'error' }));
      return rejectWithValue(error.error);
   }
});

export const deleteCartItem = createAsyncThunk(
   'cart/deleteCartItem',
   async (id, { rejectWithValue, dispatch }) => {
      try {
         const response = await api.delete(`/cart/${id}`);
         dispatch(getCartList());
         dispatch(showToastMessage({ message: '해당 상품을 삭제했습니다.', status: 'success' }));
         return response.data.cartItemQty;
      } catch (error) {
         console.error(error.message);
         dispatch(showToastMessage({ message: error, status: 'error' }));
         return rejectWithValue(error);
      }
   },
);

export const updateQty = createAsyncThunk('cart/updateQty', async ({ id, value }, { rejectWithValue }) => {
   try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      return response.data.data;
   } catch (error) {
      console.error(error.message);
      return rejectWithValue(error);
   }
});

export const getCartQty = createAsyncThunk('cart/getCartQty', async (_, { rejectWithValue, dispatch }) => {
   try {
      const response = await api.get('/cart/qty');
      return response.data.qty;
   } catch (error) {
      console.error(error.message);
      dispatch(showToastMessage({ message: error, status: 'error' }));
      return rejectWithValue(error);
   }
});

const cartSlice = createSlice({
   name: 'cart',
   initialState,
   reducers: {
      initialCart: (state) => {
         state.cartItemCount = 0;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(addToCart.pending, (state, action) => {
            state.loading = true;
         })
         .addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.cartItemCount = action.payload.cartItemCount;
         })
         .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(getCartList.pending, (state, action) => {
            state.loading = true;
         })
         .addCase(getCartList.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.cartList = action.payload.items;
            state.cartItemCount = action.payload.items.length;
            state.totalPrice = action.payload.items.reduce(
               (total, item) => total + item.productId.price * item.qty,
               0,
            );
         })
         .addCase(getCartList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(updateQty.fulfilled, (state, action) => {
            state.loading = false;
            state.cartList = action.payload;
            state.totalPrice = action.payload.reduce(
               (total, item) => total + item.productId.price * item.qty,
               0,
            );
         })
         .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.cartItemCount = action.payload;
         })
         .addCase(getCartQty.fulfilled, (state, action) => {
            state.cartItemCount = action.payload;
         });
   },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;

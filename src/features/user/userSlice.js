import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showToastMessage } from '../common/uiSlice';
import api from '../../utils/api';
import { initialCart } from '../cart/cartSlice';

export const loginWithEmail = createAsyncThunk(
   'user/loginWithEmail',
   async ({ email, password }, { rejectWithValue, dispatch }) => {
      try {
         const response = await api.post('/auth/login', { email, password });
         sessionStorage.setItem('token', response.data.token);
         return response.data;
      } catch (error) {
         let errorMessage = '로그인 정보가 일치하지 않습니다.';
         if (error.status === 401) {
            errorMessage = '이메일 인증 후 로그인해 주세요.';
         }

         dispatch(
            showToastMessage({
               message: errorMessage,
               status: 'error',
            }),
         );

         return rejectWithValue(errorMessage);
      }
   },
);

export const loginWithGoogle = createAsyncThunk(
   'user/loginWithGoogle',
   async (token, { rejectWithValue }) => {
      try {
         const response = await api.post('/auth/google', { token });
         sessionStorage.setItem('token', response.data.token);
         return response.data;
      } catch (error) {
         console.error('구글 로그인 실패 : ', error.message);
         return rejectWithValue(error.error);
      }
   },
);

export const logout = createAsyncThunk('/user/logout', async (_, { dispatch }) => {
   sessionStorage.removeItem('token');
   dispatch(initialCart());
   dispatch(
      showToastMessage({
         message: '로그아웃 되었습니다',
         status: 'info',
      }),
   );
});
export const registerUser = createAsyncThunk(
   'user/registerUser',
   async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
      try {
         const response = await api.post('/user/regist', { email, name, password });
         dispatch(
            showToastMessage({
               message: ['회원 가입이 완료되었습니다.', '이메일을 인증 후 로그인해 주세요.'],
               status: 'success',
            }),
         );
         navigate('/login');
         return response.data.data;
      } catch (error) {
         console.error('회원 등록 실패 : ', error.message);
         dispatch(showToastMessage({ message: '회원 가입 중 오류가 발생했습니다.', status: 'error' }));
         return rejectWithValue(error.error);
      }
   },
);

export const loginWithToken = createAsyncThunk('/user/loginWithToken', async (_, { rejectWithValue }) => {
   try {
      const response = await api.get('/user/me');
      return response.data;
   } catch (error) {
      return rejectWithValue(error.error);
   }
});

export const checkEmailExists = createAsyncThunk(
   'user/checkEmailExists',
   async (email, { rejectWithValue }) => {
      try {
         const response = await api.post('/user/check-email', { email });
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   },
);

const userSlice = createSlice({
   name: 'user',
   initialState: {
      user: null,
      loading: false,
      loginError: null,
      registrationError: null,
      success: false,
      emailExists: null,
      checkingEmail: false,
   },
   reducers: {
      clearErrors: (state) => {
         state.loginError = null;
         state.registrationError = null;
         state.emailExists = null;
      },
      logout,
      setEmailVerified: (state, action) => {
         state.emailVerified = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(registerUser.pending, (state) => {
            state.loading = true;
         })
         .addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
            state.registrationError = null;
         })
         .addCase(registerUser.rejected, (state, action) => {
            state.registrationError = action.payload;
         })
         .addCase(loginWithEmail.pending, (state) => {
            state.loading = true;
         })
         .addCase(loginWithEmail.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.loginError = null;
         })
         .addCase(loginWithEmail.rejected, (state, action) => {
            state.loading = false;
            state.loginError = action.payload;
         })
         .addCase(loginWithToken.fulfilled, (state, action) => {
            state.user = action.payload.user;
         })
         .addCase(logout.fulfilled, () => {
            return {
               user: null,
               loading: false,
               loginError: null,
               registrationError: null,
               success: false,
            };
         })
         .addCase(loginWithGoogle.pending, (state) => {
            state.loading = true;
         })
         .addCase(loginWithGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.loginError = null;
         })
         .addCase(loginWithGoogle.rejected, (state, action) => {
            state.loading = false;
            state.loginError = action.payload;
         })
         .addCase(checkEmailExists.pending, (state) => {
            state.checkingEmail = true;
            state.emailExists = null;
         })
         .addCase(checkEmailExists.fulfilled, (state, action) => {
            state.checkingEmail = false;
            state.emailExists = action.payload.exists;
         })
         .addCase(checkEmailExists.rejected, (state) => {
            state.checkingEmail = false;
            state.emailExists = null;
         });
   },
});
export const { clearErrors, setEmailVerified } = userSlice.actions;
export default userSlice.reducer;

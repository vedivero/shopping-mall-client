export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAIL = 'CREATE_ORDER_FAIL';
export const GET_ORDER_REQUEST = 'GET_ORDER_REQUEST';
export const GET_ORDER_SUCCESS = 'GET_ORDER_SUCCESS';
export const GET_ORDER_FAIL = 'GET_ORDER_FAIL';
export const GET_ORDER_LIST_REQUEST = 'GET_ORDER_LIST_REQUEST';
export const GET_ORDER_LIST_SUCCESS = 'GET_ORDER_LIST_SUCCESS';
export const GET_ORDER_LIST_FAIL = 'GET_ORDER_LIST_FAIL';
export const SET_SELECTED_ORDER = 'SET_SELECTED_ORDER';
export const STATUS_MAP = {
   준비중: 'preparing',
   배송중: 'shipping',
   배송완료: 'delivered',
   환불: 'refund',
};

export const REVERSE_STATUS_MAP = Object.fromEntries(
   Object.entries(STATUS_MAP).map(([kor, eng]) => [eng, kor]),
);

export const UPDATE_ORDER_REQUEST = 'UPDATE_ORDER_REQUEST';
export const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
export const UPDATE_ORDER_FAIL = 'UPDATE_ORDER_FAIL';
export const badgeBg = {
   preparing: 'dark',
   shipping: 'primary',
   refund: 'danger',
   delivered: 'success',
};

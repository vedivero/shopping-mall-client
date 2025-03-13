export const PRODUCT_GET_REQUEST = 'PRODUCT_GET_REQUEST';
export const PRODUCT_GET_SUCCESS = 'PRODUCT_GET_SUCCESS';
export const PRODUCT_GET_FAIL = 'PRODUCT_GET_FAIL';
export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST';
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS';
export const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL';
export const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST';
export const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS';
export const PRODUCT_DELETE_FAIL = 'PRODUCT_DELETE_FAIL';
export const SET_SELECTED_PRODUCT = 'PRODUCT_DELETE_FAIL';
export const PRODUCT_EDIT_REQUEST = 'PRODUCT_EDIT_REQUEST';
export const PRODUCT_EDIT_SUCCESS = 'PRODUCT_EDIT_SUCCESS';
export const PRODUCT_EDIT_FAIL = 'PRODUCT_EDIT_FAIL';
export const SET_FILTERED_LIST = 'SET_FILTERED_LIST';
export const CATEGORY_MAP = {
   상의: 'tops',
   아우터: 'outerwear',
   재킷: 'jackets',
   카디건: 'cardigans',
   셔츠: 'shirts',
   티셔츠: 'tshirts',
   하의: 'bottoms',
   청바지: 'jeans',
   면바지: 'cotton_pants',
   슬랙스: 'slacks',
};

export const REVERSE_CATEGORY_MAP = Object.fromEntries(
   Object.entries(CATEGORY_MAP).map(([kor, eng]) => [eng, kor]),
);

export const STATUS = ['active', 'disactive'];
export const SIZE = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const TOGGLE_ITEM_DIALOG = 'TOGGLE_ITEM_DIALOG';
export const SEARCH_PRODUCT_REQUEST = ' SEARCH_PRODUCT_REQUEST';
export const SEARCH_PRODUCT_SUCCESS = ' SEARCH_PRODUCT_SUCCESS';
export const SEARCH_PRODUCT_FAIL = ' SEARCH_PRODUCT_FAIL';
export const GET_PRODUCT_DETAIL_REQUEST = 'GET_PRODUCT_DETAIL_REQUEST';
export const GET_PRODUCT_DETAIL_SUCCESS = 'GET_PRODUCT_DETAIL_SUCCESS';
export const GET_PRODUCT_DETAIL_FAIL = 'GET_PRODUCT_DETAIL_FAIL';

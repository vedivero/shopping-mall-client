import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import SearchBox from '../../common/component/SearchBox';
import NewItemDialog from './component/NewItemDialog';
import ProductTable from './component/ProductTable';
import { deleteProduct, setSelectedProduct, getAdminProductList } from '../../features/product/productSlice';

const AdminProductPage = () => {
   const navigate = useNavigate();
   const [query] = useSearchParams();
   const dispatch = useDispatch();
   const { loading, adminProductList = [], totalPageNum, success } = useSelector((state) => state.product);
   const [showDialog, setShowDialog] = useState(false);
   const [searchQuery, setSearchQuery] = useState({
      page: query.get('page') || 1,
      name: query.get('name') || '',
   });

   const [mode, setMode] = useState('new');

   useEffect(() => {
      dispatch(getAdminProductList({ ...searchQuery }));
   }, [query, dispatch, searchQuery]);

   useEffect(() => {
      if (searchQuery.name === '') {
         delete searchQuery.name;
      }
      const params = new URLSearchParams(searchQuery);
      const query = params.toString();
      navigate('?' + query);
   }, [searchQuery, navigate]);

   useEffect(() => {
      if (success) {
         setShowDialog(false);
      }
   }, [success]);

   const deleteItem = (id) => {
      let check = window.confirm('상품을 삭제하시겠습니까?');
      if (check) dispatch(deleteProduct(id));
   };

   const openEditForm = (product) => {
      setMode('edit');
      dispatch(setSelectedProduct(product));
      setShowDialog(true);
   };

   const handleClickNewItem = () => {
      setMode('new');
      setShowDialog(true);
   };

   const handlePageClick = ({ selected }) => {
      setSearchQuery({ ...searchQuery, page: selected + 1 });
   };

   if (loading) {
      return <Spinner />;
   }

   return (
      <div className='locate-center'>
         <Container>
            <div className='mt-2'>
               <SearchBox
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder='제품 이름으로 검색'
                  field='name'
               />
            </div>
            <Button className='mt-2 mb-2' onClick={handleClickNewItem}>
               새 상품 등록 +
            </Button>
            <ProductTable
               header={[
                  '#',
                  '상품 관리번호',
                  '상품명',
                  '상품가격',
                  '재고 수량',
                  '상품 이미지',
                  '상품 상태(게시, 숨김)',
                  '상품 관리',
               ]}
               data={adminProductList}
               deleteItem={deleteItem}
               openEditForm={openEditForm}
            />
            <ReactPaginate
               nextLabel='next >'
               onPageChange={handlePageClick}
               pageRangeDisplayed={5}
               pageCount={totalPageNum}
               forcePage={searchQuery.page - 1}
               previousLabel='< previous'
               renderOnZeroPageCount={null}
               pageClassName='page-item'
               pageLinkClassName='page-link'
               previousClassName='page-item'
               previousLinkClassName='page-link'
               nextClassName='page-item'
               nextLinkClassName='page-link'
               breakLabel='...'
               breakClassName='page-item'
               breakLinkClassName='page-link'
               containerClassName='pagination'
               activeClassName='active'
               className='display-center list-style-none'
            />
         </Container>

         <NewItemDialog mode={mode} showDialog={showDialog} setShowDialog={setShowDialog} />
      </div>
   );
};

export default AdminProductPage;

import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import SearchBox from '../../common/component/SearchBox';
import NewItemDialog from './component/NewItemDialog';
import ProductTable from './component/ProductTable';
import { getProductList, deleteProduct, setSelectedProduct } from '../../features/product/productSlice';

const AdminProductPage = () => {
   const navigate = useNavigate();
   const [query] = useSearchParams();
   const dispatch = useDispatch();
   const productList = useSelector((state) => state.product.productList) || [];
   const success = useSelector((state) => state.product.success);
   const [showDialog, setShowDialog] = useState(false);
   const [searchQuery, setSearchQuery] = useState({
      page: query.get('page') || 1,
      name: query.get('name') || '',
   });

   const [mode, setMode] = useState('new');
   const totalPageNum = useSelector((state) => state.product.totalPageNum);
   const tableHeader = ['#', 'Sku', 'Name', 'Price', 'Stock', 'Image', 'Status', ''];

   useEffect(() => {
      dispatch(getProductList({ ...searchQuery }));
   }, [query]);

   useEffect(() => {
      if (searchQuery.name === '') {
         delete searchQuery.name;
      }
      const params = new URLSearchParams(searchQuery);
      const query = params.toString();
      navigate('?' + query);
   }, [searchQuery]);

   useEffect(() => {
      if (success) {
         setShowDialog(false);
      }
   }, [success]);

   const deleteItem = (id) => {
      //아이템 삭제하가ㅣ
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
               Add New Item +
            </Button>

            <ProductTable
               header={tableHeader}
               data={productList}
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

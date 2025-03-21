import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderDetailDialog from './component/OrderDetailDialog';
import OrderTable from './component/OrderTable';
import SearchBox from '../../common/component/SearchBox';
import { getOrderList, setSelectedOrder } from '../../features/order/orderSlice';
import './style/adminOrder.style.css';

const AdminOrderPage = () => {
   const navigate = useNavigate();
   const [query] = useSearchParams();
   const dispatch = useDispatch();
   const { loading, adminOrderList, totalPageNum } = useSelector((state) => state.order);
   const [searchQuery, setSearchQuery] = useState({
      page: query.get('page') || 1,
      orderNum: query.get('ordernum') || '',
   });

   const [open, setOpen] = useState(false);
   const tableHeader = ['#', '주문번호', '주문날짜', '회원명', '주문상품', '배송지', '주문총액', '주문상태'];

   useEffect(() => {
      dispatch(getOrderList({ ...searchQuery }));
   }, [searchQuery, dispatch]);

   useEffect(() => {
      if (searchQuery.orderNum === '') {
         delete searchQuery.orderNum;
      }
      const params = new URLSearchParams(searchQuery);
      const queryString = params.toString();

      navigate('?' + queryString);
   }, [searchQuery, navigate]);

   const openEditForm = (order) => {
      setOpen(true);
      dispatch(setSelectedOrder(order));
   };

   const handlePageClick = ({ selected }) => {
      setSearchQuery({ ...searchQuery, page: selected + 1 });
   };

   const handleClose = () => {
      setOpen(false);
   };

   if (loading) {
      return <Spinner />;
   }

   return (
      <div className='locate-center'>
         <Container>
            <div className='mt-2 display-center mb-2'>
               <SearchBox
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder='주문번호 검색'
                  field='orderNum'
               />
            </div>

            <OrderTable header={tableHeader} data={adminOrderList} openEditForm={openEditForm} />
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

         {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
      </div>
   );
};

export default AdminOrderPage;

import React, { useEffect, useState } from 'react';
import { Form, Modal, Button, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_MAP } from '../../../constants/order.constants';
import { currencyFormat } from '../../../utils/number';
import { updateOrder } from '../../../features/order/orderSlice';

const OrderDetailDialog = ({ open, handleClose }) => {
   const selectedOrder = useSelector((state) => state.order.selectedOrder);
   const [orderStatus, setOrderStatus] = useState(selectedOrder?.status || '');

   const dispatch = useDispatch();

   useEffect(() => {
      if (selectedOrder) {
         setOrderStatus(selectedOrder.status);
      }
   }, [selectedOrder]);

   const handleStatusChange = (event) => {
      setOrderStatus(event.target.value);
   };
   const submitStatus = (event) => {
      event.preventDefault();
      dispatch(updateOrder({ id: selectedOrder._id, status: orderStatus }));
      handleClose();
   };

   if (!selectedOrder) {
      return <></>;
   }

   return (
      <Modal show={open} onHide={handleClose}>
         <Modal.Header closeButton>
            <Modal.Title>주문 상세정보</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <p>주문번호 : {selectedOrder.orderNum}</p>
            <p>주문날짜 : {selectedOrder.createdAt.slice(0, 10)}</p>
            <p>이메일 : {selectedOrder.userId.email}</p>
            <p>주소 :{selectedOrder.shipTo.address + ' ' + selectedOrder.shipTo.city}</p>
            <p>
               연락처:
               {`${selectedOrder.contact.firstName + selectedOrder.contact.lastName} ${
                  selectedOrder.contact.contact
               }`}
            </p>
            <p>주문내역</p>
            <div className='overflow-x'>
               <Table>
                  <thead>
                     <tr>
                        <th>상품관리번호</th>
                        <th>상품명</th>
                        <th>상품가격</th>
                        <th>주문개수</th>
                        <th>총가격</th>
                     </tr>
                  </thead>
                  <tbody>
                     {selectedOrder.items.length > 0 &&
                        selectedOrder.items.map((item) => (
                           <tr key={item._id}>
                              <td>{item._id}</td>
                              <td>{item.productId.name}</td>
                              <td>{currencyFormat(item.price)}</td>
                              <td>{item.qty}</td>
                              <td>{currencyFormat(item.price * item.qty)}</td>
                           </tr>
                        ))}
                     <tr>
                        <td colSpan={4}>총계:</td>
                        <td>{currencyFormat(selectedOrder.totalPrice)}</td>
                     </tr>
                  </tbody>
               </Table>
            </div>
            <Form onSubmit={submitStatus}>
               <Form.Group as={Col} controlId='status'>
                  <Form.Label>주문 상태 </Form.Label>
                  <Form.Select value={orderStatus} onChange={handleStatusChange}>
                     {Object.entries(STATUS_MAP).map(([kor, eng], idx) => (
                        <option key={idx} value={eng}>
                           {kor}
                        </option>
                     ))}
                  </Form.Select>
               </Form.Group>

               <div className='order-button-area'>
                  <Button variant='light' onClick={handleClose} className='order-button'>
                     닫기
                  </Button>
                  <Button type='submit'>저장</Button>
               </div>
            </Form>
         </Modal.Body>
      </Modal>
   );
};

export default OrderDetailDialog;

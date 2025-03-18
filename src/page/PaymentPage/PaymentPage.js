import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import OrderReceipt from './component/OrderReceipt';
import PaymentForm from './component/PaymentForm';
import './style/paymentPage.style.css';
import { cc_expires_format } from '../../utils/number';
import { createOrder } from '../../features/order/orderSlice';

const PaymentPage = () => {
   const dispatch = useDispatch();
   const { orderNum } = useSelector((state) => state.order);
   const [cardValue, setCardValue] = useState({
      cvc: '',
      expiry: '',
      focus: '',
      name: '',
      number: '',
   });

   const navigate = useNavigate();
   const [firstLoading, setFirstLoading] = useState(true);
   const [shipInfo, setShipInfo] = useState({
      name: '',
      contact: '',
      address: '',
      city: '',
      zip: '',
   });

   const { cartList, totalPrice } = useSelector((state) => state.cart);

   useEffect(() => {
      if (firstLoading) {
         setFirstLoading(false);
      } else {
         if (orderNum !== '') {
            navigate(`/payment/success`);
         }
      }
   }, [orderNum, firstLoading, navigate]);

   const handleSubmit = (event) => {
      event.preventDefault();
      const { name, contact, address, detailAddress } = shipInfo;
      dispatch(
         createOrder({
            totalPrice,
            shipTo: { address, detailAddress },
            contact: { name, contact },
            orderList: cartList.map((item) => {
               return {
                  productId: item.productId._id,
                  price: item.productId.price,
                  qty: item.qty,
                  size: item.size,
               };
            }),
         }),
      );
   };

   const handleFormChange = (event) => {
      const { name, value } = event.target;
      setShipInfo({ ...shipInfo, [name]: value });
   };

   const handlePaymentInfoChange = (event) => {
      const { name, value } = event.target;
      if (name === 'expiry') {
         let newValue = cc_expires_format(value);
         setCardValue({ ...cardValue, [name]: newValue });
         return;
      }
      setCardValue({ ...cardValue, [name]: value });
   };

   const handleInputFocus = (e) => {
      setCardValue({ ...cardValue, focus: e.target.name });
   };

   const handleAddressSearch = () => {
      new window.daum.Postcode({
         oncomplete: (data) => {
            let fullAddress = data.address;
            let extraAddress = '';
            if (data.addressType === 'R') {
               if (data.bname !== '') extraAddress += data.bname;
               if (data.buildingName !== '')
                  extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
               fullAddress += extraAddress ? ` (${extraAddress})` : '';
            }
            setShipInfo({ ...shipInfo, address: fullAddress });
         },
      }).open();
   };

   if (cartList?.length === 0) {
      navigate('/cart');
   }
   return (
      <Container>
         <Row>
            <Col lg={7}>
               <div>
                  <h2 className='mb-2'>배송 주소</h2>
                  <div>
                     <Form onSubmit={handleSubmit}>
                        <Row className='mb-3'>
                           <Form.Group className='mb-3' controlId='name'>
                              <Form.Label>이름</Form.Label>
                              <Form.Control type='text' onChange={handleFormChange} required name='name' />
                           </Form.Group>
                        </Row>

                        <Form.Group className='mb-3' controlId='formGridAddress1'>
                           <Form.Label>연락처</Form.Label>
                           <Form.Control
                              placeholder='010-xxx-xxxxx'
                              onChange={handleFormChange}
                              required
                              name='contact'
                           />
                        </Form.Group>

                        {/* 주소 검색 */}
                        <Form.Group className='mb-3'>
                           <Form.Label>주소</Form.Label>
                           <InputGroup>
                              <Form.Control
                                 type='text'
                                 placeholder=''
                                 value={shipInfo.address}
                                 name='address'
                                 readOnly
                                 required
                              />
                              <Button variant='dark' onClick={handleAddressSearch}>
                                 주소 검색
                              </Button>
                           </InputGroup>
                        </Form.Group>

                        {/* 상세 주소 입력 */}
                        <Form.Group className='mb-3'>
                           <Form.Label>상세 주소</Form.Label>
                           <Form.Control
                              type='text'
                              placeholder='상세 주소를 입력하세요'
                              value={shipInfo.detailAddress}
                              onChange={handleFormChange}
                              required
                              name='detailAddress'
                           />
                        </Form.Group>

                        {/* <Row className='mb-3'>
                           <Form.Group as={Col} controlId='formGridCity'>
                              <Form.Label>City</Form.Label>
                              <Form.Control onChange={handleFormChange} required name='city' />
                           </Form.Group>

                           <Form.Group as={Col} controlId='formGridZip'>
                              <Form.Label>Zip</Form.Label>
                              <Form.Control onChange={handleFormChange} required name='zip' />
                           </Form.Group>
                        </Row> */}

                        <div className='mobile-receipt-area'>
                           {cartList?.length === 0 && (
                              <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
                           )}
                        </div>
                        <div>
                           <h2 className='payment-title'>결제 정보</h2>
                           <PaymentForm
                              cardValue={cardValue}
                              handleInputFocus={handleInputFocus}
                              handlePaymentInfoChange={handlePaymentInfoChange}
                           />
                        </div>

                        <Button variant='dark' className='payment-button pay-button' type='submit'>
                           결제하기
                        </Button>
                     </Form>
                  </div>
               </div>
            </Col>
            <Col lg={5} className='receipt-area'>
               <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
            </Col>
         </Row>
      </Container>
   );
};

export default PaymentPage;

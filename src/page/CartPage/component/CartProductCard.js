import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { currencyFormat } from '../../../utils/number';
import { updateQty, deleteCartItem } from '../../../features/cart/cartSlice';
const CartProductCard = ({ item }) => {
   const dispatch = useDispatch();

   const handleQtyChange = (id, value) => {
      dispatch(updateQty({ id, value }));
   };

   const deleteCart = (id) => {
      let check = window.confirm('해당 상품을 삭제하시겠습니까?');
      if (check) dispatch(deleteCartItem(id));
   };

   return (
      <div className='product-card-cart'>
         <Row>
            <Col md={2} xs={12}>
               <img src={item.productId.image} width={112} alt='product' />
            </Col>
            <Col md={10} xs={12}>
               <div className='display-flex space-between'>
                  <h3>{item.productId.name}</h3>
                  <button className='trash-button'>
                     <FontAwesomeIcon icon={faTrash} width={24} onClick={() => deleteCart(item._id)} />
                  </button>
               </div>

               <div>
                  <strong>₩ {currencyFormat(item.productId.price)}</strong>
               </div>
               <div>사이즈 : {item.size}</div>
               <div>총 액 : ₩ {currencyFormat(item.productId.price * item.qty)}</div>
               <div>
                  수량 :
                  <Form.Select
                     onChange={(event) => handleQtyChange(item._id, event.target.value)}
                     required
                     defaultValue={item.qty}
                     className='qty-dropdown'
                  >
                     <option value={1}>1</option>
                     <option value={2}>2</option>
                     <option value={3}>3</option>
                     <option value={4}>4</option>
                     <option value={5}>5</option>
                     <option value={6}>6</option>
                     <option value={7}>7</option>
                     <option value={8}>8</option>
                     <option value={9}>9</option>
                     <option value={10}>10</option>
                  </Form.Select>
               </div>
            </Col>
         </Row>
      </div>
   );
};

export default CartProductCard;

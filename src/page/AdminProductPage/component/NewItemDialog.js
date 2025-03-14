import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CloudinaryUploadWidget from '../../../utils/CloudinaryUploadWidget';
import { SIZE, CATEGORY_MAP, STATUS_MAP } from '../../../constants/product.constants';
import '../style/adminProduct.style.css';
import { clearError, createProduct, editProduct } from '../../../features/product/productSlice';

const InitialFormData = {
   name: '',
   sku: '',
   stock: {},
   image: '',
   description: '',
   category: [],
   status: 'active',
   price: 0,
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
   const { error, success, selectedProduct } = useSelector((state) => state.product);
   const [formData, setFormData] = useState(mode === 'new' ? { ...InitialFormData } : selectedProduct);
   const [stock, setStock] = useState([]);
   const dispatch = useDispatch();
   const [stockError, setStockError] = useState(false);

   useEffect(() => {
      if (success) setShowDialog(false);
   }, [success, setShowDialog]);

   useEffect(() => {
      if (error) {
         console.error('상품 업데이트 오류:', error);
      }
   }, [error]);

   useEffect(() => {
      if (error || !success) {
         dispatch(clearError());
      }
      if (showDialog) {
         if (mode === 'edit') {
            setFormData(selectedProduct);
            // 객체형태로 온 stock =>  다시 배열로
            const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
               size,
               selectedProduct.stock[size],
            ]);
            setStock(sizeArray);
         } else {
            setFormData({ ...InitialFormData });
            setStock([]);
         }
      }
   }, [showDialog, dispatch, error, mode, selectedProduct, success]);

   const handleClose = () => {
      setShowDialog(false);
      setFormData({ ...InitialFormData });
      setStock([]);
      setStockError(false);
   };

   const handleSubmit = (event) => {
      event.preventDefault();
      if (stock.length === 0) return setStockError(true);

      const totalStock = stock.reduce((total, item) => {
         return { ...total, [item[0]]: parseInt(item[1]) };
      }, {});

      const categoryEnglish = formData.category.map((cat) => CATEGORY_MAP[cat] || cat);
      const statusEnglish = STATUS_MAP[formData.status] || formData.status;

      if (mode === 'new') {
         dispatch(
            createProduct({
               ...formData,
               category: categoryEnglish,
               stock: totalStock,
               status: statusEnglish,
            }),
         );
      } else {
         dispatch(
            editProduct({
               ...formData,
               category: categoryEnglish,
               stock: totalStock,
               id: selectedProduct._id,
            }),
         );
      }
   };

   const handleChange = (event) => {
      const { id, value } = event.target;
      setFormData({ ...formData, [id]: value });
   };

   const addStock = () => {
      setStock([...stock, []]);
   };

   const deleteStock = (idx) => {
      const newStock = stock.filter((item, index) => index !== idx);
      setStock(newStock);
   };

   const handleSizeChange = (value, index) => {
      const newStock = [...stock];
      newStock[index][0] = value;
      setStock(newStock);
   };

   const handleStockChange = (value, index) => {
      const newStock = [...stock];
      newStock[index][1] = value;
      setStock(newStock);
   };

   const onHandleCategory = (event) => {
      if (formData.category.includes(event.target.value)) {
         const newCategory = formData.category.filter((item) => item !== event.target.value);
         setFormData({
            ...formData,
            category: [...newCategory],
         });
      } else {
         setFormData({
            ...formData,
            category: [...formData.category, event.target.value],
         });
      }
   };

   const uploadImage = (url) => {
      setFormData({ ...formData, image: url });
   };

   return (
      <Modal show={showDialog} onHide={handleClose}>
         <Modal.Header closeButton>
            {mode === 'new' ? (
               <Modal.Title>상품 등록하기</Modal.Title>
            ) : (
               <Modal.Title>상품 수정하기</Modal.Title>
            )}
         </Modal.Header>
         {error && (
            <div className='error-message'>
               <Alert variant='danger'>{error}</Alert>
            </div>
         )}
         <Form className='form-container' onSubmit={handleSubmit}>
            <Row className='mb-3'>
               <Form.Group as={Col} controlId='sku'>
                  <Form.Label>상품 관리번호</Form.Label>
                  <Form.Control
                     onChange={handleChange}
                     type='string'
                     placeholder='Enter Sku'
                     required
                     value={formData.sku}
                  />
               </Form.Group>

               <Form.Group as={Col} controlId='name'>
                  <Form.Label>상품명</Form.Label>
                  <Form.Control
                     onChange={handleChange}
                     type='string'
                     placeholder='Name'
                     required
                     value={formData.name}
                  />
               </Form.Group>
            </Row>

            <Form.Group className='mb-3' controlId='description'>
               <Form.Label>상품 설명</Form.Label>
               <Form.Control
                  type='string'
                  placeholder='Description'
                  as='textarea'
                  onChange={handleChange}
                  rows={3}
                  value={formData.description}
                  required
               />
            </Form.Group>

            <Form.Group className='mb-3' controlId='stock'>
               <Form.Label className='mr-1'>재고 수량</Form.Label>
               {stockError && <span className='error-message'>재고를 추가해주세요</span>}
               <Button size='sm' onClick={addStock}>
                  재고 추가하기 +
               </Button>
               <div className='mt-2'>
                  {stock.map((item, index) => (
                     <Row key={index}>
                        <Col sm={4}>
                           <Form.Select
                              onChange={(event) => handleSizeChange(event.target.value, index)}
                              required
                              defaultValue={item[0] ? item[0].toLowerCase() : ''}
                           >
                              <option value='' disabled selected hidden>
                                 Please Choose...
                              </option>
                              {SIZE.map((item, index) => (
                                 <option
                                    inValid={true}
                                    value={item.toLowerCase()}
                                    disabled={stock.some((size) => size[0] === item.toLowerCase())}
                                    key={index}
                                 >
                                    {item}
                                 </option>
                              ))}
                           </Form.Select>
                        </Col>
                        <Col sm={6}>
                           <Form.Control
                              onChange={(event) => handleStockChange(event.target.value, index)}
                              type='number'
                              placeholder='number of stock'
                              value={item[1]}
                              required
                           />
                        </Col>
                        <Col sm={2}>
                           <Button variant='danger' size='sm' onClick={() => deleteStock(index)}>
                              -
                           </Button>
                        </Col>
                     </Row>
                  ))}
               </div>
            </Form.Group>

            <Form.Group className='mb-3' controlId='Image' required>
               <Form.Label>상품 이미지</Form.Label>
               <CloudinaryUploadWidget uploadImage={uploadImage} />

               <img
                  id='uploadedimage'
                  src={formData.image}
                  className='upload-image mt-2'
                  alt='uploadedimage'
               />
            </Form.Group>

            <Row className='mb-3'>
               <Form.Group as={Col} controlId='price'>
                  <Form.Label>상품 가격</Form.Label>
                  <Form.Control
                     value={formData.price}
                     required
                     onChange={handleChange}
                     type='number'
                     placeholder='0'
                  />
               </Form.Group>

               <Form.Group as={Col} controlId='category'>
                  <Form.Label>상품 카테고리</Form.Label>
                  <Form.Control
                     as='select'
                     multiple
                     onChange={onHandleCategory}
                     value={formData.category}
                     required
                  >
                     {Object.keys(CATEGORY_MAP).map((kor, idx) => (
                        <option key={idx} value={CATEGORY_MAP[kor]}>
                           {kor}
                        </option>
                     ))}
                  </Form.Control>
               </Form.Group>

               <Form.Group as={Col} controlId='status'>
                  <Form.Label>상품 상태(게시, 숨김)</Form.Label>
                  <Form.Select value={formData.status} onChange={handleChange} required>
                     {Object.keys(STATUS_MAP).map((kor, idx) => (
                        <option key={idx} value={STATUS_MAP[kor]}>
                           {kor}
                        </option>
                     ))}
                  </Form.Select>
               </Form.Group>
            </Row>
            {mode === 'new' ? (
               <Button variant='primary' type='submit'>
                  Submit
               </Button>
            ) : (
               <Button variant='primary' type='submit'>
                  수정
               </Button>
            )}
         </Form>
      </Modal>
   );
};

export default NewItemDialog;

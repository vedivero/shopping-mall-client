import React, { useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from '../../features/product/productSlice';

const LandingPage = () => {
   const dispatch = useDispatch();

   const productList = useSelector((state) => state.product.productList);
   const [query] = useSearchParams();
   const name = query.get('name');
   useEffect(() => {
      dispatch(
         getProductList({
            name,
         }),
      );
   }, [query, dispatch, name]);

   return (
      <Container>
         <Row>
            {productList === undefined
               ? null
               : productList?.length > 0
               ? productList.map((item) => (
                    <Col md={3} sm={12} key={item._id}>
                       <ProductCard item={item} />
                    </Col>
                 ))
               : name !== undefined &&
                 name !== null && (
                    <div className='text-align-center empty-bag'>
                       {name.trim() === '' ? (
                          <h2>등록된 상품이 없습니다.</h2>
                       ) : (
                          <h2>'{name}'의 검색 결과가 없습니다.</h2>
                       )}
                    </div>
                 )}
         </Row>
      </Container>
   );
};

export default LandingPage;

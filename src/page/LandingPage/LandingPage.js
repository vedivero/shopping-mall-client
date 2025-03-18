import React, { useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ColorRing } from 'react-loader-spinner';
import { getUserProductList } from '../../features/product/productSlice';

const LandingPage = () => {
   const dispatch = useDispatch();
   const { loading, userProductList: productList } = useSelector((state) => state.product);
   const [query] = useSearchParams();
   const name = query.get('name');
   const category = query.get('category');

   useEffect(() => {
      dispatch(getUserProductList({ name, category }));
   }, [query, dispatch, name, category]);

   if (loading) {
      return (
         <div
            className='loading-spinner'
            style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}
         >
            <ColorRing
               visible={true}
               height='80'
               width='80'
               ariaLabel='blocks-loading'
               colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />
         </div>
      );
   }

   return (
      <Container>
         <Row>
            {productList?.length > 0
               ? productList.map((item) => (
                    <Col md={3} sm={12} key={item._id}>
                       <ProductCard item={item} />
                    </Col>
                 ))
               : name && (
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

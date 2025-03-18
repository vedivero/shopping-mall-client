import React, { useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProductList } from '../../features/product/productSlice';
import Spinner from '../../common/component/Spinner';

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
      return <Spinner />;
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

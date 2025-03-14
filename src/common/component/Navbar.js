import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faBox, faSearch, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/user/userSlice';
import { getCartList } from '../../features/cart/cartSlice';
import { CATEGORY_MAP } from '../../constants/product.constants';
import { getUserProductList } from '../../features/product/productSlice';

const Navbar = ({ user }) => {
   const dispatch = useDispatch();
   const { cartItemCount } = useSelector((state) => state.cart);
   const isMobile = window.navigator.userAgent.indexOf('Mobile') !== -1;
   const [showSearchBox, setShowSearchBox] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState(null);

   useEffect(() => {
      if (user) dispatch(getUserProductList());
   }, [user, dispatch]);

   const menuList = [
      '전체',
      '상의',
      '하의',
      '아우터',
      '재킷',
      '카디건',
      '셔츠',
      '티셔츠',
      '청바지',
      '면바지',
      '슬랙스',
   ];

   let [width, setWidth] = useState(0);
   let navigate = useNavigate();

   const onCheckEnter = (event) => {
      if (event.key === 'Enter') {
         const keyword = event.target.value.trim();

         if (keyword === '') {
            dispatch(getUserProductList({ page: 1, category: selectedCategory }));
            return navigate('/');
         }

         dispatch(getUserProductList({ page: 1, category: selectedCategory, name: keyword }));
         navigate(`?name=${keyword}${selectedCategory ? `&category=${selectedCategory}` : ''}`);
      }
   };

   const handleLogout = () => {
      dispatch(logout());
   };

   const handleMenuClick = (menu) => {
      if (menu === '전체') {
         setSelectedCategory(null);
         dispatch(getUserProductList({ page: 1, category: null }));
         return navigate('/');
      }

      const categoryEnglish = CATEGORY_MAP[menu] || menu;
      setSelectedCategory(categoryEnglish);
      dispatch(getUserProductList({ page: 1, category: categoryEnglish }));
      navigate(`?category=${categoryEnglish}`);
   };

   return (
      <div>
         {showSearchBox && (
            <div className='display-space-between mobile-search-box w-100'>
               <div className='search display-space-between w-100'>
                  <div>
                     <FontAwesomeIcon className='search-icon' icon={faSearch} />
                     <input type='text' placeholder='제품검색' onKeyPress={onCheckEnter} />
                  </div>
                  <button className='closebtn' onClick={() => setShowSearchBox(false)}>
                     &times;
                  </button>
               </div>
            </div>
         )}
         <div className='side-menu' style={{ width: width }}>
            <button className='closebtn' onClick={() => setWidth(0)}>
               &times;
            </button>

            <div className='side-menu-list' id='menu-list'>
               {menuList.map((menu, index) => (
                  <button key={index} onClick={() => handleMenuClick(menu)}>
                     {menu}
                  </button>
               ))}
            </div>
         </div>
         {user && user.level === 'admin' && (
            <Link to='/admin/product?page=1' className='link-area'>
               관리자 페이지로 이동
            </Link>
         )}
         <div className='nav-header'>
            <div className='burger-menu hide'>
               <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
            </div>

            <div>
               <div className='display-flex'>
                  {user ? (
                     <div onClick={handleLogout} className='nav-icon'>
                        <FontAwesomeIcon icon={faUser} />
                        {!isMobile && <span style={{ cursor: 'pointer' }}>로그아웃</span>}
                     </div>
                  ) : (
                     <div onClick={() => navigate('/login')} className='nav-icon'>
                        <FontAwesomeIcon icon={faUser} />
                        {!isMobile && <span style={{ cursor: 'pointer' }}>로그인</span>}
                     </div>
                  )}
                  <div onClick={() => navigate('/cart')} className='nav-icon'>
                     <FontAwesomeIcon icon={faShoppingBag} />
                     {!isMobile && (
                        <span style={{ cursor: 'pointer' }}>{`장바구니(${cartItemCount || 0})`}</span>
                     )}
                  </div>
                  <div onClick={() => navigate('/account/purchase')} className='nav-icon'>
                     <FontAwesomeIcon icon={faBox} />
                     {!isMobile && <span style={{ cursor: 'pointer' }}>내 주문</span>}
                  </div>
                  {isMobile && (
                     <div className='nav-icon' onClick={() => setShowSearchBox(true)}>
                        <FontAwesomeIcon icon={faSearch} />
                     </div>
                  )}
               </div>
            </div>
         </div>

         <div className='nav-logo'>
            <Link to='/'>
               <img width={300} src='/image/logo.png' alt='logo.png' />
            </Link>
         </div>
         <div className='nav-menu-area'>
            <ul className='menu'>
               {menuList.map((menu, index) => (
                  <li key={index} onClick={() => handleMenuClick(menu)}>
                     <a href='#'>{menu}</a>
                  </li>
               ))}
            </ul>
            {!isMobile && (
               <div className='search-box landing-search-box'>
                  <FontAwesomeIcon icon={faSearch} />
                  <input type='text' placeholder='제품검색' onKeyPress={onCheckEnter} />
               </div>
            )}
         </div>
      </div>
   );
};

export default Navbar;

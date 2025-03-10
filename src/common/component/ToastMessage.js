import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = () => {
   const { toastMessage } = useSelector((state) => state.ui);
   console.log('here', toastMessage);
   useEffect(() => {
      if (toastMessage) {
         const { message, status } = toastMessage;
         if (message !== '' && status !== '') {
            toast[status](message, { theme: 'colored' });
         }
      }
   }, [toastMessage]);
   return (
      <ToastContainer
         position='top-center'
         autoClose={3000}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
         theme='light'
         style={{ whiteSpace: 'nowrap', maxWidth: '80vw' }}
      />
   );
};

export default ToastMessage;

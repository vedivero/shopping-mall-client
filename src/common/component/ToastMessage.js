import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = () => {
   const { toastMessage } = useSelector((state) => state.ui);

   useEffect(() => {
      if (toastMessage) {
         const { message, status } = toastMessage;
         if (message !== '' && status !== '') {
            // 배열이면 여러 줄로 출력
            if (Array.isArray(message)) {
               toast[status](
                  <div>
                     {message.map((line, index) => (
                        <p key={index} style={{ margin: 0 }}>
                           {line}
                        </p>
                     ))}
                  </div>,
                  { theme: 'colored' },
               );
            } else {
               toast[status](message, { theme: 'colored' });
            }
         }
      }
   }, [toastMessage]);

   return (
      <ToastContainer
         position='top-center'
         autoClose={1500}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
         theme='light'
         style={{ maxWidth: '90vw', width: '350px' }}
      />
   );
};

export default ToastMessage;

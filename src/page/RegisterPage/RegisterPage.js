import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import './style/register.style.css';
import { checkEmailExists, clearErrors, registerUser } from '../../features/user/userSlice';

const RegisterPage = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { registrationError, emailExists, checkingEmail } = useSelector((state) => state.user);

   const [formData, setFormData] = useState({
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      policy: false,
   });

   const [passwordError, setPasswordError] = useState('');
   const [policyError, setPolicyError] = useState(false);
   const [emailChecked, setEmailChecked] = useState(false);

   useEffect(() => {
      dispatch(clearErrors());
   }, [dispatch]);

   const register = (event) => {
      event.preventDefault();
      const { name, email, password, confirmPassword, policy } = formData;

      if (!emailChecked) {
         alert('이메일 중복 여부를 확인해주세요.');
         return;
      }

      if (emailExists) {
         alert('이미 가입된 이메일입니다.');
         return;
      }

      if (password !== confirmPassword) {
         setPasswordError('비밀번호 확인이 일치하지 않습니다.');
         return;
      }

      if (!policy) {
         setPolicyError(true);
         return;
      }

      setPasswordError('');
      setPolicyError(false);
      dispatch(registerUser({ name, email, password, navigate }));
   };

   const handleChange = (event) => {
      let { id, value, type, checked } = event.target;
      if (id === 'confirmPassword' && passwordError) setPasswordError('');
      if (type === 'checkbox') {
         if (policyError) setPolicyError(false);
         setFormData((prevState) => ({ ...prevState, [id]: checked }));
      } else {
         setFormData({ ...formData, [id]: value });

         if (id === 'email') {
            setEmailChecked(false);
         }
      }
   };

   const handleEmailCheck = () => {
      if (!formData.email) {
         alert('이메일을 입력해주세요.');
         return;
      }

      dispatch(checkEmailExists(formData.email)).then((result) => {
         if (result.payload.exists) {
            setEmailChecked(false);
         } else {
            setEmailChecked(true);
         }
      });
   };

   return (
      <Container className='register-area'>
         {registrationError && (
            <Alert variant='danger' className='error-message'>
               {registrationError}
            </Alert>
         )}

         <Form onSubmit={register}>
            <Form.Group className='mb-3'>
               <Form.Label>이메일</Form.Label>
               <div className='d-flex'>
                  <Form.Control
                     type='email'
                     id='email'
                     placeholder='이메일을 입력해 주세요.'
                     onChange={handleChange}
                     value={formData.email}
                     required
                     style={{ flexGrow: 1, maxWidth: '75%' }}
                  />
                  <Button
                     variant={emailChecked ? 'success' : 'secondary'}
                     onClick={handleEmailCheck}
                     disabled={checkingEmail}
                     style={{
                        marginLeft: '10px',
                        width: '120px',
                        height: '38px',
                     }}
                  >
                     {checkingEmail ? (
                        <Spinner animation='border' size='sm' />
                     ) : emailChecked ? (
                        '확인 완료'
                     ) : (
                        '중복 확인'
                     )}
                  </Button>
               </div>
               {emailExists !== null && (
                  <Alert variant={emailExists ? 'danger' : 'success'} className='mt-2'>
                     {emailExists ? '이미 가입된 이메일입니다.' : '사용 가능한 이메일입니다.'}
                  </Alert>
               )}
            </Form.Group>

            <Form.Group className='mb-3'>
               <Form.Label>이름</Form.Label>
               <Form.Control
                  type='text'
                  id='name'
                  placeholder='이름을 입력해 주세요.'
                  onChange={handleChange}
                  required
               />
            </Form.Group>

            <Form.Group className='mb-3'>
               <Form.Label>비밀번호</Form.Label>
               <Form.Control
                  type='password'
                  id='password'
                  placeholder='비밀번호를 입력해 주세요.'
                  onChange={handleChange}
                  required
               />
            </Form.Group>

            <Form.Group className='mb-3'>
               <Form.Label>비밀번호 확인</Form.Label>
               <Form.Control
                  type='password'
                  id='confirmPassword'
                  placeholder='동일한 비밀번호를 입력해 주세요.'
                  onChange={handleChange}
                  required
                  isInvalid={passwordError}
               />
               <Form.Control.Feedback type='invalid'>{passwordError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3'>
               <Form.Check
                  type='checkbox'
                  label='이용약관에 동의합니다'
                  id='policy'
                  onChange={handleChange}
                  isInvalid={policyError}
                  checked={formData.policy}
               />
            </Form.Group>

            <Button variant='danger' type='submit' disabled={checkingEmail}>
               회원가입
            </Button>
         </Form>
      </Container>
   );
};

export default RegisterPage;

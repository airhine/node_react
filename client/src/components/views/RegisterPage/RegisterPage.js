import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {registerUser} from '../../../_actions/user_action';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
  setEmail(event.currentTarget.value);
};

const onNameHandler = (event) => {
  setName(event.currentTarget.value);
};

const onPasswordHandler = (event) => {
  setPassword(event.currentTarget.value);
};

const onConfirmPasswordHandler = (event) => {
  setConfirmPassword(event.currentTarget.value);
};

  const onSubmitHandler = (event) => {
    event.preventDefault(); // 기본 form submit 새로고침 방지
    // 여기에 서버로 로그인 요청 로직(axios.post 등) 추가
    let body = {
      email: Email,
      password: Password
    }
    dispatch(registerUser(body)).then(response => {
      if (response.payload.success) {
        navigate('/login');
      } else {
        alert('Error');
      }
    })
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh'
      }}
    >
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <button type="submit">
          회원 가입
        </button>
      </form>
    </div>
  );
}

export default RegisterPage

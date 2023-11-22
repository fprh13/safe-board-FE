import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const { loginId, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/safe/login',
        formData
      );

      // Check if the response contains the JWT tokens
      if (response.data.accessToken && response.data.refreshToken) {
        // Store the tokens in local storage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        setLoggedIn(true);
      } else {
        // Handle the case where tokens are not present in the response
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Handle errors, such as network errors or server errors
      setMessage('An error occurred while logging in. Please try again later.');
    }
  };

  if (loggedIn) {
    // 로그인에 성공하면 리디렉션합니다.
    window.location.href = '/';
  }

  return (
    <div className="container mt-5">
      <h2>로그인</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loginId">아이디:</label>
          <input
            type="text"
            className="form-control"
            id="loginId"
            name="loginId"
            value={loginId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          로그인
        </button>
      </form>
      <p className="mt-3">
        아직 계정이 없으신가요? <Link to="/signup">회원가입</Link> 하기
      </p>
      <p>
        비밀번호를 잊으셨나요? <Link to="/findPw">비밀번호 찾기</Link>
      </p>
      <a href="https://kauth.kakao.com/oauth/authorize?client_id=3417138b06d927554bf0df78c4f9ebc0&redirect_uri=http://localhost:3000/loading&response_type=code">
        <img
          src="/image/kakao.png" // 이미지 경로를 지정합니다.
          alt="카카오 로그인"
          className="kakao-login"
        />
      </a>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    name: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(false);

  const { loginId, password, name, email } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsLoginIdAvailable(false); // Reset login ID availability when the user changes the loginId input
    setMessage(''); // Reset the message when the user changes the loginId input
  };

  const handleCheckDuplication = async () => {
    try {
      if (!loginId) {
        throw new Error('아이디를 입력하세요.');
      }

      const response = await axios.get(
        `http://localhost:8080/safe/duplication/${loginId}`
      );

      if (response.data.check === true) {
        setMessage('이미 사용중인 아이디입니다.');
        setIsLoginIdAvailable(false);
      } else {
        setMessage('사용 가능한 아이디입니다.');
        setIsLoginIdAvailable(true);
      }
    } catch (error) {
      console.error('아이디 중복 체크 오류:', error);
      setMessage('아이디 중복 체크 오류: ' + error.message);
      setIsLoginIdAvailable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!loginId || !isLoginIdAvailable || !password || !name || !email) {
        throw new Error('모든 필수 입력란을 채워주세요.');
      }

      const response = await axios.post(
        'http://localhost:8080/safe/signup',
        formData
      );
      console.log('회원가입 성공:', response.data);
      setMessage('회원가입 성공');

      // Redirect to the home page ("/") after successful signup
      window.location.href = '/';
    } catch (error) {
      console.error('회원가입 오류:', error);
      setMessage('회원가입 실패: ' + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>회원가입</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loginId">아이디:</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="loginId"
              name="loginId"
              value={loginId}
              onChange={handleChange}
              required
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCheckDuplication}
              >
                중복 체크
              </button>
            </div>
          </div>
          {!loginId && message && (
            <small className="text-danger">아이디를 입력하세요.</small>
          )}
          {isLoginIdAvailable ? (
            <small className="text-success">사용 가능한 아이디입니다.</small>
          ) : message ? (
            <small className="text-danger">{message}</small>
          ) : null}
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
        <div className="form-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">이름:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          회원가입
        </button>
      </form>
      <p className="mt-3">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link> 하기
      </p>
    </div>
  );
}

export default Signup;

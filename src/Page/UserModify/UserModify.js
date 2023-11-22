import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserModify() {
  const [formData, setFormData] = useState({
    loginId: '',
    name: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(false);

  const { loginId, name, email } = formData;

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
      if (!loginId || !isLoginIdAvailable || !name || !email) {
        throw new Error('모든 필수 입력란을 채워주세요.');
      }

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        'http://localhost:8080/safe/user/modify',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('수정 성공:', response.data);
      setMessage('수정 성공');

      // Redirect to the home page ("/") after successful signup
      window.location.href = '/';
    } catch (error) {
      console.error('수정 오류:', error);
      setMessage('수정 실패: ' + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>정보 수정</h2>
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
            <small className="text-danger">변경할 이름을 입력하세요.</small>
          )}
          {isLoginIdAvailable ? (
            <small className="text-success">사용 가능한 아이디입니다.</small>
          ) : message ? (
            <small className="text-danger">{message}</small>
          ) : null}
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
          저장하기
        </button>
      </form>
      <Link to="/user" className="back-button">
        돌아가기
      </Link>
    </div>
  );
}

export default UserModify;

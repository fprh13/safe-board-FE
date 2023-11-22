// FindPassword.js (비밀번호 찾기 페이지)
import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../Components/Header'; // 상대 경로로 설정

function FindPassword() {
  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const { loginId, email } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setIsEmailValid(false);
  };

  const handleCheckEmail = async () => {
    try {
      if (!loginId || !email) {
        throw new Error('아이디와 이메일을 입력하세요.');
      }

      const response = await axios.get(
        `http://localhost:8080/safe/check/findPw?loginId=${loginId}&email=${email}`
      );

      if (response.data.check === true) {
        setIsEmailValid(true);
        setMessage('입력하신 아이디와 이메일이 일치합니다.');
      } else {
        setIsEmailValid(false);
        setMessage('입력하신 아이디와 이메일이 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 확인 오류:', error);
      setMessage('이메일 확인 오류: ' + error.message);
      setIsEmailValid(false);
    }
  };

  const handleSendPasswordResetEmail = async () => {
    try {
      if (!isEmailValid) {
        throw new Error('이메일을 확인하세요.');
      }

      const response = await axios.post(
        'http://localhost:8080/safe/check/findPw/sendEmail',
        { loginId }
      );

      console.log('비밀번호 재설정 이메일 발송 성공:', response.data);
      setMessage(
        '임시비밀번호가 이메일로 발송되었습니다. 발송된 비밀번호로 로그인 해주세요'
      );
    } catch (error) {
      console.error('비밀번호 재설정 이메일 발송 오류:', error);
      setMessage('비밀번호 재설정 이메일 발송 오류: ' + error.message);
    }
  };

  return (
    <div>
      <Header></Header>
      <div className="container mt-5">
        <h2>비밀번호 찾기</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form>
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCheckEmail}
          >
            사용자 정보 확인
          </button>
          {isEmailValid && (
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={handleSendPasswordResetEmail}
            >
              이메일로 임시비밀번호 받기
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default FindPassword;

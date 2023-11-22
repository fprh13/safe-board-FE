import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Loading.css';

function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios
        .get(`http://localhost:8080/safe/kakao/${code}`)
        .then((response) => {
          setResponseData(response.data);
          setIsLoading(false);
          // 'access_token' 키로 저장
          localStorage.setItem('access_token', response.data.access_token);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setError(new Error('Code not found in URL'));
    }
  }, []);

  useEffect(() => {
    if (responseData) {
      // 'access_token' 키로 가져오기
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        axios
          .get('http://localhost:8080/safe/kakao/login', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then((testResponse) => {
            console.log('Test Response:', testResponse.data);

            localStorage.setItem('accessToken', testResponse.data.accessToken);
            localStorage.setItem(
              'refreshToken',
              testResponse.data.refreshToken
            );

            // 'access_token' 키로 저장한 값을 삭제
            localStorage.removeItem('access_token');

            window.location.href = '/';
          })
          .catch((testError) => {
            console.error('Test Error:', testError);
          });
      }
    }
  }, [responseData]);

  return (
    <div className="loading-page">
      {isLoading ? (
        <div className="loading-text">➤ 로그인 중...</div>
      ) : (
        <div className="content">
          {error ? (
            <div className="error-message">오류 발생: {error.message}</div>
          ) : (
            <div>
              <h2>✅ 로그인 완료</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LoadingPage;

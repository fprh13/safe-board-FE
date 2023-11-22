import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyProfile() {
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:8080/safe/user/detail`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDeleteUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8080/safe/user/delete`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // 회원 탈퇴가 성공하면 로그아웃 등 추가 처리 가능
      // 예: 로컬 스토리지에서 토큰 제거, 로그아웃 상태로 리다이렉트 등
      // 예: history.push('/logout') 를 사용하여 로그아웃 페이지로 리다이렉트
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>My Profile</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>
            <strong>Login ID:</strong> {userDetails.loginId}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Name:</strong> {userDetails.name}
          </p>
          <Link to="/" className="back-button">
            메인 페이지로 돌아가기
          </Link>
          <Link to="/user/modify" className="back-button">
            개인 정보 수정
          </Link>
          <hr></hr>
          <br></br>
          <br></br>
          <br></br>
          <button onClick={handleDeleteUser} className="btn btn-success">
            회원 탈퇴
          </button>
        </div>
      )}
    </div>
  );
}

export default MyProfile;

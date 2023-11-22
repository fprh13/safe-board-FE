import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Header.css';

function Header() {
  const location = useLocation();

  // JWT 토큰을 로컬 스토리지에서 가져와서 초기 로그인 상태를 설정합니다.
  const initialLoggedInState = localStorage.getItem('accessToken') !== null;
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedInState);

  // 로그아웃 버튼을 클릭할 때 호출되는 함수
  const handleLogout = () => {
    const shouldLogout = window.confirm('로그아웃 하시겠습니까?');
    if (shouldLogout) {
      // 로그아웃 로직을 수행하고 상태를 변경합니다.
      // 예를 들어, 로그아웃 API 호출 또는 로컬 스토리지에서 토큰을 삭제하는 등의 작업을 수행합니다.
      // 여기서는 간단하게 로컬 스토리지에서 토큰을 제거하는 것으로 가정합니다.
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 JWT 토큰을 확인하여 로그인 상태를 업데이트합니다.
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(token !== null);
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="header bg-primary text-white">
      {/* Apply Bootstrap classes */}
      <h1 className="board-list-title">Safe download</h1>
      <div className="create-post-button-container">
        {isLoggedIn && location.pathname !== '/board/write' && (
          <Link to="/board/write" className="btn btn-light mr-2">
            글 작성하기
          </Link>
        )}
        {location.pathname !== '/' && (
          <Link to="/" className="btn btn-light mr-2">
            전체 글 보기
          </Link>
        )}
        {location.pathname !== '/board/search' && (
          <Link to="/board/search" className="btn btn-light">
            게시물 검색
          </Link>
        )}
        {/* 로그인 상태에 따라 버튼을 조건부로 렌더링 */}
        {isLoggedIn && location.pathname !== '/user' && (
          <Link to="/user" className="btn btn-light mr-2">
            내 정보
          </Link>
        )}
        {isLoggedIn ? (
          <button className="btn btn-light" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <Link to="/login" className="btn btn-light">
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;

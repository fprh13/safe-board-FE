import axios from 'axios';

// 로그아웃 요청 보내는 함수
async function logout() {
  try {
    // JWT 토큰을 가져오거나 쿠키 또는 다른 방식으로 토큰을 가져옵니다.
    const accessToken = localStorage.getItem('accessToken');
    // 헤더에 Authorization 토큰을 포함하여 로그아웃 요청을 보냅니다.
    const response = await axios.post(
      'http://localhost:8080/safe/logout',
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 로그아웃에 성공하면 로컬 스토리지에서 토큰을 제거하거나 쿠키를 삭제합니다.
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');

    // 로그아웃 성공 메시지를 출력하거나 리디렉션을 수행할 수 있습니다.
    console.log('로그아웃 성공:', response.data);

    // 예를 들어, 로그아웃 후 홈페이지로 리디렉션할 수 있습니다.
    window.location.href = '/';
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
}

// 로그아웃 함수 호출
logout();

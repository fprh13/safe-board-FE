import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './BoardModify.css'; // 스타일 파일을 import 합니다.
import Header from '../../Components/Header'; // 상대 경로로 설정

function BoardModify() {
  const { id } = useParams();
  const [boardData, setBoardData] = useState({
    boardId: null,
    writer: '',
    title: '',
    content: '',
    createDate: '',
    modifyDate: '',
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    axios
      .get(`http://localhost:8080/safe/modify/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // 원래 데이터를 가져온 후 boardData 상태 변수를 설정
        setBoardData(response.data);
      })
      .catch((error) => {
        console.error('게시물 정보를 불러오는 데 실패했습니다:', error);
      });
  }, [id]);

  const handleTitleChange = (e) => {
    setBoardData({ ...boardData, title: e.target.value });
  };

  const handleContentChange = (e) => {
    setBoardData({ ...boardData, content: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      window.confirm('게시물을 수정하시겠습니까?');
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.put(
        'http://localhost:8080/safe/board/modify',
        {
          boardId: boardData.boardId,
          title: boardData.title,
          content: boardData.content,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('게시물 수정 성공:', response.data);
      window.location.href = '/';
      // 게시물 수정 성공 후 필요한 작업을 수행할 수 있습니다.
    } catch (error) {
      console.error('게시물 수정 오류:', error);
    }
  };

  return (
    <div>
      <Header></Header>
      <div className="board-write-container">
        {' '}
        {/* CSS 클래스 적용 */}
        <h2>게시물 수정</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">제목:</label>
            <input
              type="text"
              id="title"
              value={boardData.title} // 원래 데이터를 입력란에 설정
              onChange={handleTitleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="content">내용:</label>
            <textarea
              id="content"
              value={boardData.content} // 원래 데이터를 입력란에 설정
              onChange={handleContentChange}
              required
            />
          </div>
          <div>
            <button type="submit">수정하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardModify;

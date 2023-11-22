import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BoardWrite.css';
import Header from '../../Components/Header';

function BoardWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    // 파일 선택 시 호출되는 콜백 함수
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const confirmed = window.confirm('게시물을 저장하시겠습니까?');
      if (confirmed) {
        const accessToken = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'requestData',
          new Blob([JSON.stringify({ title, content })], {
            type: 'application/json',
          })
        );

        const response = await axios.post(
          'http://localhost:8080/safe/board/write',
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('게시물 작성 성공:', response.data);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('게시물 작성 오류:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="board-write-container">
        <h2>게시물 작성</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">제목:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="content">내용:</label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              required
            />
          </div>
          <div>
            <label htmlFor="file">파일 업로드:</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              // accept=".jpg, .jpeg, .png, .gif"
            />
          </div>
          <div>
            <button type="submit">작성하기</button>
          </div>
        </form>
        <Link to="/" className="back-button">
          메인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default BoardWrite;

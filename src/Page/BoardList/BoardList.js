import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import './BoardList.css';
import Header from '../../Components/Header';

function App() {
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    currentPage: 0,
  });

  const fetchPosts = async (page, size) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/safe/board/list?page=${page}&size=${size}`
      );
      setPosts(response.data.content);
      setPageInfo({
        totalPages: response.data.totalPage,
        currentPage: response.data.page,
      });
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchPosts(1, 10);
  }, []);

  const handlePageClick = (selectedPage) => {
    fetchPosts(selectedPage.selected + 1, 10);
  };

  return (
    <div>
      <Header></Header>
      <div className="board-list-container">
        {' '}
        {/* Bootstrap 클래스 적용 */}
        <ul className="board-list">
          {posts.map((post) => (
            <li key={post.boardId} className="board-item">
              <div>
                <strong className="board-title">제목:</strong>{' '}
                <Link to={`/board/${post.boardId}`}>{post.title}</Link>
              </div>
              <div>
                <strong className="board-author">글쓴이:</strong> {post.writer}
              </div>
              <div>
                <strong className="board-date">작성일:</strong>{' '}
                {new Date(post.createDate).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
        <ReactPaginate
          pageCount={pageInfo.totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
}

export default App;

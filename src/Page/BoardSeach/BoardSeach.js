import React, { useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header'; // 상대 경로로 설정
import '../../Page/BoardList/BoardList.css'; // CSS 파일을 import 합니다.

function BoardList() {
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    currentPage: 0,
  });
  const [keyword, setKeyword] = useState(''); // 검색어 상태 추가
  const [searchMessage, setSearchMessage] = useState(''); // 검색 결과 메시지 상태 추가

  const fetchPosts = async (page, size, searchKeyword) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/safe/search?page=${page}&size=${size}&keyword=${searchKeyword}`
      );
      const responseData = response.data.content;
      setPosts(responseData);
      setPageInfo({
        totalPages: response.data.totalPage,
        currentPage: response.data.page,
      });

      // Set search message based on search results
      setSearchMessage(responseData.length === 0 ? '검색 결과가 없습니다' : '');
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    }
  };

  const handleSearch = () => {
    fetchPosts(1, 10, keyword); // 검색 버튼을 누를 때 검색 함수 호출
  };

  const handlePageClick = (selectedPage) => {
    fetchPosts(selectedPage.selected + 1, 10, keyword);
  };

  return (
    <div>
      <Header />
      <div className="board-list-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            검색하기
          </button>
        </div>
        {searchMessage && <div className="search-message">{searchMessage}</div>}
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

export default BoardList;

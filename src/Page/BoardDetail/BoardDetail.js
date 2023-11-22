import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './BoardDetail.css';
import Header from '../../Components/Header';

function BoardDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:8080/safe/board/detail/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }

    fetchPost();
  }, [id]);

  const downloadFile = async (fileName) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:8080/safe/file/download/${fileName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const fileNameWithoutRandom = post.fileName.split('_')[1];

  return (
    <div>
      <Header />
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">
                  {post.title}
                  <div className="mb-4">-{post.writer}-</div>
                  <div className="mb-4">
                    {new Date(post.createDate).toLocaleString()}
                  </div>
                </h2>
                <div className="mb-4">
                  <p>{post.content}</p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => downloadFile(post.fileName)}
                    className="btn btn-success"
                  >
                    다운로드 ({fileNameWithoutRandom})
                  </button>
                </div>
                <div className="text-center mt-4">
                  <Link to="/" className="back-button">
                    메인 페이지로 돌아가기
                  </Link>
                  <Link
                    to={`/board/modify/${id}`}
                    className="btn btn-warning ml-2"
                  >
                    수정
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Search from "../Product/asset/Search";
import Filters from "../Product/asset/Filters";
import "./css/BoardGeneral.css";

const BoardGeneral = () => {
  const [bestPosts, setBestPosts] = useState([]); // 베스트 게시글 상태
  const [allPosts, setAllPosts] = useState([]); // 모든 게시글 상태

  // 모든 게시글 데이터 가져오기
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("/api/posts"); // 모든 게시글 API 호출
        const data = await response.json();

        // favoriteCount가 많은 상위 4개 게시글만 필터링
        const sortedPosts = data.posts.sort(
          (a, b) => b.favoriteCount - a.favoriteCount
        ); // 내림차순 정렬
        const topBestPosts = sortedPosts.slice(0, 4); // 상위 4개만 가져옴

        setBestPosts(topBestPosts); // 베스트 게시글 상태 업데이트
        setAllPosts(data.posts); // 모든 게시글 상태 업데이트
      } catch (error) {
        console.error("모든 게시글 가져오기 실패:", error);
      }
    };
    fetchAllPosts();
  }, []);

  return (
    <>
      <Header />
      <div className="BoardGeneralForm">
        <div className="bestPosts">
          <h1>베스트 게시글</h1>
          <div className="bestPostList">
            {bestPosts.map((post) => (
              <div key={post.id} className="bestPost">
                <h3>{post.name}</h3>
                <p>{post.description}</p>
                <p>좋아요 수: {post.favoriteCount}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="postList">
          <div className="postheader">
            <h1>게시글</h1>
            <Link to="/boardCreate">
              <button>글쓰기</button>
            </Link>
          </div>
          <div className="postheader2">
            <Search />
            <Filters />
          </div>
          <div className="postItems">
            {allPosts.length > 0 ? (
              allPosts.map((post) => (
                <div key={post.id} className="postItem">
                  <h3>{post.name}</h3>
                  <p>{post.description}</p>
                  <p>좋아요 수: {post.favoriteCount}</p>
                </div>
              ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BoardGeneral;

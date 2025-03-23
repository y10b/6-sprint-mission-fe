import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Search from "../Product/asset/Search";
import Filters from "../Product/asset/Filters";
import LikeToArticle from "./asset/LikeToArticle";
import Pagination from "../Product/asset/Pagination";
import "./css/BoardGeneral.css";
import { baseURL } from "../../env.js";

const BoardGeneral = () => {
  const [bestPosts, setBestPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [keyword, setKeyword] = useState(""); // 검색어 상태
  const [orderBy, setOrderBy] = useState("recent"); // 정렬 기준 상태

  const defaultImage = "/img/making.png"; // 기본 이미지 URL

  // 모든 게시글 데이터 가져오기
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${baseURL}/articles`); // 모든 게시글 API 호출
        const data = await response.json();

        // 정렬: 좋아요 수로 내림차순 정렬
        const sortedPosts = data.sort(
          (a, b) =>
            (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0) // 좋아요 수 기준으로 내림차순 정렬
        );

        // 상위 3개 베스트 게시글 추출
        const topBestPosts = sortedPosts.slice(0, 3);

        setBestPosts(topBestPosts);
        setAllPosts(sortedPosts);
      } catch (error) {
        console.error("모든 게시글 가져오기 실패:", error);
      }
    };
    fetchAllPosts();
  }, []);

  // 정렬 처리 (orderBy에 따른 정렬)
  useEffect(() => {
    const sorted = [...allPosts]; // allPosts를 복사하여 정렬합니다.

    if (orderBy === "favorite") {
      sorted.sort(
        (a, b) =>
          (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0)
      );
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setAllPosts(sorted); // 정렬된 데이터를 상태로 업데이트
  }, [orderBy]); // orderBy만 의존성으로 두기

  // 필터링 처리 (검색어에 맞는 게시글만 필터링)
  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(keyword.toLowerCase())
  );

  // 현재 페이지에 맞는 게시글 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <>
      <Header />
      <div className="BoardGeneralForm">
        <div className="bestPosts">
          <h1>베스트 게시글</h1>
          <div className="bestPostList">
            {bestPosts.map((post) => (
              <div key={post.id} className="bestPostItem">
                <div className="bestPost">
                  <Link to={`/boardDetail/${post.id}`} className="bestPostLink">
                    <div className="bestPostCard">
                      <p>BEST</p>
                    </div>
                    <div className="bestPostContent">
                      <h3>{post.title}</h3>
                      <img
                        src={post.images || defaultImage} // 이미지 필드가 images로 수정됨
                        alt={post.title}
                        className="postImage"
                      />
                    </div>
                  </Link>
                  <div className="bestPostInfo">
                    <div className="bestPostInfoUser">
                      <p>{post.author ? post.author : "게스트"}</p>
                      <LikeToArticle
                        articleId={post.id} // 각 게시글의 ID
                        initialCount={post.likes ? post.likes.length : 0} // 좋아요 수 (likes가 없을 경우 빈 배열을 사용)
                        onFavoriteToggle={(id, newCount) => {
                          setAllPosts((prevPosts) =>
                            prevPosts.map((post) =>
                              post.id === id
                                ? { ...post, likes: new Array(newCount) }
                                : post
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="bestPostDate">
                      <p> {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
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
            <Search keyword={keyword} setKeyword={setKeyword} />
            <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
          </div>
          <div className="postItems">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <div key={post.id}>
                  <div className="postItem">
                    <Link
                      to={`/boardDetail/${post.id}`}
                      className="bestPostLink"
                    >
                      <div className="postItemContent">
                        <h3>{post.title}</h3>
                        <img
                          src={post.images || defaultImage} // 이미지 필드가 images로 수정됨
                          alt={post.title}
                          className="postImage"
                        />
                      </div>
                    </Link>
                    <div className="postItemInfo">
                      <div className="postItemUser">
                        <p>{post.author ? post.author : "게스트"}</p>
                        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="postItemLike">
                        <LikeToArticle
                          articleId={post.id} // 각 게시글의 ID
                          initialCount={post.likes ? post.likes.length : 0}
                          onFavoriteToggle={(id, newCount) => {
                            setAllPosts((prevPosts) =>
                              prevPosts.map((post) =>
                                post.id === id
                                  ? { ...post, likes: new Array(newCount) }
                                  : post
                              )
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </div>
          <Pagination
            page={currentPage}
            setPage={setCurrentPage}
            hasNext={currentPage < totalPages}
            totalPages={totalPages}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BoardGeneral;

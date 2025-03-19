import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트를 추가
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Search from "../Product/asset/Search";
import Filters from "../Product/asset/Filters";
import FavoriteButton from "../Product/asset/FavoriteButton";
import Pagination from "../Product/asset/Pagination";
import "./css/BoardGeneral.css";

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
        const response = await fetch("/api/posts"); // 모든 게시글 API 호출
        const data = await response.json();

        const sortedPosts = data.posts.sort(
          (a, b) => b.favoriteCount - a.favoriteCount
        ); // 내림차순 정렬
        const topBestPosts = sortedPosts.slice(0, 3);

        setBestPosts(topBestPosts);
        setAllPosts(data.posts);
      } catch (error) {
        console.error("모든 게시글 가져오기 실패:", error);
      }
    };
    fetchAllPosts();
  }, []);

  // 필터링 및 검색 적용
  const filteredPosts = allPosts.filter((post) => {
    const matchesKeyword = post.title
      .toLowerCase()
      .includes(keyword.toLowerCase());
    return matchesKeyword;
  });

  // 정렬 처리
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (orderBy === "favorite") {
      return b.favoriteCount - a.favoriteCount; // 좋아요 순 정렬
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt); // 최신 순 정렬
    }
  });

  // 현재 페이지에 맞는 게시글 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

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
                        src={post.image || defaultImage}
                        alt={post.title}
                        className="postImage"
                      />
                    </div>
                  </Link>
                  <div className="bestPostInfo">
                    <div className="bestPostInfoUser">
                      <p> {post.ownerId}</p>
                      <FavoriteButton
                        productId={post.id} // 각 게시글의 ID
                        initialCount={post.favoriteCount} // 게시글의 초기 좋아요 수
                        onFavoriteToggle={(id, newCount) => {
                          setAllPosts((prevPosts) =>
                            prevPosts.map((post) =>
                              post.id === id
                                ? { ...post, favoriteCount: newCount }
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
                          src={post.image || defaultImage}
                          alt={post.title}
                          className="postImage"
                        />
                      </div>
                    </Link>
                    <div className="postItemInfo">
                      <div className="postItemUser">
                        <p>{post.ownerId}</p>
                        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="postItemLike">
                        <FavoriteButton
                          productId={post.id} // 각 게시글의 ID
                          initialCount={post.favoriteCount} // 게시글의 초기 좋아요 수
                          onFavoriteToggle={(id, newCount) => {
                            setAllPosts((prevPosts) =>
                              prevPosts.map((post) =>
                                post.id === id
                                  ? { ...post, favoriteCount: newCount }
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

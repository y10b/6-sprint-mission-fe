import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import FavoriteButton from "../Product/asset/FavoriteButton"; // FavoriteButton 컴포넌트 추가
import "./css/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("게시글 상세 정보 가져오기 실패:", error);
      }
    };
    fetchPostDetail();
  }, [id]); // id가 변경될 때마다 새로 데이터를 가져옵니다.

  if (!post) return <p>게시글을 로딩 중입니다...</p>;

  return (
    <>
      <Header />
      <div className="postDetail">
        <h1 className="postTitle">{post.title}</h1>
        <div className="postInfo">
          <div className="postCreated">
            <p className="userId">{post.ownerId}</p>
            <p className="postCreatedate">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="OR">|</p>
          <div className="like">
            <button>
              <FavoriteButton
                productId={post.id} // 게시글 ID를 전달
                initialCount={post.favoriteCount} // 초기 좋아요 수 전달
                onFavoriteToggle={(id, newCount) => {
                  setPost((prevPost) => ({
                    ...prevPost,
                    favoriteCount: newCount,
                  }));
                }}
              />
            </button>
          </div>
        </div>
        <hr />
        <p className="postContent">{post.description}</p>
        <div className="commentsArticle">
          <label className="commentTitle">댓글달기</label>
          <textarea
            className="commentTextarea"
            placeholder="댓글을 입력해 주세요."
          ></textarea>
          <button className="commentButton">등록</button>
          <div className="commentsList"></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostDetail;

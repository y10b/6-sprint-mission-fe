import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import LikeToArticle from "./asset/LikeToArticle";
import "./css/PostDetail.css";
import { baseURL } from "../../env";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 게시글과 댓글을 가져오는 useEffect
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        // 게시글 상세 정보 가져오기
        const response = await fetch(`${baseURL}/articles/${id}`);
        if (!response.ok) {
          throw new Error("게시글을 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setPost(data);

        // 댓글 데이터 가져오기
        const commentsResponse = await fetch(
          `${baseURL}/comments/articles/${id}`
        );
        if (!commentsResponse.ok) {
          throw new Error("댓글 데이터를 가져오는 데 실패했습니다.");
        }
        const commentsData = await commentsResponse.json();
        console.log("댓글 데이터:", commentsData); // 댓글 데이터 확인
        setComments(commentsData.comments || []); // 댓글 배열 업데이트
      } catch (error) {
        console.error("게시글 상세 정보 가져오기 실패:", error);
        alert(error.message); // 사용자에게 알림
      }
    };
    fetchPostDetail();
  }, [id]);

  // 댓글 작성 처리
  const handleCommentSubmit = async () => {
    if (newComment.trim() !== "") {
      try {
        const response = await fetch(`${baseURL}/comments/articles/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
            author: "guest", // 실제 사용자 데이터로 바꿀 수 있음
          }),
        });

        if (!response.ok) {
          throw new Error("댓글 등록에 실패했습니다.");
        }

        const newCommentData = await response.json();
        console.log("새 댓글 데이터:", newCommentData); // 새 댓글 확인
        setComments((prevComments) => [...prevComments, newCommentData]); // 댓글 배열 업데이트
        setNewComment(""); // 댓글 입력란 초기화
      } catch (error) {
        console.error("댓글 등록 실패:", error);
        alert(error.message); // 사용자에게 알림
      }
    }
  };

  if (!post) return <p>게시글을 로딩 중입니다...</p>;

  return (
    <>
      <Header />
      <div className="postDetail">
        <h1 className="postTitle">{post.title}</h1>
        <div className="postInfo">
          <div className="postCreated">
            <p className="userId">{post.author ? post.author : "게스트"}</p>
            <p className="postCreatedate">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="OR">|</p>
            <div className="like">
              <LikeToArticle
                articleId={post.id} // 게시글 ID 전달
                initialCount={post.likes ? post.likes.length : 0} // 좋아요 수
                onFavoriteToggle={(id, newCount) => {
                  setPost((prevPost) => ({
                    ...prevPost,
                    likes: new Array(newCount), // 새로운 좋아요 배열 업데이트
                  }));
                }}
              />
            </div>
          </div>
        </div>
        <hr />
        <p className="postContent">{post.content}</p>
        <div className="commentsArticle">
          <label className="commentTitle">댓글달기</label>
          <textarea
            className="commentTextarea"
            placeholder="댓글을 입력해 주세요."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="commentPostBrn">
            <button className="commentButton" onClick={handleCommentSubmit}>
              등록
            </button>
          </div>
          <div className="commentsList">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="commentItem">
                  <p className="commentContent">{comment.content}</p>
                  <div className="commentCreated">
                    <p className="commentAuthor">
                      {comment.author ? comment.author : "게스트"}
                    </p>
                    <p className="commentDate">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="commentNone">
                아직 댓글이 없어요,
                <br />
                지금 댓글을 달아보세요!
              </p>
            )}
          </div>
          <div className="homeBtn">
            <Link to={"/boardGeneral"}>
              <button>목록으로 돌아가기</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostDetail;

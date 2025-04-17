"use client";

import Dropdown from "@/components/DropDown";
import { getDefaultImg } from "@/utils/imagePath";
import Image from "next/image";
import ENTRY_IMAGE from "../../../../public/img/Img_reply_empty.png";

const CommentSection = ({
  comments,
  setComments,
  newComment,
  setNewComment,
  articleId,
}) => {
  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(
        `http://localhost:5000/comments/articles/${articleId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newComment, author: "guest" }),
        }
      );

      if (!response.ok) throw new Error("댓글 등록에 실패했습니다.");
      const newCommentData = await response.json();

      setComments((prev) => [...prev, newCommentData]);
      setNewComment("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mt-8">
      <label className="block text-lg font-semibold text-gray-900">
        댓글달기
      </label>
      <textarea
        className="w-full h-[104px] text-secondary-400 text-[16px] font-[400] mt-2 p-4 text-lg rounded-lg bg-gray-100 resize-none"
        placeholder="댓글을 입력해 주세요."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <div className="mt-4 text-right">
        <button
          className={`px-6 py-2 rounded-md text-white ${
            newComment.trim()
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          등록
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="h-[100px] rounded-b-sm p-4 bg-gray-50 border-b border-secondary-200"
            >
              <div className="flex justify-between">
                <p className="text-lg">{comment.content}</p>
                <Dropdown
                  articleId={articleId}
                  commentId={comment.id}
                  baseUrl="http://localhost:5000/comments/articles"
                  onDelete={() => {
                    setComments((prev) =>
                      prev.filter((c) => c.id !== comment.id)
                    );
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.authorImage || getDefaultImg()}
                    alt="작성자 이미지"
                    className="w-10 h-10 rounded-3xl object-cover "
                  />
                  <p>{comment.author || "게스트"}</p>
                </div>
                <p>{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className=" mx-auto">
            <Image
              src={ENTRY_IMAGE}
              alt="말풍선"
              className="w-[140px] h-[140px] mx-auto"
            />
            <p className="text-center text-gray-500">
              아직 댓글이 없어요,
              <br /> 지금 댓글을 달아보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

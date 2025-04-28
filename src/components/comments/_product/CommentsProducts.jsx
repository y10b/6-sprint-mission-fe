"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCommentsByProductId } from "@/app/api/products/router";
import { postProductComment } from "@/app/api/CUD/commentsApi";
import { formatTimeAgoOrDate } from "@/utils/formatTimeAgoOrDate";
import DropdownComment from "@/components/DropDownComment";

const CommentsProducts = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    if (!productId) {
      setError("상품 ID가 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await getCommentsByProductId({
        productId,
        limit: 4,
        cursor: nextCursor,
      });
      setComments((prev) => [...prev, ...data.comments]);
      setNextCursor(data.nextCursor !== 0 ? data.nextCursor : null);
    } catch (err) {
      setError("댓글을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const newCommentData = await postProductComment(productId, newComment);
      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (err) {
      setError(err.message || "댓글 작성에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  return (
    <div className="mt-10">
      <span className="font-semibold text-base leading-[26px] text-secondary-800 mb-4 block">
        문의하기
      </span>
      <textarea
        className="w-full sm:h-[104px] h-[129px] py-4 px-6 mt-4 resize-none font-normal text-[14px] leading-6 text-gray-800 placeholder:text-secondary-400 bg-gray-100 rounded-lg p-2"
        placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <div className="flex justify-end mt-4">
        <button
          className={`w-[74px] h-[42px] rounded-xl font-semibold text-base leading-[26px] text-gray-100 transition 
            ${
              newComment.trim() === ""
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-100 hover:bg-primary-200"
            }`}
          onClick={handleSubmit}
          disabled={newComment.trim() === ""}
        >
          등록
        </button>
      </div>

      <hr className="my-6 text-gray-200" />

      {error && <p className="text-red-500">{error}</p>}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-[140px] h-[140px] relative mx-auto mb-2">
            <Image
              src="/img/Img_inquiry_empty.png"
              alt="댓글 없음 이미지"
              fill
            />
          </div>
          <p className="text-sm text-gray-500">아직 문의가 없어요</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between mb-6">
                <p className="font-[400] text-[14px] leading-6 text-secondary-800">
                  {comment.content}
                </p>
                <DropdownComment
                  productId={productId}
                  commentId={comment.id}
                  onDelete={fetchComments}
                />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-8 h-8">
                  <Image
                    src={comment.writer.image || "/img/ic_profile.png"}
                    alt="작성자"
                    fill
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-[400] text-[12px] leading-[18px] text-secondary-600">
                    {comment.writer.nickname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgoOrDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {nextCursor && (
        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded text-sm"
          onClick={fetchComments}
          disabled={isLoading}
        >
          {isLoading ? "불러오는 중..." : "더 보기"}
        </button>
      )}
    </div>
  );
};

export default CommentsProducts;

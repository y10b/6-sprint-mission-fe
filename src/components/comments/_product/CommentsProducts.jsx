"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getCommentsByProductId } from "@/features/comments/services/commentsApi";
import { postProductComment } from "@/features/comments/services/commentsApi";
import { formatTimeAgoOrDate } from "@/utils/formatTimeAgoOrDate";
import DropdownMenu from "@/components/Dropdownmenu";

export default function CommentsProducts({ productId }) {
  const [comments, setComments] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(
    async (isInitial = false) => {
      if (!productId) return;

      setIsLoading(true);
      try {
        const { comments: fetchedComments, nextCursor } =
          await getCommentsByProductId({
            productId,
            limit: 4,
            cursor: isInitial ? null : nextCursor,
          });

        setComments((prev) =>
          isInitial ? fetchedComments : [...prev, ...fetchedComments]
        );
        setNextCursor(nextCursor !== 0 ? nextCursor : null);
      } catch {
        setError("댓글을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [productId, nextCursor]
  );

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await postProductComment(productId, newComment);
      setComments((prev) => [addedComment, ...prev]);
      setNewComment("");
    } catch (err) {
      setError(err.message || "댓글 작성에 실패했습니다.");
    }
  };

  const handleDelete = () => fetchComments(true);

  useEffect(() => {
    if (productId) fetchComments(true);
  }, [productId, fetchComments]);

  return (
    <div className="mt-10">
      <h2 className="font-semibold text-base text-secondary-800 mb-4">
        문의하기
      </h2>

      <textarea
        className="w-full sm:h-[104px] h-[129px] mt-4 resize-none bg-gray-100 rounded-lg p-4 text-sm text-gray-800 placeholder:text-secondary-400"
        placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포 시 삭제될 수 있습니다."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className={`w-[74px] h-[42px] rounded-xl font-semibold text-base text-white ${
            newComment.trim()
              ? "bg-primary-100 hover:bg-primary-200"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          등록
        </button>
      </div>

      <hr className="my-6 text-gray-200" />

      {error && <p className="text-red-500">{error}</p>}

      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative w-[140px] h-[140px] mb-2">
            <Image src="/img/Img_inquiry_empty.png" alt="댓글 없음" fill />
          </div>
          <p className="text-sm text-gray-500">아직 문의가 없어요</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between mb-6">
                <p className="text-sm text-secondary-800">{comment.content}</p>
                <DropdownMenu
                  type="comment"
                  itemId={comment.id}
                  onDelete={handleDelete}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image
                    src={comment.user?.image || "/img/ic_profile.png"}
                    alt="작성자 프로필"
                    fill
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="text-xs text-secondary-600">
                    {comment.user?.nickname || "알 수 없음"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgoOrDate(comment.updatedAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {nextCursor && (
        <button
          onClick={() => fetchComments(false)}
          disabled={isLoading}
          className="mt-6 w-full py-2 bg-gray-200 rounded text-sm text-gray-800"
        >
          {isLoading ? "불러오는 중..." : "더 보기"}
        </button>
      )}
    </div>
  );
}

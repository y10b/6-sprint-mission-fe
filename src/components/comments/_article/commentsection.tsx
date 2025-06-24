"use client";

import React, { ChangeEvent } from "react";
import Dropdown from "@/components/Dropdownmenu";
import { getProfileImg } from "@/utils/imagePath";
import Image from "next/image";
import ENTRY_IMAGE from "../../../../public/img/Img_reply_empty.png";
import { ArticleComment } from "@/types/article";
import { createArticleComment } from "@/lib/api/comments/commentsApi";

interface CommentSectionProps {
  comments: ArticleComment[];
  setComments: React.Dispatch<React.SetStateAction<ArticleComment[]>>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  articleId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  setComments,
  newComment,
  setNewComment,
  articleId,
}) => {
  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    try {
      const newCommentData = await createArticleComment(articleId, newComment);
      setComments((prev) => [...prev, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error("Error data:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("댓글 등록에 실패했습니다.");
      }
    }
  };

  return (
    <div className="mt-8 ">
      <label className="text-base leading-[26px] font-semibold text-gray-900">
        댓글달기
      </label>
      <textarea
        className="w-full h-[104px] placeholder:text-secondary-400 text-base font-[400] mt-2 p-4 rounded-lg bg-gray-100 resize-none"
        placeholder="댓글을 입력해 주세요."
        value={newComment}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setNewComment(e.target.value)
        }
      />
      <div className="mt-4 text-right">
        <button
          className={`w-[74px] h-[42px] rounded-[8px] text-white ${
            newComment.trim()
              ? "bg-primary-100 hover:bg-primary-300 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          등록
        </button>
      </div>

      <div className="mt-8 space-y-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="h-24 rounded-b-sm px-4 pb-3 bg-gray-50 border-b border-secondary-200"
            >
              <div className="flex justify-between">
                <p className="font-[400] text-sm leading-6 text-secondary-800">
                  {comment.content}
                </p>
                <Dropdown
                  type="comment"
                  itemId={comment.id}
                  parentId={articleId}
                  onDelete={() => {
                    setComments((prev) =>
                      prev.filter((c) => c.id !== comment.id)
                    );
                  }}
                />
              </div>

              <div className="flex items-center mt-6">
                <div className="relative w-8 h-8 mb-2 mr-2 rounded-3xl overflow-hidden">
                  <Image
                    src={getProfileImg()}
                    alt={`${comment.user.nickname}의 프로필 이미지`}
                    fill
                    className="object-cover rounded-3xl"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{comment.user.nickname}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mx-auto text-center">
            <Image
              src={ENTRY_IMAGE}
              alt="말풍선"
              width={140}
              height={140}
              className="mx-auto"
            />
            <p className="text-gray-500">
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

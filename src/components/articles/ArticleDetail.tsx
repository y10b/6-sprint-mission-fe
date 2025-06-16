"use client";

import React from "react";
import Image from "next/image";
import { getProfileImg } from "@/utils/imagePath";
import LikeToArticle from "@/components/LikeToArticle";
import { Article } from "@/types/article";
import DropdownMenu from "../Dropdownmenu";

interface ArticleDetailProps {
  post: Article;
  onLikeToggle: (id: number, newCount: number) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  post,
  onLikeToggle,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="relative w-10 h-10 mr-4">
          <Image
            src={post.authorImage || getProfileImg()}
            alt={post.author || "작성자 이미지"}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-gray-800 font-medium">{post.author || "익명"}</p>
          <p className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{post.content}</p>

      {post.images && (
        <div className="mb-6">
          <Image
            src={post.images}
            alt="게시글 이미지"
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-end">
        <LikeToArticle
          articleId={post.id}
          initialCount={post.likes?.length || 0}
          onLikeToggle={onLikeToggle}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;

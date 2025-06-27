"use client";

import React from "react";
import Image from "next/image";
import { getProfileImg, getDefaultImg } from "@/utils/imagePath";
import LikeToArticle from "@/components/LikeToArticle";
import { IArticle } from "@/types/article";
import DropdownMenu from "../Dropdownmenu";
import { useRouter } from "next/navigation";

interface ArticleDetailProps {
  post: IArticle;
  onLikeToggle: (id: number, newCount: number) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  post,
  onLikeToggle,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <div className="relative w-10 h-10 mr-4">
            <Image
              src={post.authorImage || getProfileImg()}
              alt={post.authorNickname || "총명한판다"}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-800 font-medium">
              {post.authorNickname || "총명한판다"}
            </p>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DropdownMenu
          type="article"
          itemId={post.id}
          baseUrl="/articles"
          onDelete={() => router.push("/articles")}
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{post.content}</p>

      {post.images ? (
        <div className="mb-6">
          <Image
            src={post.images}
            alt="게시글 이미지"
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="mb-6">
          <Image
            src={getDefaultImg()}
            alt="기본 이미지"
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-end">
        <LikeToArticle
          articleId={post.id}
          initialCount={post.likeCount || 0}
          onLikeToggle={onLikeToggle}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;

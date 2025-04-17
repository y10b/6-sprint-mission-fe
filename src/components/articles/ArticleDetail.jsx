"use client";

import Image from "next/image";
import LikeToProduct from "@/components/LikeToProduct";
import Dropdown from "@/components/DropDown";
import { getProfileImg } from "@/utils/imagePath";

const ArticleDetail = ({ post, onLikeToggle }) => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold leading-8 text-gray-800">
          {post.title}
        </h1>
        <Dropdown
          articleId={post.id}
          baseUrl="http://localhost:5000/articles"
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-secondary-600">
        <div className="relative w-10 h-10 rounded-3xl overflow-hidden">
          <Image
            src={post.authorImage || getProfileImg()}
            alt="작성자 이미지"
            fill
            className="object-cover rounded-3xl"
          />
        </div>
        <p className="text-[14px] leading-6 font-medium text-secondary-600">
          {post.author || "총명한판다"}
        </p>
        <p className="font-[400] text-[14px] leading-6 text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-[34px] mr-8 font-[100] text-gray-200">| </p>
        <button className="w-[87px] h-10 border-1 rounded-[35px] border-secondary-200 px-7 cursor-pointer">
          <LikeToProduct
            articleId={post.id}
            initialCount={post.likes?.length || 0}
            onFavoriteToggle={onLikeToggle}
          />
        </button>
      </div>

      <hr className="my-4 border-gray-200" />
      <p className="text-base text-gray-800 font-[400] leading-[26px] md:text-[18px]">
        {post.content}
      </p>
    </>
  );
};

export default ArticleDetail;

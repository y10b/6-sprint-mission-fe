"use client";

import LikeToProduct from "@/components/LikeToProduct";
import Dropdown from "@/components/DropDown";
import { getDefaultImg } from "@/utils/imagePath";

const PostDetail = ({ post, onLikeToggle }) => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-primary">{post.title}</h1>
        <Dropdown />
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-secondary-600">
        <img
          src={post.authorImage || getDefaultImg()}
          alt="작성자 이미지"
          className="w-10 h-10 rounded-3xl object-cover"
        />
        <p className="text-[14px]">{post.author || "게스트"}</p>
        <span>|</span>
        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        <div className="ml-10">
          <LikeToProduct
            articleId={post.id}
            initialCount={post.likes?.length || 0}
            onFavoriteToggle={onLikeToggle}
          />
        </div>
      </div>
      <hr className="my-4 border-gray-200" />
      <p className="text-[18px] text-secondary-800 font-[400]">
        {post.content}
      </p>
    </>
  );
};

export default PostDetail;

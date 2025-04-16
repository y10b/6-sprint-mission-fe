"use client";
import Image from "next/image";
import Link from "next/link";
import { SlBadge } from "react-icons/sl";
import LikeToArticle from "@/components/LikeToArticle";

const Card = ({ article, defaultImage }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 w-[384px] h-[169px] relative">
      <Link href={`/articles/${article.id}`} className="block">
        <div className="flex gap-1 absolute top-0 left-5 bg-blue-500 text-white text-lg font-semibold py-1 px-4 rounded-b-2xl">
          <SlBadge className="text-amber-500 mt-1.5" />
          Best
        </div>
        <div className="flex justify-between items-center pt-[20px] px-2">
          <h3 className="text-lg font-semibold text-secondary-800 break-keep">
            {article.title}
          </h3>
          <div className="relative w-[72px] h-[72px]">
            <Image
              src={article.images || defaultImage}
              alt={article.title}
              fill
              className="border border-gray-200"
            />
          </div>
        </div>
      </Link>
      <div className="flex justify-between mt-4 text-sm text-secondary-600">
        <div className="flex gap-2">
          <p>{article.author || "게스트"}</p>
          <LikeToArticle
            articleId={article.id}
            initialCount={article.likes?.length || 0}
          />
        </div>
        <p>{new Date(article.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Card;

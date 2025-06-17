"use client";
import Image from "next/image";
import Link from "next/link";
import LikeToArticle from "@/components/LikeToArticle";
import { getBestBadge, getDefaultImg } from "@/utils/imagePath";
import { Article } from "@/types/article";

interface CardProps {
  article: Article;
  defaultImage?: string;
}

const Card = ({ article, defaultImage }: CardProps) => {
  return (
    <div className="bg-secondary-50 px-6 pt-[46px] pb-4 rounded-lg relative">
      <Link href={`/articles/${article.id}`} className="block">
        <div className="flex gap-1 absolute top-0 left-5 bg-primary-100 text-white text-lg font-semibold w-[102px] py-1 px-5 rounded-b-2xl">
          <div className="relative w-[12.39px] h-[14.91px] mt-1.5">
            <Image src={getBestBadge()} alt="best" fill />
          </div>
          Best
        </div>
        <div className="flex justify-between items-start pt-[20px] h-[72px]">
          <h3 className="text-lg font-semibold text-secondary-800 break-words pr-[40px] flex-1">
            {article.title}
          </h3>
          <div className="relative w-[72px] h-[72px] flex-shrink-0">
            <Image
              src={article.images || getDefaultImg()}
              alt={article.title}
              fill
              className="border border-gray-200"
            />
          </div>
        </div>
      </Link>
      <div className="flex justify-between mt-15 text-sm text-secondary-600">
        <div className="flex gap-2">
          <p>{article.authorNickname || "총명한판다"}</p>
          <LikeToArticle
            articleId={article.id}
            initialCount={article.likeCount || 0}
          />
        </div>
        <p>{new Date(article.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Card;

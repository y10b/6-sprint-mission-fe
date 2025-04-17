"use client";
import Image from "next/image";
import Link from "next/link";
import LikeToArticle from "@/components/LikeToArticle";
import { getDefaultImg } from "@/utils/imagePath";

const BEST_BADGE_IMAGE = "img/best_badge.png";

const Card = ({ article }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 lg:w-[384px] lg:h-[169px] md:w-[340px] md:h-[198px] sm:w-[343px] sm:h-[198px] relative">
      <Link href={`/articles/${article.id}`} className="block">
        <div className="flex gap-1 absolute top-0 left-5 bg-blue-500 text-white text-lg font-semibold py-1 px-4 rounded-b-2xl">
          <img
            src={BEST_BADGE_IMAGE}
            alt="best"
            className="w-[12.39px] h-[14.91px] mt-1.5"
          />
          Best
        </div>
        <div className="flex justify-between items-center pt-[20px] px-2">
          <h3 className="text-lg font-semibold text-secondary-800 break-keep">
            {article.title}
          </h3>
          <div className="relative w-[72px] h-[72px]">
            <Image
              src={article.images || getDefaultImg()}
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

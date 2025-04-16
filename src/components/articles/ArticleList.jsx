// components/articles/ArticleList.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import LikeToArticle from "@/components/LikeToArticle";
import { getDefaultImg } from "@/utils/imagePath";

const ArticleList = ({ articles }) => {
  return (
    <div className="article-items mt-6 space-y-6">
      {articles.length > 0 ? (
        articles.map((article) => (
          <div
            key={article.id}
            className="article-item bg-gray-100 p-4 rounded-lg shadow-md h-[138px]"
          >
            <Link href={`/articles/${article.id}`} className="block">
              <div className="flex justify-between gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {article.title}
                </h3>
                <div className="relative w-[72px] h-[72px]">
                  <Image
                    src={article.images || getDefaultImg()}
                    alt={article.title}
                    fill
                    className="border border-gray-200 object-cover"
                  />
                </div>
              </div>
            </Link>
            <div className="article-info flex justify-between mt-4 text-sm text-gray-600 mb-6">
              <div className="author-info flex gap-2">
                <img
                  src={article.authorImage || getDefaultImg()}
                  alt="작성자"
                  className="w-6 h-6 rounded-xl border-gray-400"
                />
                <p>{article.author || "게스트"}</p>
                <p className="text-gray-400">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
              <LikeToArticle
                articleId={article.id}
                initialCount={article.likes?.length || 0}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">게시글이 없습니다.</p>
      )}
    </div>
  );
};

export default ArticleList;

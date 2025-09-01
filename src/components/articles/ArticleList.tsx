"use client";
import React, { memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import LikeToArticle from "@/components/LikeToArticle";
import { getDefaultImg, getProfileImg } from "@/utils/imagePath";
import { IArticleListProps, TId } from "@/types";

/**
 * 최적화된 개별 게시글 카드 컴포넌트
 * React.memo로 불필요한 리렌더링 방지
 */
const ArticleCard = memo(
  ({
    article,
    onLikeToggle,
  }: {
    article: any;
    onLikeToggle: (id: TId, newCount: number) => void;
  }) => {
    return (
      <div className="article-item bg-gray-100 p-4 rounded-lg shadow-md h-[138px]">
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
                loading="lazy" // 지연 로딩 최적화
                placeholder="blur" // 블러 플레이스홀더
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Cp5O8dIc7qj8VLp5w=="
              />
            </div>
          </div>
        </Link>

        <div className="flex justify-between mt-4 text-sm text-gray-600 mb-6">
          <div className="flex gap-2">
            <div className="relative w-6 h-6 rounded-xl border-gray-400">
              <Image
                src={article.authorImage || getProfileImg()}
                alt={article.authorNickname || "작성자"}
                fill
                loading="lazy"
              />
            </div>
            <p>{article.authorNickname || "작성자"}</p>
            <p className="text-gray-400">
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>

          <LikeToArticle
            articleId={article.id}
            initialCount={article.likeCount || 0}
            onLikeToggle={onLikeToggle}
          />
        </div>
      </div>
    );
  }
);

ArticleCard.displayName = "ArticleCard";

/**
 * 최적화된 게시글 목록 컴포넌트
 */
const ArticleList = memo(({ articles }: IArticleListProps) => {
  // 좋아요 토글 핸들러를 useCallback으로 메모이제이션
  const handleLikeToggle = useCallback((id: TId, newCount: number) => {
    // 좋아요 상태 업데이트 로직
    // 여기에 실제 상태 업데이트 로직 구현
  }, []);

  // 빈 상태 처리를 메모이제이션
  const EmptyState = memo(() => (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
      <p className="text-gray-400 text-sm mt-2">
        새로운 게시글을 작성해보세요!
      </p>
    </div>
  ));

  if (!articles || articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="article-items mt-10 space-y-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onLikeToggle={handleLikeToggle}
        />
      ))}
    </div>
  );
});

ArticleList.displayName = "ArticleList";

export default ArticleList;

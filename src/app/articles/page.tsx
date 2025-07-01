"use client";

import { useEffect, useState } from "react";
import BestArticles from "@/components/articles/BestArticles";
import Articles from "@/components/articles/Articles";
import { fetchArticlesFromAPI } from "@/lib/api/articles/articlesApi";
import { OrderByValue } from "@/components/Filters";
import type { IArticle } from "@/types/article";
import { logger } from "@/utils/logger";

const ArticlePage = () => {
  const [allArticles, setAllArticles] = useState<IArticle[]>([]);
  const [bestArticles, setBestArticles] = useState<IArticle[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [orderBy, setOrderBy] = useState<OrderByValue>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [articlesPerPage] = useState<number>(4);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchData = async () => {
    try {
      const data = await fetchArticlesFromAPI({
        page: currentPage,
        limit: articlesPerPage,
        sort: orderBy,
        keyword,
      });

      setAllArticles(data.articles);
      setTotalCount(data.totalCount);

      // 베스트 게시글은 좋아요 순으로 정렬하여 상위 3개만 표시
      const best = await fetchArticlesFromAPI({
        page: 1,
        limit: 3,
        sort: "likes",
        keyword: "",
      });
      setBestArticles(best.articles);
    } catch (err) {
      logger.error("데이터 가져오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderBy, currentPage, keyword]);

  const handleOrderByChange = (value: OrderByValue) => {
    setOrderBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto w-[343px] sm:w-[696px] md:w-300">
      <BestArticles articles={bestArticles} defaultImage="/img/making.png" />
      <Articles
        articles={allArticles}
        keyword={keyword}
        setKeyword={setKeyword}
        orderBy={orderBy}
        setOrderBy={handleOrderByChange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        articlesPerPage={articlesPerPage}
        totalCount={totalCount}
      />
    </div>
  );
};

export default ArticlePage;

"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import BestArticles from "@/components/articles/BestArticles";
import Articles from "@/components/articles/Articles";
import { fetchArticlesFromAPI } from "@/lib/api/articles/articlesApi";
import { OrderByValue } from "@/components/Filters";

interface Article {
  id: number;
  title: string;
  content: string;
  author?: string;
  authorImage?: string;
  images?: string;
  likes?: { length: number };
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

const ArticlePage = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [bestArticles, setBestArticles] = useState<Article[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [orderBy, setOrderBy] = useState<OrderByValue>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [articlesPerPage] = useState<number>(4);

  const fetchData = async () => {
    try {
      const data = await fetchArticlesFromAPI({
        page: currentPage,
        limit: articlesPerPage,
        sort: orderBy,
        keyword,
      });

      setAllArticles(data.articles);

      const best = [...data.articles].sort((a, b) => b.likeCount - a.likeCount);
      setBestArticles(best.slice(0, 3));
    } catch (err) {
      console.error("데이터 가져오기 실패:", err);
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
      />
    </div>
  );
};

export default ArticlePage;

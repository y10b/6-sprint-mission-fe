"use client";

import { useEffect, useState } from "react";
import BestArticles from "@/components/articles/BestArticles";
import Articles from "@/components/articles/Articles";

const ArticlePage = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [bestArticles, setBestArticles] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [orderBy, setOrderBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(4);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const res = await fetch(`http://localhost:5000/articles`);
        const data = await res.json();

        const sortedLatest = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const sortedBest = [...data].sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );

        setAllArticles(sortedLatest);
        setBestArticles(sortedBest.slice(0, 3));
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
      }
    };

    fetchAllArticles();
  }, []);

  // 정렬 기준 변경 시
  useEffect(() => {
    const sorted = [...allArticles];

    if (orderBy === "favorite") {
      sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setAllArticles(sorted);
  }, [orderBy]);

  return (
    <div className="max-w-6xl mx-auto overflow-x-hidden overflow-y-auto">
      <BestArticles articles={bestArticles} />
      <Articles
        articles={allArticles}
        keyword={keyword}
        setKeyword={setKeyword}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        articlesPerPage={articlesPerPage}
      />
    </div>
  );
};

export default ArticlePage;

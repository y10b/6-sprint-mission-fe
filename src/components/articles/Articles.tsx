"use client";
import Link from "next/link";
import Search from "@/components/Search";
import Filters, { OrderByValue } from "@/components/Filters";
import Pagination from "@/components/Pagination";
import ArticleList from "@/components/articles/ArticleList";
import { Dispatch, SetStateAction } from "react";

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

interface ArticlesProps {
  articles: Article[];
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  orderBy: OrderByValue;
  setOrderBy: (value: OrderByValue) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  articlesPerPage: number;
}

const Articles = ({
  articles,
  keyword,
  setKeyword,
  orderBy,
  setOrderBy,
  currentPage,
  setCurrentPage,
  articlesPerPage,
}: ArticlesProps) => {
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handleSearch = (text: string) => {
    setKeyword(text);
  };

  return (
    <div className="article-list mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">게시글</h1>
        <Link href="/articles/createArticle">
          <button className="bg-primary-100 text-white px-6 py-2 rounded-lg text-lg cursor-pointer">
            글쓰기
          </button>
        </Link>
      </div>

      <div className="search-filters flex justify-between items-center  mt-6">
        <Search
          keyword={keyword}
          setKeyword={setKeyword}
          variant="long"
          onSearch={handleSearch}
        />
        <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
      </div>

      <ArticleList articles={currentArticles} />

      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        hasNext={currentPage < totalPages}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Articles;

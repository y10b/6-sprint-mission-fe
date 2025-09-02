"use client";
import Link from "next/link";
import Search from "@/components/Search";
import Filters, { OrderByValue } from "@/components/Filters";
import Pagination from "@/components/Pagination";
import ArticleList from "@/components/articles/ArticleList";
import { Dispatch, SetStateAction } from "react";
import { IArticle } from "@/types";

interface IArticlesProps {
  articles: IArticle[];
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  orderBy: OrderByValue;
  setOrderBy: (value: OrderByValue) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  articlesPerPage: number;
  totalCount: number;
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
  totalCount,
}: IArticlesProps) => {
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / articlesPerPage);

  const handleSearch = (text: string) => {
    setKeyword(text);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  return (
    <div className="article-list mt-10 mb-[135px] ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">게시글</h1>
        <Link href="/articles/createArticle">
          <button className="bg-primary-100 text-white px-6 py-2 rounded-lg text-lg cursor-pointer">
            글쓰기
          </button>
        </Link>
      </div>

      <div className="search-filters flex justify-between items-center mt-6">
        <Search
          keyword={keyword}
          setKeyword={setKeyword}
          variant="long"
          onSearch={handleSearch}
        />
        <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
      </div>

      <ArticleList articles={articles} />

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

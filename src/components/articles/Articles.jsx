"use client";
import Link from "next/link";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import ArticleList from "@/components/articles/ArticleList";

const Articles = ({
  articles,
  keyword,
  setKeyword,
  orderBy,
  setOrderBy,
  currentPage,
  setCurrentPage,
  articlesPerPage,
}) => {
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

  return (
    <div className="article-list mt-10">
      <div className="article-header flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">게시글</h1>
        <Link href="/articles/createArticle">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg cursor-pointer">
            글쓰기
          </button>
        </Link>
      </div>

      <div className="search-filters flex justify-between items-center mt-6">
        <Search keyword={keyword} setKeyword={setKeyword} variant="long" />
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

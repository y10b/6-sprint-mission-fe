"use client";
import Card from "@/components/articles/Card";

const BestArticles = ({ articles = [], defaultImage }) => {
  return (
    <div className="best-articles">
      <h1 className="mt-5 mb-4 text-2xl font-bold text-gray-900">
        베스트 게시글
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => {
          let visibilityClass = "hidden";

          if (index === 0) {
            visibilityClass = "block"; // 모바일 기본 1개
          } else if (index === 1) {
            visibilityClass = "hidden md:block"; // 두 번째는 md부터 보임
          } else if (index === 2) {
            visibilityClass = "hidden lg:block"; // 세 번째는 lg부터 보임
          }

          return (
            <div key={article.id} className={visibilityClass}>
              <Card article={article} defaultImage={defaultImage} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BestArticles;

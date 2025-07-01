"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TfiBackLeft } from "react-icons/tfi";
import { logger } from "@/utils/logger";

import PostDetail from "@/components/articles/ArticleDetail";
import CommentSection from "@/components/comments/_article/commentsection";
import { IArticle as ArticleType, IArticleComment } from "@/types/article";
import { getArticle } from "@/lib/api/articles/articlesApi";
import { getArticleComments } from "@/lib/api/comments/commentsApi";

// 상태를 더 명시적으로 관리하는 타입
type ArticleState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: ArticleType };

const Article = () => {
  const [articleState, setArticleState] = useState<ArticleState>({
    status: "loading",
  });
  const [comments, setComments] = useState<IArticleComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setArticleState({ status: "loading" });

          const articleData = await getArticle(Number(id));
          setArticleState({ status: "success", data: articleData });

          const commentData = await getArticleComments(Number(id));

          setComments(commentData);
        } catch (err) {
          logger.error("데이터 로딩 실패:", err);
          setArticleState({
            status: "error",
            message: "게시글을 불러오는데 실패했습니다.",
          });
        }
      };

      fetchData();
    }
  }, [id]);

  // 상태별 렌더링
  if (articleState.status === "loading") {
    return <p className="text-center mt-8">게시글을 로딩 중입니다...</p>;
  }

  if (articleState.status === "error") {
    return (
      <p className="text-center mt-8 text-red-500">{articleState.message}</p>
    );
  }

  // 이제 articleState.status === 'success'이므로 data가 보장됨
  const post = articleState.data;

  return (
    <div className="container mx-auto mt-8 px-4">
      <PostDetail
        post={post}
        onLikeToggle={(_: number, newCount: number) =>
          setArticleState({
            status: "success",
            data: { ...post, likeCount: newCount },
          })
        }
      />

      <CommentSection
        articleId={post.id}
        comments={comments}
        setComments={setComments}
        newComment={newComment}
        setNewComment={setNewComment}
      />

      <div className="mt-16 text-center mb-[319px] sm:mb-[219px] md:mb-[193px]">
        <Link href="/articles">
          <button className="mx-auto flex gap-2 w-[240px] px-12 py-3 bg-primary-100 text-[18px] text-gray-100 font-[600] rounded-[40px] hover:bg-primary-300 cursor-pointer relative">
            목록으로 돌아가기
            <span className="absolute right-6 top-4.5">
              <TfiBackLeft className="w-[19px] h-4" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Article;

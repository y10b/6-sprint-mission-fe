"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TfiBackLeft } from "react-icons/tfi";

import PostDetail from "@/components/articles/ArticleDetail";
import CommentSection from "@/components/comments/_article/commentsection";
import { IArticle as ArticleType, ArticleComment } from "@/types/article";
import { getArticle } from "@/lib/api/articles/articlesApi";
import { getArticleComments } from "@/lib/api/comments/commentsApi";

// Article 초기값 객체 – null 사용을 피함
const initialArticle: ArticleType = {
  id: 0,
  title: "",
  content: "",
  authorNickname: "",
  user: {
    id: 0,
    nickname: "",
  },
  authorImage: null,
  images: "",
  likeCount: 0,
  isLiked: false,
  createdAt: "",
};

const Article = () => {
  const [post, setPost] = useState<ArticleType>(initialArticle);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const articleData = await getArticle(Number(id));
          setPost(articleData);

          const commentData = await getArticleComments(Number(id));
          console.log("Fetched comments:", commentData);
          setComments(commentData);
        } catch (err) {
          console.error("데이터 로딩 실패:", err);
        }
      };

      fetchData();
    }
  }, [id]);

  // 데이터가 아직 로딩되지 않은 상태 판단 (id === 0)
  if (post.id === 0) return <p>게시글을 로딩 중입니다...</p>;

  return (
    <div className="container mx-auto mt-8 px-4">
      <PostDetail
        post={post}
        onLikeToggle={(_: number, newCount: number) =>
          setPost((prev) => ({ ...prev, likeCount: newCount }))
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

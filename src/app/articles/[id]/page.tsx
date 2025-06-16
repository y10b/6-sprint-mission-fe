"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TfiBackLeft } from "react-icons/tfi";

import PostDetail from "@/components/articles/ArticleDetail";
import CommentSection from "@/components/comments/_article/commentsection";
import { Article as ArticleType, Comment } from "@/types/article";

const Article = () => {
  const [post, setPost] = useState<ArticleType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/articles/${id}`);
          if (!response.ok) {
            throw new Error("게시글을 불러오는데 실패했습니다.");
          }
          const articleData = await response.json();
          setPost(articleData);

          const commentResponse = await fetch(
            `http://localhost:5000/comments/articles/${id}`
          );
          if (!commentResponse.ok) {
            throw new Error("댓글을 불러오는데 실패했습니다.");
          }
          const commentData = await commentResponse.json();
          setComments(commentData.comments || []);
        } catch (err) {
          console.error("데이터 로딩 실패:", err);
        }
      };

      fetchData();
    }
  }, [id]);

  if (!post) return <p>게시글을 로딩 중입니다...</p>;

  return (
    <div className="container mx-auto mt-8 px-4">
      <PostDetail
        post={post}
        onLikeToggle={(id: number, newCount: number) =>
          setPost((prev) =>
            prev ? { ...prev, likes: { length: newCount } } : null
          )
        }
      />

      <CommentSection
        articleId={post.id}
        comments={comments}
        setComments={setComments}
        newComment={newComment}
        setNewComment={setNewComment}
      />

      <div className="mt-16 text-center">
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

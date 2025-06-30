import { Dispatch, SetStateAction } from "react";
import { IArticle } from "./article";

// === Article 컴포넌트 Props 타입들 ===
export interface ArticleCardProps {
  article: IArticle;
  defaultImage?: string;
}

export interface ArticleListProps {
  articles: IArticle[];
}

export interface ArticleDetailProps {
  post: IArticle;
  onLikeToggle: (id: number, newCount: number) => void;
}

export interface BestArticlesProps {
  articles: IArticle[];
  defaultImage: string;
}

// === 공통 UI Props 타입들 ===
export interface SearchProps {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  variant?: "short" | "long";
  onSearch?: (text: string) => void;
}

export interface PaginationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  hasNext: boolean;
  totalPages: number;
}

// === 좋아요 컴포넌트 Props ===
export interface LikeComponentProps {
  articleId: number;
  initialCount: number;
  onLikeToggle?: (id: number, newCount: number) => void;
}

// === 드롭다운 메뉴 Props ===
export interface DropdownMenuProps {
  type: "product" | "article" | "comment";
  itemId: number;
  parentId?: number;
  baseUrl?: string;
  onDelete?: () => void;
}

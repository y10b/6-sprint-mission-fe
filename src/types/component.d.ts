import { Dispatch, SetStateAction } from "react";
import { IArticle } from "./article";
import { TId, TButtonVariant, TButtonSize } from "./common";

/**
 * 컴포넌트 Props 관련 타입 및 인터페이스 정의
 * (공통 타입은 common.d.ts에서 관리)
 */

// === Article 컴포넌트 Props 타입들 ===
export interface IArticleCardProps {
  article: IArticle;
  defaultImage?: string;
}

export interface IArticleListProps {
  articles: IArticle[];
}

export interface IArticleDetailProps {
  post: IArticle;
  onLikeToggle: (id: TId, newCount: number) => void;
}

export interface IBestArticlesProps {
  articles: IArticle[];
  defaultImage: string;
}

// === 공통 UI Props 타입들 ===
export interface ISearchProps {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  variant?: "short" | "long";
  onSearch: (text: string) => void;
}

export interface IPaginationProps {
  page: number;
  setPage: (page: number) => void;
  hasNext: boolean;
  totalPages: number;
}

export interface IButtonProps {
  variant?: TButtonVariant;
  size?: TButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// === 좋아요 컴포넌트 Props ===
export interface ILikeComponentProps {
  articleId: TId;
  initialCount: number;
  onLikeToggle?: (id: TId, newCount: number) => void;
}

// === 드롭다운 메뉴 Props ===
export interface IDropdownMenuProps {
  type: "product" | "article" | "comment";
  itemId: TId;
  parentId?: TId;
  baseUrl?: string;
  onDelete?: () => void;
}

// === 이미지 업로더 Props ===
export interface IImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

// === 태그 입력 Props ===
export interface ITagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

// === 폼 입력 Props ===
export interface IFormInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (value: string) => void;
}

export interface IFormTextareaProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
}

// === 모달 Props ===
export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface IDeleteModalProps extends IModalProps {
  onConfirm: () => void;
  itemName?: string;
}

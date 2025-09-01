import {
  IBaseEntity,
  TId,
  IPaginatedResponse,
  IPaginationParams,
  IImageData,
  IUploadedImage,
} from "./common";

/**
 * 상품 관련 특화 타입 및 인터페이스 정의
 * (공통 타입은 common.d.ts에서 관리)
 */

// 상품 댓글 타입 (comment.d.ts에서 import)
export type { IProductComment } from "./comment";

// === 상품 엔티티 ===
export interface IProduct extends IBaseEntity {
  name: string;
  description: string;
  price: number;
  tags: string[];
  sellerId: TId;
  sellerNickname: string;
  comments: IProductComment[];
  favoriteCount: number;
  isLiked: boolean;
  images: string[];
}

// === API 응답 타입 ===
export interface IProductsResponse extends IPaginatedResponse<IProduct> {}

// === API 입력 타입 ===
export interface ICreateProductInput {
  name: string;
  description: string;
  tags: string[];
  price: number;
  imageUrls: string[];
}

export type TUpdateProductInput = Partial<ICreateProductInput>;

// === 폼 데이터 타입 ===
export interface ICreateProductFormData {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface IEditableProductFields {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface IEditProductFormState extends IEditableProductFields {
  isValid: boolean;
  isDirty: boolean;
  sellerId?: TId;
}

// === 상품 파라미터 타입 ===
export interface IProductPaginationParams extends IPaginationParams {
  sortBy?: "latest" | "oldest" | "favorite";
}

interface Comment {
  id: number;
  content: string;
  userId: number;
  articleId: number | null;
  productId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  sellerId: number;
  sellerNickname: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  favoriteCount: number;
  isLiked: boolean;
  images: string[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyword?: string;
}

export interface ProductsResponse {
  list: Product[];
  totalCount: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  tags: string[];
  price: number;
  imageUrls: string[];
}

export type UpdateProductInput = Partial<CreateProductInput>;

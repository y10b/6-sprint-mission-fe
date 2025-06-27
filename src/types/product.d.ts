export interface IProduct {
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

export interface IPaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyword?: string;
}

export interface IProductsResponse {
  list: IProduct[];
  totalCount: number;
}

export interface ICreateProductInput {
  name: string;
  description: string;
  tags: string[];
  price: number;
  imageUrls: string[];
}

export type TUpdateProductInput = Partial<ICreateProductInput>;

// --- UI/Form 전용 타입들 ---

export interface ImageData {
  file: File;
  url: string;
}

export interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface EditableProductFields {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface UploadedImage {
  file: File;
  url: string;
}

export interface EditProductFormState extends EditableProductFields {
  isValid: boolean;
  isDirty: boolean;
  sellerId?: number;
}

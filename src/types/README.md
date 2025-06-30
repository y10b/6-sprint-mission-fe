# 타입 시스템 사용 가이드

## 개요

프로젝트의 모든 타입 정의가 `@/types`에서 중앙 관리됩니다.

## 환경변수 설정

프론트엔드 프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_API_URL=http://3.34.5.30:5000
NEXT_PUBLIC_API_AUTH=http://3.34.5.30:5000/api/auth
```

## 사용법

### 1. 중앙화된 import

```typescript
// ❌ 개별 파일에서 import
import { IProduct } from "@/types/product";
import { IArticle } from "@/types/article";

// ✅ 중앙화된 index에서 import
import { IProduct, IArticle, ApiResponse, IUser, IComment } from "@/types";
```

### 2. API 응답 타입 활용

```typescript
// 일반적인 API 응답
export const createProduct = async (
  data: ICreateProductInput
): Promise<ApiResponse<IProduct>> => {
  // ...
};

// 페이지네이션이 포함된 응답
export const getProducts = async (): Promise<PaginatedResponse<IProduct>> => {
  // ...
};

// 인증 관련 API
export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  // ...
};
```

### 3. 댓글 시스템 타입

```typescript
// 상품 댓글
const productComment: IProductComment = {
  id: 1,
  content: "좋은 상품이네요!",
  productId: 123,
  userId: 456,
  user: { id: 456, nickname: "사용자" },
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
};

// 게시글 댓글
const articleComment: IArticleComment = {
  id: 2,
  content: "좋은 글입니다!",
  articleId: 789,
  productId: null,
  userId: 456,
  user: { id: 456, nickname: "사용자" },
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
};
```

### 4. BaseEntity 확장

```typescript
// 모든 엔티티는 BaseEntity를 확장
interface IProduct extends BaseEntity {
  // id, createdAt, updatedAt이 자동으로 포함됨
  name: string;
  price: number;
}
```

## 파일 구조

```
src/types/
├── index.ts          # 중앙 export 파일
├── auth.d.ts         # 인증 관련 타입 (IUser, LoginInput, AuthResponse 등)
├── product.d.ts      # 상품 관련 타입 (IProduct, ICreateProductInput 등)
├── article.d.ts      # 게시글 관련 타입 (IArticle, ICreateArticleInput 등)
├── comment.d.ts      # 댓글 관련 타입 (IComment, IProductComment, IArticleComment 등)
├── image.d.ts        # 이미지 관련 타입
└── README.md         # 이 문서
```

## 타입 명명 규칙

- **인터페이스**: `I` 접두사 (예: `IProduct`, `IUser`, `IComment`)
- **타입 별칭**: `T` 접두사 (예: `TUpdateInput`)
- **응답 타입**: `Response` 접미사 (예: `IProductsResponse`, `AuthResponse`)
- **입력 타입**: `Input` 접미사 (예: `ICreateProductInput`, `LoginInput`)
- **폼 데이터**: `FormData` 접미사 (예: `SignupFormData`)

## 일반적인 패턴

### CRUD 타입 패턴

```typescript
// 기본 엔티티
interface IProduct extends BaseEntity { ... }

// 목록 응답
interface IProductsResponse extends PaginatedResponse<IProduct> { }

// 생성 입력
interface ICreateProductInput { ... }

// 수정 입력 (Partial)
type TUpdateProductInput = Partial<ICreateProductInput>;
```

### API 함수 타입 패턴

```typescript
// 단일 엔티티 반환
export const getProduct = async (id: number): Promise<IProduct> => { ... }

// 목록 반환
export const getProducts = async (): Promise<IProductsResponse> => { ... }

// 생성/수정
export const createProduct = async (data: ICreateProductInput): Promise<ApiResponse<IProduct>> => { ... }

// 삭제
export const deleteProduct = async (id: number): Promise<ApiResponse<void>> => { ... }
```

### 인증 API 패턴

```typescript
// 로그인
export const login = async (credentials: LoginInput): Promise<AuthResponse> => { ... }

// 회원가입
export const signup = async (userData: SignupInput): Promise<AuthResponse> => { ... }

// 사용자 정보 조회
export const getCurrentUser = async (): Promise<IUser | null> => { ... }
```

### 댓글 API 패턴

```typescript
// 댓글 조회
export const getComments = async (params: GetCommentsParams): Promise<GetCommentsResponse> => { ... }

// 댓글 작성
export const createComment = async (data: CreateCommentInput): Promise<CommentResponse> => { ... }

// 댓글 수정
export const updateComment = async (id: number, data: UpdateCommentInput): Promise<CommentResponse> => { ... }
```

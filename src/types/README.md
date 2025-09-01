# 🎯 타입 시스템 사용 가이드 (리팩토링 버전)

## 📋 개요

프로젝트의 모든 타입 정의가 `@/types`에서 **백엔드와 동일한 패턴**으로 중앙 관리됩니다.

## ⚙️ 환경변수 설정

프론트엔드 프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_API_URL=http://3.34.5.30:5000
NEXT_PUBLIC_API_AUTH=http://3.34.5.30:5000/api/auth
```

## 🔧 사용법

### 1. ✅ 중앙화된 import (백엔드 스타일)

```typescript
// ❌ 기존 방식 - 개별 파일에서 import
import { IProduct } from "@/types/product";
import { IArticle } from "@/types/article";

// ✅ 새로운 방식 - 중앙화된 index에서 import (백엔드와 동일)
import { IProduct, IArticle, IApiResponse, IUser, IComment } from "@/types";
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

## 🏷️ 타입 명명 규칙 (백엔드와 통일)

### ✅ **새로운 규칙 (백엔드와 동일)**

- **인터페이스**: `I` 접두사 (예: `IProduct`, `IUser`, `IComment`)
- **타입 별칭**: `T` 접두사 (예: `TUpdateInput`, `TId`, `TSortOrder`)
- **응답 타입**: `I` + `Response` (예: `IProductsResponse`, `IAuthResponse`)
- **입력 타입**: `I` + `Input` (예: `ICreateProductInput`, `ILoginInput`)
- **폼 데이터**: `I` + `FormData` (예: `ISignupFormData`)

### 📁 **파일 구조 (백엔드 스타일)**

```
src/types/
├── common.d.ts       # 🆕 공통 타입 중앙 관리 (백엔드의 express.d.ts와 같은 역할)
├── index.ts          # 중앙 export 파일
├── auth.d.ts         # 인증 특화 타입
├── product.d.ts      # 상품 특화 타입
├── article.d.ts      # 게시글 특화 타입
├── comment.d.ts      # 댓글 특화 타입
├── component.d.ts    # 컴포넌트 Props 타입
├── image.d.ts        # 이미지 특화 타입
└── README.md         # 이 문서
```

### 🔄 **레거시 호환성**

기존 코드와의 호환성을 위해 타입 별칭을 제공합니다:

```typescript
// 기존 코드는 그대로 작동
import { ApiResponse, BaseEntity, ImageData } from "@/types";

// 새로운 코드는 I/T 접두사 사용 권장
import { IApiResponse, IBaseEntity, IImageData } from "@/types";
```

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

import { getArticle, getArticleList, createArticle, deleteArticle, patchArticle } from "./ArticleService.js"
import { getProduct, getProductList, createProduct, deleteProduct, patchProduct } from "./ProductService.js"

/* artice */
console.log("Article API test START");

// 게시글 목록 조회(1page, 5pagesize, keyword="")
const ArticleList = await getArticleList(1, 5, "");
console.log(ArticleList)

// 게시글 상세 조회(ID:7 게시글 조회)
const ArticleId = await getArticle(7);

// 게시글 등록
const newArticle = await createArticle(
    "테스트 제목",
    "이것은 테스트 내용입니다.",
    "https://example.com/sample-image.jpg"
);
console.log(newArticle)

// 게시글 수정(ID:3 게시글 수정)
const updateArticle = await patchArticle(
    3,
    "수정된 제목",
    "수정된 내용입니다.",
    "https://example.com/updated-image.jpg"
);
console.log(updateArticle)

// 게시글 삭제(ID:5 게시글 삭제)
const deleteResultArticle = await deleteArticle(5);






/* product */
console.log("Product API test START");

// 상품 목록 조회(1page 5pagesize keyword:"")
const productList = await getProductList(1, 5, "");
console.log(productList);

// 상품 상세 조회(ID:7 상품 조회)
const productDetails = await getProduct(7);
console.log(productDetails);

// 상품 등록
const newProduct = await createProduct(
    "테스트 상품",
    "이것은 테스트용 상품입니다.",
    19900,
    "테스트 제조사",
    ["전자제품", "테스트"],
    ["https://example.com/sample-product.jpg"]
);

// 상품 수정(ID:13)
const updatedProduct = await patchProduct(13, {
    name: "수정된 상품명",
    price: 29900
});

// 상품 삭제(ID:18)
const deleteResultProduct = await deleteProduct(18);

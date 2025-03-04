const baseURL = "https://panda-market-api.vercel.app/products";

/* 상품 목록 조회 */
export async function getProductList(
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword = ""
) {
  try {
    const url = new URL(baseURL);

    // URL 파라미터 설정
    url.searchParams.append("page", page);
    url.searchParams.append("pageSize", pageSize);
    url.searchParams.append("orderBy", orderBy); // 정렬 기준 (favorite 또는 recent)

    if (keyword) {
      url.searchParams.append("keyword", keyword);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`상품 목록 조회 실패: ${response.statusText}`);
    }

    const data = await response.json();

    // totalCount를 기반으로 totalPages 계산
    const totalPages = Math.ceil(data.totalCount / pageSize);

    return {
      list: data.list,
      hasNext: page < totalPages, // 다음 페이지가 있는지 여부
      totalPages, // 전체 페이지 수
    };
  } catch (error) {
    console.error("오류: 상품 목록 조회", error);
    return { list: [], hasNext: false, totalPages: 1 };
  }
}

/* 상품 생성 */
export async function createProduct(productData) {
  try {
    const url = new URL(baseURL);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData), // 상품 정보를 JSON 형식으로 전송
    });

    if (!response.ok) {
      throw new Error(`상품 생성 실패: ${response.statusText}`);
    }

    const data = await response.json();

    // 성공적으로 생성된 상품 반환
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      tags: data.tags,
      images: data.images,
      favoriteCount: data.favoriteCount,
      createdAt: data.createdAt,
      ownerId: data.ownerId,
    };
  } catch (error) {
    console.error("오류: 상품 생성", error);
    return null; // 실패시 null 반환
  }
}

/* 상품 상세 조회 */
export async function getProductDetail(productId) {
  try {
    const url = new URL(`${baseURL}/${productId}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`상품 상세 조회 실패: ${response.statusText}`);
    }

    const data = await response.json();

    // 성공적으로 상품 정보를 반환
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      tags: data.tags,
      images: data.images,
      favoriteCount: data.favoriteCount,
      createdAt: data.createdAt,
      ownerId: data.ownerId,
      isFavorite: data.isFavorite,
    };
  } catch (error) {
    console.error("오류: 상품 상세 조회", error);
    return null; // 실패 시 null 반환
  }
}

/* 상품 수정 */
export async function updateProduct(productId, updatedData) {
  try {
    const url = new URL(`${baseURL}/${productId}`);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData), // 수정할 상품 정보를 JSON 형식으로 전송
    });

    if (!response.ok) {
      throw new Error(`상품 수정 실패: ${response.statusText}`);
    }

    const data = await response.json();

    // 수정된 상품 정보를 반환
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      tags: data.tags,
      images: data.images,
      favoriteCount: data.favoriteCount,
      createdAt: data.createdAt,
      ownerId: data.ownerId,
      isFavorite: data.isFavorite,
    };
  } catch (error) {
    console.error("오류: 상품 수정", error);
    return null; // 실패 시 null 반환
  }
}

/* 상품 삭제 */
export async function deleteProduct(productId) {
  try {
    const url = new URL(`${baseURL}/${productId}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`상품 삭제 실패: ${response.statusText}`);
    }

    const data = await response.json();

    // 삭제 성공 시 상품 ID 반환
    return {
      id: data.id,
    };
  } catch (error) {
    console.error("오류: 상품 삭제", error);
    return null; // 실패 시 null 반환
  }
}

// 상품 좋아요 추가
export async function addProductToFavorite(productId) {
  try {
    const url = new URL(`${baseURL}/${productId}/favorite`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`상품 좋아요 추가 실패: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      favoriteCount: data.favoriteCount,
      isFavorite: true,
    };
  } catch (error) {
    console.error("오류: 상품 좋아요 추가", error);
    return null;
  }
}

// 상품 좋아요 취소
export async function removeProductFromFavorite(productId) {
  try {
    const url = new URL(`${baseURL}/${productId}/favorite`);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`상품 좋아요 취소 실패: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      favoriteCount: data.favoriteCount,
      isFavorite: false,
    };
  } catch (error) {
    console.error("오류: 상품 좋아요 취소", error);
    return null;
  }
}
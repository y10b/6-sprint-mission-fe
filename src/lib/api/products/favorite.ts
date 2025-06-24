const BASE_URL = "http://localhost:5000/api";

export async function addFavorite(productId: number) {
  if (!productId) {
    throw new Error("상품 ID가 없습니다.");
  }
  const url = `${BASE_URL}/products/${productId}/like`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "좋아요 추가 실패");
  }

  return await res.json();
}

export async function removeFavorite(productId: number) {
  if (!productId) {
    throw new Error("상품 ID가 없습니다.");
  }

  const res = await fetch(`${BASE_URL}/products/${productId}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "좋아요 삭제 실패");
  }

  return await res.json();
}

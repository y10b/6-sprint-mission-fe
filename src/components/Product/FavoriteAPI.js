// FavoriteAPI.js
export const addFavorite = async (productId) => {
    try {
        const response = await fetch(`/api/favorite/${productId}`, {
            method: "POST",
        });
        if (response.ok) {
            return true; // 성공적으로 좋아요를 추가했을 때
        } else {
            console.error("서버에서 좋아요를 추가하지 못했습니다.");
            return false;
        }
    } catch (error) {
        console.error("좋아요 추가 실패:", error);
        return false;
    }
};

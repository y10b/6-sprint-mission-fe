const BASE_URL = "http://localhost:5000/api";

// 이미지 업로드
export const uploadImage = async (selectedFile) => {
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
        const response = await fetch(`${BASE_URL}/upload`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("이미지 업로드 실패");
        }

        const data = await response.json();

        console.log("✅ 업로드 응답 데이터:", data); // ✅ 이거 꼭 추가!

        return data.imageUrl;
    } catch (error) {
        console.error("이미지 업로드 중 오류:", error);
        throw error;
    }
};
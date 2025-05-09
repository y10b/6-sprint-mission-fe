const BASE_URL = "http://localhost:5000/api";

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    // 로컬스토리지에서 accessToken을 가져옴
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error("Authorization token is missing");
    }

    try {
        const response = await fetch(`${BASE_URL}/images/upload`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("이미지 업로드 실패");
        }

        const data = await response.json();
        return data.url; // 업로드된 이미지 URL 반환
    } catch (error) {
        console.error("이미지 업로드 중 오류:", error);
        throw error;
    }
};

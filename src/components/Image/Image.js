const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile); // 이미지 파일 추가

    try {
        const response = await fetch('https://panda-market-api.vercel.app/images/upload', {
            method: 'POST',
            body: formData, // formData를 본문에 포함시켜 이미지 업로드
        });

        if (!response.ok) {
            throw new Error(`이미지 업로드 실패: ${response.statusText}`);
        }

        const data = await response.json();

        // 업로드된 이미지 URL 반환
        return data.url;
    } catch (error) {
        console.error("오류: 이미지 업로드", error);
        return null;
    }
};

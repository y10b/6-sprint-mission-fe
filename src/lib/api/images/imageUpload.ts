import { logger } from "@/utils/logger";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

// 이미지 업로드
export const uploadImage = async (selectedFile: File) => {
  try {
    // 1) Presigned URL 요청
    const presignedRes = await fetch(`${BASE_URL}/upload/presigned`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      }),
    });

    if (!presignedRes.ok) {
      throw new Error("Presigned URL 생성 실패");
    }

    const { uploadUrl, fileUrl } = await presignedRes.json();

    // 2) S3에 직접 업로드
    const s3UploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": selectedFile.type },
      body: selectedFile,
    });

    if (!s3UploadRes.ok) {
      throw new Error("S3 업로드 실패");
    }

    return fileUrl as string;
  } catch (error) {
    logger.error("이미지 업로드 중 오류", error);
    throw error;
  }
};
